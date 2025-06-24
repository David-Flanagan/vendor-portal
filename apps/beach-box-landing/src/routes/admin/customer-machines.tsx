import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

const ADMIN_EMAIL = 'flanagandavidfl@gmail.com';

function CustomerMachinesAdmin() {
  const { user, loading } = useAuth();
  const [machines, setMachines] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [editFields, setEditFields] = useState<{[id: string]: {machineId: string, vendorSerial: string, nayaxId: string}}>({});

  useEffect(() => {
    supabase.from('customer_machines').select('*').order('created_at', { ascending: false }).then(({ data }) => setMachines(data || []));
  }, [refresh]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user || user.email !== ADMIN_EMAIL) {
    return <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>You are not authorized to view this page.</div>;
  }

  const handleApprove = async (id: string) => {
    const fields = editFields[id] || {};
    if (!fields.machineId || !fields.vendorSerial || !fields.nayaxId) {
      alert('Please enter Machine ID, Vendor Serial Number, and Nayax Device ID before approving.');
      return;
    }
    await supabase.from('customer_machines').update({ approved: true, machine_id_admin: fields.machineId, vendor_serial: fields.vendorSerial, nayax_device_id: fields.nayaxId }).eq('id', id);
    setRefresh(r => r + 1);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer machine?')) {
      await supabase.from('customer_machines').delete().eq('id', id);
      setRefresh(r => r + 1);
    }
  };

  return (
    <section id="customer-machines">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Customer Machines</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Business</th>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Address</th>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Contact</th>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Instructions</th>
            <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #e5e7eb' }}>Approved</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {machines.map((m: any) => (
            <tr key={m.id}>
              <td style={{ padding: 10 }}>{m.business_name}</td>
              <td style={{ padding: 10 }}>{m.address}{m.suite ? `, ${m.suite}` : ''}</td>
              <td style={{ padding: 10 }}>{m.contact_name}<br/>{m.contact_email}<br/>{m.contact_phone}</td>
              <td style={{ padding: 10 }}>{m.delivery_instructions || '-'}</td>
              <td style={{ padding: 10 }}>{m.approved ? '✅' : '❌'}</td>
              <td style={{ padding: 10 }}>
                {!m.approved && (
                  <div style={{ marginBottom: 8 }}>
                    <input
                      placeholder="Machine ID"
                      value={editFields[m.id]?.machineId || ''}
                      onChange={e => setEditFields(f => ({ ...f, [m.id]: { ...f[m.id], machineId: e.target.value } }))}
                      style={{ marginBottom: 4, width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <input
                      placeholder="Vendor Serial Number"
                      value={editFields[m.id]?.vendorSerial || ''}
                      onChange={e => setEditFields(f => ({ ...f, [m.id]: { ...f[m.id], vendorSerial: e.target.value } }))}
                      style={{ marginBottom: 4, width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                    <input
                      placeholder="Nayax Device ID"
                      value={editFields[m.id]?.nayaxId || ''}
                      onChange={e => setEditFields(f => ({ ...f, [m.id]: { ...f[m.id], nayaxId: e.target.value } }))}
                      style={{ marginBottom: 4, width: '100%', padding: 6, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                )}
                {!m.approved && (
                  <button onClick={() => handleApprove(m.id)} style={{ color: '#fff', background: '#22c55e', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Approve</button>
                )}
                <button onClick={() => handleDelete(m.id)} style={{ color: '#fff', background: '#ef4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export const Route = createFileRoute('/admin/customer-machines')({
  component: CustomerMachinesAdmin,
}); 