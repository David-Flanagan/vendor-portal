'use client';

import { redirect } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/dashboard';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated && !isLoading) {
    window.location.href = '/dashboard';
    return null;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8 flex justify-center items-center min-h-[50vh]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <div className="bg-white shadow rounded-lg p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-gray-600 mt-2">
            Sign in to your Atlas Payments account
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={['google', 'github']}
              redirectTo={`${window.location.origin}/dashboard`}
              view="sign_in"
            />
          </div>
        </div>
      </div>
    </div>
  );
}