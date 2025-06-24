'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  Company,
  UserProfile,
  CompanyMembership,
  CompanyWithMembership,
  UserWithProfile
} from '@/types/supabase';
import { toast } from 'react-hot-toast';

type AuthContextType = {
  // User data
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;

  // Company data
  currentCompany: CompanyWithMembership | null;
  companies: CompanyWithMembership[];
  membership: CompanyMembership | null;

  // Auth methods
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signOut: () => Promise<void>;

  // Company methods
  switchCompany: (companyId: string) => Promise<void>;
  createCompany: (data: { name: string; slug: string; description?: string }) => Promise<Company>;

  // Profile methods
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;

  // Permission checks
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  isSystemAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // User state
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Company state
  const [currentCompany, setCurrentCompany] = useState<CompanyWithMembership | null>(null);
  const [companies, setCompanies] = useState<CompanyWithMembership[]>([]);
  const [membership, setMembership] = useState<CompanyMembership | null>(null);

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Fetch user companies and memberships
  const fetchCompanies = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('company_memberships')
        .select(`
          *,
          companies (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching companies:', error);
        return [];
      }

      const companiesWithMembership = data?.map(membership => ({
        ...membership.companies as Company,
        membership
      })) || [];

      setCompanies(companiesWithMembership);

      // Set current company (first one or from localStorage)
      const storedCompanyId = localStorage.getItem('currentCompanyId');
      let selectedCompany = companiesWithMembership[0] || null;

      if (storedCompanyId) {
        const found = companiesWithMembership.find(c => c.id === storedCompanyId);
        if (found) selectedCompany = found;
      }

      if (selectedCompany) {
        setCurrentCompany(selectedCompany);
        setMembership(selectedCompany.membership);
        localStorage.setItem('currentCompanyId', selectedCompany.id);
      }

      return companiesWithMembership;
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setSession(session);
          setUser(session.user);

          // Fetch profile and companies
          await Promise.all([
            fetchProfile(session.user.id),
            fetchCompanies(session.user.id)
          ]);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          setUser(session.user);

          await Promise.all([
            fetchProfile(session.user.id),
            fetchCompanies(session.user.id)
          ]);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setCurrentCompany(null);
          setCompanies([]);
          setMembership(null);
          localStorage.removeItem('currentCompanyId');
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return data;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      throw error;
    }

    router.push('/signin');
  };

  // Company methods
  const switchCompany = async (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
      setMembership(company.membership);
      localStorage.setItem('currentCompanyId', companyId);

      // Refresh the page to update any company-specific data
      router.refresh();
    }
  };

  const createCompany = async (data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<Company> => {
    if (!user) throw new Error('User not authenticated');

    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
        created_by: user.id
      })
      .select()
      .single();

    if (companyError) {
      toast.error(companyError.message);
      throw companyError;
    }

    // Create membership for the creator (owner)
    const { error: membershipError } = await supabase
      .from('company_memberships')
      .insert({
        company_id: company.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      });

    if (membershipError) {
      toast.error(membershipError.message);
      throw membershipError;
    }

    // Refresh companies list
    await fetchCompanies(user.id);

    toast.success('Company created successfully!');
    return company;
  };

  // Profile methods
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_profiles')
      .update(data)
      .eq('id', user.id);

    if (error) {
      toast.error(error.message);
      throw error;
    }

    // Update local state
    setProfile(prev => prev ? { ...prev, ...data } : null);
    toast.success('Profile updated successfully!');
  };

  // Permission helpers
  const hasRole = (roles: string | string[]): boolean => {
    if (!membership) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(membership.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!membership) return false;
    if (membership.role === 'owner') return true;
    return membership.permissions?.includes(permission) || false;
  };

  const isSystemAdmin = profile?.is_system_admin || false;

  const value: AuthContextType = {
    // User data
    user,
    profile,
    session,
    isLoading,

    // Company data
    currentCompany,
    companies,
    membership,

    // Auth methods
    signIn,
    signUp,
    signOut,

    // Company methods
    switchCompany,
    createCompany,

    // Profile methods
    updateProfile,

    // Permission checks
    hasRole,
    hasPermission,
    isSystemAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for route protection
export function withAuth<T extends {}>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/signin');
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Higher-order component for role-based access
export function withRole<T extends {}>(
  Component: React.ComponentType<T>,
  requiredRoles: string | string[]
) {
  return function RoleProtectedComponent(props: T) {
    const { hasRole, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (!hasRole(requiredRoles)) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}