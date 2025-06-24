import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_EMAIL = 'flanagandavidfl@gmail.com';

function CategoriesAdmin() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
      if (!error) setCategories(data || []);
    };
    fetchCategories();
  }, [catSubmitting]);

  const handleCatChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
  };
  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatSubmitting(true);
    setCatError(null);
    const { error } = await supabase.from('categories').insert([
      { name: catForm.name, description: catForm.description },
    ]);
    if (error) setCatError(error.message);
    setCatForm({ name: '', description: '' });
    setCatSubmitting(false);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>You are not authorized to view this page.</div>;
  }

  return (
    <section id="categories">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Categories</h1>
      <form onSubmit={handleCatSubmit} style={{ marginBottom: 40, background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', maxWidth: 500 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Add New Category</h3>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input name="name" value={catForm.name} onChange={handleCatChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description</label>
          <textarea name="description" value={catForm.description} onChange={handleCatChange} style={{ width: '100%', minHeight: 40, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        {catError && <div style={{ color: '#ef4444', marginBottom: 12 }}>{catError}</div>}
        <button type="submit" disabled={catSubmitting} style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          {catSubmitting ? 'Adding...' : 'Add Category'}
        </button>
      </form>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Existing Categories</h3>
      {categories.map((cat) => (
        <div key={cat.id} style={{ border: '1px solid #cbd5e1', borderRadius: 12, padding: 20, minWidth: 220, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontWeight: 600 }}>{cat.name}</div>
          <div style={{ color: '#64748b', fontSize: 14 }}>{cat.description}</div>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this category?')) {
                await supabase.from('categories').delete().eq('id', cat.id);
                setCategories(categories.filter((c) => c.id !== cat.id));
              }
            }}
            style={{ marginTop: 10, color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      ))}
      {categories.length === 0 && <div style={{ color: '#64748b' }}>(No categories yet)</div>}
    </section>
  );
}

export const Route = createFileRoute('/admin/categories')({
  component: CategoriesAdmin,
}); 