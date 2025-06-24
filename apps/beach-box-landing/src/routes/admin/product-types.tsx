import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_EMAIL = 'flanagandavidfl@gmail.com';

function ProductTypesAdmin() {
  const { user, loading } = useAuth();
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [ptForm, setPtForm] = useState({ name: '', description: '' });
  const [ptSubmitting, setPtSubmitting] = useState(false);
  const [ptError, setPtError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductTypes = async () => {
      const { data, error } = await supabase.from('product_types').select('*').order('created_at', { ascending: false });
      if (!error) setProductTypes(data || []);
    };
    fetchProductTypes();
  }, [ptSubmitting]);

  const handlePtChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPtForm({ ...ptForm, [e.target.name]: e.target.value });
  };
  const handlePtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPtSubmitting(true);
    setPtError(null);
    const { error } = await supabase.from('product_types').insert([
      { name: ptForm.name, description: ptForm.description },
    ]);
    if (error) setPtError(error.message);
    setPtForm({ name: '', description: '' });
    setPtSubmitting(false);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>You are not authorized to view this page.</div>;
  }

  return (
    <section id="product-types">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Product Types</h1>
      <form onSubmit={handlePtSubmit} style={{ marginBottom: 40, background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', maxWidth: 500 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Add New Product Type</h3>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input name="name" value={ptForm.name} onChange={handlePtChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea name="description" value={ptForm.description} onChange={handlePtChange} style={{ width: '100%', minHeight: 40, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        {ptError && <div style={{ color: '#ef4444', marginBottom: 12 }}>{ptError}</div>}
        <button type="submit" disabled={ptSubmitting} style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          {ptSubmitting ? 'Adding...' : 'Add Product Type'}
        </button>
      </form>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Existing Product Types</h3>
      {productTypes.map((pt) => (
        <div key={pt.id} style={{ border: '1px solid #cbd5e1', borderRadius: 12, padding: 20, minWidth: 220, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontWeight: 600 }}>{pt.name}</div>
          <div style={{ color: '#64748b', fontSize: 14 }}>{pt.description}</div>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this product type?')) {
                await supabase.from('product_types').delete().eq('id', pt.id);
                setProductTypes(productTypes.filter((p) => p.id !== pt.id));
              }
            }}
            style={{ marginTop: 10, color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      ))}
      {productTypes.length === 0 && <div style={{ color: '#64748b' }}>(No product types yet)</div>}
    </section>
  );
}

export const Route = createFileRoute('/admin/product-types')({
  component: ProductTypesAdmin,
}); 