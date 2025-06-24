import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_EMAIL = 'flanagandavidfl@gmail.com';

function BasePricesAdmin() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<{[id: string]: boolean}>({});
  const [basePrices, setBasePrices] = useState<{[id: string]: string}>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts(data || []);
      const prices: {[id: string]: string} = {};
      (data || []).forEach((p: any) => { prices[p.id] = p.base_price ?? ''; });
      setBasePrices(prices);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>You are not authorized to view this page.</div>;
  }

  const handleEdit = (id: string) => setEditing({ ...editing, [id]: true });
  const handleCancel = (id: string) => setEditing({ ...editing, [id]: false });
  const handleChange = (id: string, value: string) => setBasePrices({ ...basePrices, [id]: value });
  const handleSave = async (id: string) => {
    const price = parseFloat(basePrices[id]);
    if (isNaN(price) || price < 0) {
      setError('Base price must be a positive number.');
      return;
    }
    setError(null);
    await supabase.from('products').update({ base_price: price }).eq('id', id);
    setEditing({ ...editing, [id]: false });
    setProducts(products.map(p => p.id === id ? { ...p, base_price: price } : p));
  };

  return (
    <section id="base-prices">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Set Base Prices</h1>
      {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Brand</th>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Product</th>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Base Price ($)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 10 }}>{p.brand}</td>
              <td style={{ padding: 10 }}>{p.product}</td>
              <td style={{ padding: 10 }}>
                {editing[p.id] ? (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={basePrices[p.id] ?? ''}
                    onChange={e => handleChange(p.id, e.target.value)}
                    style={{ width: 80, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
                  />
                ) : (
                  p.base_price !== null && p.base_price !== undefined ? `$${parseFloat(p.base_price).toFixed(2)}` : <span style={{ color: '#64748b' }}>Not set</span>
                )}
              </td>
              <td style={{ padding: 10 }}>
                {editing[p.id] ? (
                  <>
                    <button onClick={() => handleSave(p.id)} style={{ marginRight: 8, color: '#fff', background: '#22c55e', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={() => handleCancel(p.id)} style={{ color: '#fff', background: '#64748b', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(p.id)} style={{ color: '#fff', background: '#2563eb', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export const Route = createFileRoute('/admin/base-prices')({
  component: BasePricesAdmin,
}); 