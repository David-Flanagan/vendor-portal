import React from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from '@tanstack/react-router';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('ProtectedRoute - State:', { user: !!user, loading });

  React.useEffect(() => {
    if (!loading && !user) {
      console.log('Redirecting to signin - no user found');
      navigate({ to: '/signin' });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <div>Loading authentication...</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
          Loading: {loading.toString()}, User: {user ? 'Present' : 'None'}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <div>No user found, redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
} 