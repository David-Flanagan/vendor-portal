'use client';

import { PasswordResetForm } from '@/components/auth';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect after successful email send
    setTimeout(() => {
      router.push('/signin');
    }, 3000);
  };

  const handleBack = () => {
    router.push('/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <PasswordResetForm
        onSuccess={handleSuccess}
        onBack={handleBack}
        className="w-full max-w-md"
      />
    </div>
  );
}