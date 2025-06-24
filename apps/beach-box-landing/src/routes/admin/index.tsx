import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

function AdminDashboard() {
  return (
    <div style={{ textAlign: 'center', marginTop: 80, color: '#64748b', fontSize: 20 }}>
      Sales dashboard and analytics coming soon.
    </div>
  );
}

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
}); 