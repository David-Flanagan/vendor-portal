'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedLoginForm } from '@/components/auth';
import { useAuth } from '@/lib/auth';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <EnhancedLoginForm className="w-full max-w-md" />
    </div>
  );
}