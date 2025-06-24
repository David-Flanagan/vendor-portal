import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

function TestRoute() {
  console.log('=== TEST ROUTE COMPONENT LOADED ===');
  
  return (
    <div style={{ padding: 32, background: 'green', color: 'white' }}>
      <h1>TEST ROUTE WORKS!</h1>
      <p>If you can see this green page, routing is working!</p>
      <p>Current URL: {window.location.href}</p>
    </div>
  );
}

export const Route = createFileRoute('/dashboard/test')({
  component: TestRoute,
}); 