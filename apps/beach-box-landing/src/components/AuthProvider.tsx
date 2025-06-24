import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      console.log('AuthProvider - Starting getUser...');
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log('AuthProvider - getUser result:', { user: data.user, error });
        if (error) {
          console.error('Error getting user:', error);
        }
        setUser(data.user);
      } catch (error) {
        console.error('Error in getUser:', error);
      } finally {
        console.log('AuthProvider - Setting loading to false');
        setLoading(false);
      }
    };
    
    getUser();
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider - Auth state change:', _event, session?.user);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  console.log('AuthProvider - Current state:', { user: !!user, loading });

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 