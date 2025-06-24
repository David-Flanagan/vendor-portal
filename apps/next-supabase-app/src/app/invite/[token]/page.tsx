'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Alert,
  AlertDescription,
  Badge,
} from '@beach-box/unify-ui';
import {
  UserPlus,
  Building,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Invitation {
  id: string;
  company_id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  message: string | null;
  companies: {
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
  };
  invited_by_user: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export default function InviteAcceptPage() {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const params = useParams();
  const router = useRouter();
  const { user, signIn } = useAuth();
  const token = params.token as string;

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token]);

  const fetchInvitation = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          *,
          companies (
            name,
            slug,
            description,
            logo_url
          ),
          invited_by_user:user_profiles!invited_by (
            first_name,
            last_name
          )
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Invitation not found or has already been accepted.');
        } else {
          throw error;
        }
        return;
      }

      // Check if invitation has expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired.');
        return;
      }

      setInvitation(data);
    } catch (err: any) {
      console.error('Error fetching invitation:', err);
      setError(err.message || 'Failed to load invitation.');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!user || !invitation) return;

    setAccepting(true);
    try {
      // Check if user email matches invitation email
      if (user.email !== invitation.email) {
        throw new Error(`This invitation is for ${invitation.email}. Please sign in with the correct email address.`);
      }

      // Create company membership
      const { error: membershipError } = await supabase
        .from('company_memberships')
        .insert({
          company_id: invitation.company_id,
          user_id: user.id,
          role: invitation.role,
          status: 'active',
        });

      if (membershipError) {
        if (membershipError.code === '23505') {
          throw new Error('You are already a member of this company.');
        }
        throw membershipError;
      }

      // Update invitation status
      const { error: inviteError } = await supabase
        .from('invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', invitation.id);

      if (inviteError) throw inviteError;

      setSuccess(true);
      toast.success(`Welcome to ${invitation.companies.name}!`);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      setError(err.message || 'Failed to accept invitation.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <CardTitle className="text-red-600">Invitation Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <Link href="/signin">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="text-green-600">Welcome!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You've successfully joined {invitation?.companies.name}!
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-blue-500" />
            <CardTitle>Team Invitation</CardTitle>
            <CardDescription>
              You've been invited to join {invitation?.companies.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Please sign in with <strong>{invitation?.email}</strong> to accept this invitation.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Link href="/signin">
                <Button className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {invitation.companies.logo_url ? (
              <img
                src={invitation.companies.logo_url}
                alt={`${invitation.companies.name} logo`}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <Building className="h-16 w-16 text-gray-400" />
            )}
          </div>
          <CardTitle>Team Invitation</CardTitle>
          <CardDescription>
            You've been invited to join <strong>{invitation.companies.name}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Invitation Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Role:</span>
              <Badge variant="outline" className="capitalize">
                {invitation.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Invited by:</span>
              <span className="text-sm font-medium">
                {invitation.invited_by_user?.first_name && invitation.invited_by_user?.last_name
                  ? `${invitation.invited_by_user.first_name} ${invitation.invited_by_user.last_name}`
                  : 'Team Administrator'
                }
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expires:</span>
              <span className="text-sm">
                {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Personal Message */}
          {invitation.message && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Personal message:</strong><br />
                {invitation.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Company Description */}
          {invitation.companies.description && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                {invitation.companies.description}
              </p>
            </div>
          )}

          {/* Email Verification */}
          {user.email !== invitation.email && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This invitation is for {invitation.email}, but you're signed in as {user.email}.
                Please sign in with the correct email address.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={acceptInvitation}
              disabled={accepting || user.email !== invitation.email}
              className="w-full"
            >
              {accepting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accepting...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Accept Invitation
                </>
              )}
            </Button>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}