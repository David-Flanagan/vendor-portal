import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_EMAIL = 'flanagandavidfl@gmail.com';

function MachinesAdmin() {
  const { user, loading } = useAuth();
  const [machines, setMachines] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    category: '',
    image_url: '',
    max_unique_types: 1,
    slots: [{ type: '', slot_count: 1 }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMachines = async () => {
      const { data, error } = await supabase.from('machines').select('*').order('created_at', { ascending: false });
      if (!error) setMachines(data || []);
    };
    fetchMachines();
  }, [submitting]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      const { data, error } = await supabase.from('product_types').select('*').order('created_at', { ascending: false });
      if (!error) setProductTypes(data || []);
    };
    fetchProductTypes();
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
      if (!error) setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleUniqueTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setForm((prev) => {
      let slots = prev.slots.slice(0, value);
      while (slots.length < value) {
        slots.push({ type: '', slot_count: 1 });
      }
      return { ...prev, max_unique_types: value, slots };
    });
  };
  const handleSlotChange = (idx: number, field: 'type' | 'slot_count', value: string) => {
    setForm((prev) => {
      const slots = prev.slots.map((slot, i) =>
        i === idx ? { ...slot, [field]: field === 'slot_count' ? Math.max(1, parseInt(value) || 1) : value } : slot
      );
      return { ...prev, slots };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    for (const slot of form.slots) {
      if (!slot.type || !slot.slot_count) {
        setError('Please fill out all slot fields.');
        setSubmitting(false);
        return;
      }
    }
    const product_config = {
      max_unique_types: form.max_unique_types,
      slots: form.slots,
    };
    const { error } = await supabase.from('machines').insert([
      {
        name: form.name,
        category: form.category,
        image_url: form.image_url,
        product_config,
      },
    ]);
    if (error) setError(error.message);
    setForm({ name: '', category: '', image_url: '', max_unique_types: 1, slots: [{ type: '', slot_count: 1 }] });
    setSubmitting(false);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>You are not authorized to view this page.</div>;
  }

  return (
    <section id="machines">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Machines</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 40, background: '#f9fafb', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', maxWidth: 500 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Add New Machine Type</h3>
        <div style={{ marginBottom: 12 }}>
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Image URL</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} required placeholder="/machines/BeachBoxMachine.jpg" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>How many unique product types?</label>
          <input
            type="number"
            min={1}
            name="max_unique_types"
            value={form.max_unique_types}
            onChange={handleUniqueTypesChange}
            style={{ width: 80, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', marginLeft: 8 }}
          />
        </div>
        {form.slots.map((slot, idx) => (
          <div key={idx} style={{ marginBottom: 12, padding: 12, background: '#f1f5f9', borderRadius: 8 }}>
            <label>Product Type</label>
            <select
              value={slot.type}
              onChange={e => handleSlotChange(idx, 'type', e.target.value)}
              style={{ width: 140, marginLeft: 8, marginRight: 16, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
              required
            >
              <option value="">Select type</option>
              {productTypes.map(pt => (
                <option key={pt.id} value={pt.name}>{pt.name}</option>
              ))}
            </select>
            <label>Slots</label>
            <input
              type="number"
              min={1}
              value={slot.slot_count}
              onChange={e => handleSlotChange(idx, 'slot_count', e.target.value)}
              style={{ width: 60, marginLeft: 8, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
              required
            />
          </div>
        ))}
        {error && <div style={{ color: '#ef4444', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          {submitting ? 'Adding...' : 'Add Machine'}
        </button>
      </form>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Existing Machine Types</h3>
      {machines.map((machine) => (
        <div key={machine.id} style={{ border: '1px solid #cbd5e1', borderRadius: 12, padding: 20, minWidth: 220, background: '#fff' }}>
          <img src={machine.image_url} alt={machine.name} style={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
          <div style={{ fontWeight: 600 }}>{machine.name}</div>
          <div style={{ color: '#64748b', fontSize: 14 }}>{machine.category}</div>
          <div style={{ margin: '12px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!machine.is_available}
                onChange={async (e) => {
                  const newValue = e.target.checked;
                  await supabase.from('machines').update({ is_available: newValue }).eq('id', machine.id);
                  setMachines(machines.map(m => m.id === machine.id ? { ...m, is_available: newValue } : m));
                }}
              />
              <span style={{ color: machine.is_available ? '#22c55e' : '#64748b', fontWeight: 500 }}>
                {machine.is_available ? 'Available to Customers' : 'Not Available to Customers'}
              </span>
            </label>
          </div>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this machine?')) {
                await supabase.from('machines').delete().eq('id', machine.id);
                setMachines(machines.filter((m) => m.id !== machine.id));
              }
            }}
            style={{ marginTop: 10, color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      ))}
      {machines.length === 0 && <div style={{ color: '#64748b' }}>(No machines yet)</div>}
    </section>
  );
}

export const Route = createFileRoute('/admin/machines')({
  component: MachinesAdmin,
}); 