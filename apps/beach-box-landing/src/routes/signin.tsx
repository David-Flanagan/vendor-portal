import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 32, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff' }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
          />
        </div>
        {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <a href="/signup" style={{ color: '#2563eb' }}>Don&apos;t have an account? Sign Up</a>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/signin')({
  component: SignIn,
}); 