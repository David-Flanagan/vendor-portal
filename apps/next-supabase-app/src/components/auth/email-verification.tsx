'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';

interface EmailVerificationProps {
  email?: string;
  onResend?: () => void;
  onBackToSignIn?: () => void;
  className?: string;
}

export function EmailVerification({
  email,
  onResend,
  onBackToSignIn,
  className
}: EmailVerificationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is a verification callback
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (token && type === 'signup') {
      handleVerification(token);
    }
  }, [searchParams]);

  const handleVerification = async (token: string) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) throw error;

      setVerificationStatus('success');
      // Redirect to dashboard after successful verification
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email address is required to resend verification.');
      return;
    }

    setResendLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setResendSuccess(true);
      onResend?.();

      // Reset success state after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    if (onBackToSignIn) {
      onBackToSignIn();
    } else {
      router.push('/signin');
    }
  };

  if (verificationStatus === 'success') {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="mt-4">Email verified successfully!</CardTitle>
          <CardDescription>
            Your account has been verified. Redirecting to dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            If you're not redirected automatically, click the button below.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="mt-4">Verification failed</CardTitle>
          <CardDescription>
            The verification link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Please request a new verification email or try signing in again.
            </p>

            <div className="flex flex-col gap-2">
              {email && (
                <Button
                  onClick={handleResendEmail}
                  disabled={resendLoading}
                  variant="outline"
                >
                  {resendLoading ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send new verification email'
                  )}
                </Button>
              )}

              <Button onClick={handleBackToSignIn}>
                Back to Sign In
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="mt-4">Check your email</CardTitle>
        <CardDescription>
          We've sent a verification link to {email ? email : 'your email address'}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resendSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Verification email sent successfully! Check your inbox.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to verify your account. The link will expire in 24 hours.
          </p>

          <div className="text-sm text-muted-foreground">
            <p>Didn't receive the email?</p>
            <p>Check your spam folder or request a new one.</p>
          </div>

          <div className="flex flex-col gap-2">
            {email && (
              <Button
                onClick={handleResendEmail}
                disabled={resendLoading || resendSuccess}
                variant="outline"
              >
                {resendLoading ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendSuccess ? (
                  'Email sent!'
                ) : (
                  'Resend verification email'
                )}
              </Button>
            )}

            <Button onClick={handleBackToSignIn} variant="ghost">
              Back to Sign In
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Verifying your email...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}