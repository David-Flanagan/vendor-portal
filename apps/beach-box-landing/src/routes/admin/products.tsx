import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_EMAIL = 'flanagandavidfl@gmail.com';

function ProductsAdmin() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [form, setForm] = useState({
    brand: '',
    product: '',
    product_type: '',
    image_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error) setProducts(data || []);
    };
    fetchProducts();
  }, [submitting]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      const { data, error } = await supabase.from('product_types').select('*').order('created_at', { ascending: false });
      if (!error) setProductTypes(data || []);
    };
    fetchProductTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (!form.brand || !form.product || !form.product_type || !form.image_url) {
      setError('Please fill out all fields.');
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from('products').insert([
      {
        brand: form.brand,
        product: form.product,
        product_type: form.product_type,
        image_url: form.image_url,
      },
    ]);
    if (error) setError(error.message);
    setForm({ brand: '', product: '', product_type: '', image_url: '' });
    setSubmitting(false);
  };

  // Group products by category
  const productsByCategory = products.reduce<Record<string, typeof products>>( (acc, product) => {
    const cat = product.product_type || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>You are not authorized to view this page.</div>;
  }

  return (
    <section id="products">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Products</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 40, background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', maxWidth: 500 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Add New Product</h3>
        <div style={{ marginBottom: 12 }}>
          <label>Brand</label>
          <input name="brand" value={form.brand} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Product</label>
          <input name="product" value={form.product} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Product Type</label>
          <select name="product_type" value={form.product_type} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <option value="">Select product type</option>
            {productTypes.map((pt) => (
              <option key={pt.id} value={pt.name}>{pt.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} required placeholder="/products/brand-image.jpg" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          {submitting ? 'Adding...' : 'Add Product'}
        </button>
      </form>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Existing Products</h3>
      {Object.entries(productsByCategory).map(([category, prods]) => (
        <div key={category} style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{category}</div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {(prods as typeof products).map((product) => (
              <div key={product.id} style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 8, minWidth: 140, maxWidth: 160, background: '#fff', marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={product.image_url} alt={product.brand} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, marginBottom: 4, marginTop: 2 }} />
                <div style={{ fontWeight: 600, fontSize: 15, textAlign: 'center', marginBottom: 2 }}>{product.brand}</div>
                <div style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginBottom: 1 }}>{product.product}</div>
                <div style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginBottom: 4 }}>{product.product_type}</div>
                <div style={{ margin: '8px 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!product.is_available}
                      onChange={async (e) => {
                        const newValue = e.target.checked;
                        await supabase.from('products').update({ is_available: newValue }).eq('id', product.id);
                        setProducts(products.map(p => p.id === product.id ? { ...p, is_available: newValue } : p));
                      }}
                    />
                    <span style={{ color: product.is_available ? '#22c55e' : '#64748b', fontWeight: 500, fontSize: 12 }}>
                      {product.is_available ? 'Available to Customers' : 'Not Available'}
                    </span>
                  </label>
                </div>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this product?')) {
                      await supabase.from('products').delete().eq('id', product.id);
                      setProducts(products.filter((p) => p.id !== product.id));
                    }
                  }}
                  style={{ color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '3px 8px', fontWeight: 600, cursor: 'pointer', fontSize: 12, marginTop: 4 }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {products.length === 0 && <div style={{ color: '#64748b' }}>(No products yet)</div>}
    </section>
  );
}

export const Route = createFileRoute('/admin/products')({
  component: ProductsAdmin,
}); 