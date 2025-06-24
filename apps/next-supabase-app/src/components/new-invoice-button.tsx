'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@beach-box/unify-ui';
import { useState } from 'react';

export default function NewInvoiceButton() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);
    console.log('New Invoice button clicked, navigating...');
    router.push('/invoices/new');
  };

  return (
    <Link href="/invoices/new" passHref prefetch={true}>
      <Button
        onClick={() => console.log('Button clicked via Link component')}
        isLoading={isNavigating}
      >
        New Invoice
      </Button>
    </Link>
  );
}