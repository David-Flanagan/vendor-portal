'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingWizard } from '@/components/auth';
import { useAuth } from '@/lib/auth';

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, currentCompany } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/signin');
    } else if (currentCompany) {
      // User already has a company, redirect to dashboard
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [user, currentCompany, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OnboardingWizard />
    </div>
  );
}