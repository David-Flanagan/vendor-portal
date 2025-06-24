import React from 'react';
import { Link } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = router?.state?.location?.pathname || '';
  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 64 }}>
      <aside style={{ width: 220, background: '#f8fafc', padding: 24, borderRight: '1px solid #e5e7eb' }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Admin Panel</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                activeOptions={{ exact: true }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Dashboard
              </Link>
            </li>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin/machines"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Machines
              </Link>
            </li>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin/product-types"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Product Types
              </Link>
            </li>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin/categories"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Categories
              </Link>
            </li>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin/products"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Products
              </Link>
            </li>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin/base-prices"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Base Prices
              </Link>
            </li>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin/customer-machines"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Customer Machines
              </Link>
            </li>
            <li style={{ marginBottom: 16 }}>
              <Link
                to="/admin/pending-requests"
                activeProps={{
                  style: {
                    color: '#2563eb',
                    fontWeight: 700,
                  },
                }}
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Pending Requests
              </Link>
            </li>
            <li>
              <span style={{ color: '#64748b' }}>Users</span>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 32 }}>{children}</main>
    </div>
  );
} 