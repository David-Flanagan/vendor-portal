'use client';

import { Suspense } from 'react';
import { EmailVerification } from '@/components/auth';

function EmailVerificationContent() {
  return <EmailVerification />;
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <EmailVerificationContent />
      </Suspense>
    </div>
  );
}