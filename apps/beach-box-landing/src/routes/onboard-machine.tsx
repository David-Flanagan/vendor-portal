import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabaseClient';

function OnboardMachine() {
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [machines, setMachines] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [slotSelections, setSlotSelections] = useState<any[]>([]); // [{productIds: string[]}] per slot
  const [commission, setCommission] = React.useState(0.1); // single commission for all products
  const [locationData, setLocationData] = React.useState({
    businessName: '',
    address: '',
    suite: '',
    instructions: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [locationError, setLocationError] = React.useState<string | null>(null);

  useEffect(() => {
    if (step === 1) {
      supabase.from('machines').select('*').eq('is_available', true).then(({ data }) => setMachines(data || []));
    }
    if (step === 2) {
      supabase.from('products').select('*').eq('is_available', true).then(({ data }) => setProducts(data || []));
    }
  }, [step]);

  // Initialize commissions when entering step 3
  useEffect(() => {
    if (step === 3) {
      const selectedProducts: any[] = [];
      slotSelections.forEach((slot: any) => {
        (slot.productIds || []).forEach((id: string) => {
          const prod = products.find((p) => p.id === id);
          if (prod) selectedProducts.push(prod);
        });
      });
      const obj: {[id: string]: number} = {};
      selectedProducts.forEach((p) => { obj[p.id] = commission; });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, slotSelections, products]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user) return <div style={{ textAlign: 'center', marginTop: 80, color: '#ef4444' }}>You must be signed in to onboard a machine.</div>;

  // Step 1: Select a machine type
  if (step === 1) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Select a Machine Type</h1>
        {machines.length === 0 && <div style={{ color: '#64748b' }}>(No machines available)</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {machines.filter(m => m.is_available).map((machine) => (
            <div key={machine.id} style={{ border: '1px solid #cbd5e1', borderRadius: 12, padding: 20, minWidth: 220, background: '#f9fafb', cursor: 'pointer', boxShadow: selectedMachine?.id === machine.id ? '0 0 0 2px #2563eb' : undefined }}
              onClick={() => { setSelectedMachine(machine); }}>
              <img src={machine.image_url} alt={machine.name} style={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
              <div style={{ fontWeight: 600 }}>{machine.name}</div>
              <div style={{ color: '#64748b', fontSize: 14 }}>{machine.category}</div>
            </div>
          ))}
        </div>
        <button disabled={!selectedMachine} onClick={() => setStep(2)} style={{ marginTop: 32, width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          Next: Select Products
        </button>
      </div>
    );
  }

  // Step 2: Select qualifying products for each slot
  if (step === 2 && selectedMachine) {
    // Determine allowed product types from machine config
    const allowedTypes = selectedMachine.product_config?.slots?.map((slot: any) => slot.type) || [];
    const allowedCounts = selectedMachine.product_config?.slots?.map((slot: any) => slot.slot_count) || [];
    // For each slot, let user pick up to slot_count products of the allowed type
    return (
      <div style={{ maxWidth: 700, margin: '80px auto', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Select Products for Each Slot</h1>
        {allowedTypes.map((type: string, idx: number) => {
          const selectedProductIds = slotSelections[idx]?.productIds || [];
          const filteredProducts = products.filter((p) => p.product_type === type);
          const maxAllowed = allowedCounts[idx] || 1;
          const slotSel: string[] = selectedProductIds;
          return (
            <div key={idx} style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Slot {idx + 1} ({type}) — Select up to {maxAllowed}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {filteredProducts.map((p: any) => {
                  const isSelected = slotSel.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        let newSelections = [...slotSelections];
                        let slotSelInner = newSelections[idx]?.productIds || [];
                        if (isSelected) {
                          slotSelInner = slotSelInner.filter((id: string) => id !== p.id);
                        } else if (slotSelInner.length < maxAllowed) {
                          slotSelInner = [...slotSelInner, p.id];
                        }
                        newSelections[idx] = { productIds: slotSelInner };
                        setSlotSelections(newSelections);
                      }}
                      style={{
                        border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: 10,
                        minWidth: 90,
                        maxWidth: 110,
                        background: isSelected ? '#eff6ff' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: isSelected ? '0 0 0 2px #2563eb33' : undefined,
                        opacity: slotSel.length >= maxAllowed && !isSelected ? 0.5 : 1,
                      }}
                    >
                      <img src={p.image_url} alt={p.brand} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }} />
                      <div style={{ fontWeight: 600, fontSize: 13, textAlign: 'center' }}>{p.brand}</div>
                      <div style={{ color: '#64748b', fontSize: 12, textAlign: 'center' }}>{p.product}</div>
                      <div style={{ color: '#22c55e', fontSize: 12, textAlign: 'center', marginTop: 2 }}>
                        {p.base_price !== null && p.base_price !== undefined ? `Base: $${parseFloat(p.base_price).toFixed(2)}` : <span style={{ color: '#64748b' }}>No base price</span>}
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>(No products available for this type)</div>
                )}
              </div>
            </div>
          );
        })}
        <button
          onClick={() => setStep(3)}
          disabled={allowedTypes.some((_: string, idx: number) => {
            const maxAllowed = allowedCounts[idx] || 1;
            return !slotSelections[idx]?.productIds || slotSelections[idx].productIds.length !== maxAllowed;
          })}
          style={{ marginTop: 32, width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}
        >
          Next: Pricing Calculator
        </button>
      </div>
    );
  }

  // Step 3: Pricing calculator
  if (step === 3) {
    // Gather all selected products
    const selectedProducts: any[] = [];
    slotSelections.forEach((slot: any) => {
      (slot.productIds || []).forEach((id: string) => {
        const prod = products.find((p) => p.id === id);
        if (prod) selectedProducts.push(prod);
      });
    });
    // Constants
    const CC_FEE = 0.025;
    const TAX = 0.07;
    return (
      <div style={{ maxWidth: 700, margin: '80px auto', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Set Vending Prices</h1>
        <div style={{ width: 340, margin: '0 auto 32px auto', background: '#f1f5f9', borderRadius: 10, padding: 18, border: '1px solid #e5e7eb' }}>
          <label style={{ fontSize: 15, color: '#64748b', fontWeight: 500, display: 'block', marginBottom: 8 }}>Commission: {Math.round(commission * 100)}%</label>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={commission}
            onChange={e => setCommission(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {selectedProducts.map((p) => {
            const base = parseFloat(p.base_price) || 0;
            const commissionAmt = base * commission;
            const processingFee = commissionAmt * 0.025;
            const tax = commissionAmt * 0.07;
            const finalPrice = base + commissionAmt + processingFee + tax;
            // Round up to next $0.25
            const roundedPrice = Math.ceil(finalPrice * 4) / 4;
            const roundingDiff = roundedPrice - finalPrice;
            return (
              <div key={p.id} style={{ border: '1px solid #cbd5e1', borderRadius: 10, padding: 18, minWidth: 180, background: '#f9fafb', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={p.image_url} alt={p.brand} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ fontWeight: 600, fontSize: 15, textAlign: 'center' }}>{p.brand}</div>
                <div style={{ color: '#64748b', fontSize: 13, textAlign: 'center' }}>{p.product}</div>
                <div style={{ color: '#22c55e', fontSize: 13, margin: '6px 0' }}>Base: ${base.toFixed(2)}</div>
                <div style={{ fontSize: 13, color: '#64748b', margin: '2px 0' }}>+ Commission: ${commissionAmt.toFixed(2)}</div>
                <div style={{ fontSize: 13, color: '#64748b', margin: '2px 0' }}>+ Increased Processing Fee: ${processingFee.toFixed(2)}</div>
                <div style={{ fontSize: 13, color: '#64748b', margin: '2px 0' }}>+ Increased Sales Tax: ${tax.toFixed(2)}</div>
                {roundingDiff > 0 && (
                  <div style={{ fontSize: 13, color: '#64748b', margin: '2px 0' }}>+ Rounding Adjustment: ${roundingDiff.toFixed(2)}</div>
                )}
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 6 }}>
                  Vending Price: <span style={{ color: '#2563eb' }}>${roundedPrice.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => setStep(1)} style={{ marginTop: 32, padding: 10, background: '#64748b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          Start Over
        </button>
        <button onClick={() => setStep(4)} style={{ marginTop: 16, marginLeft: 16, padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
          Next: Location & Contact Info
        </button>
      </div>
    );
  }

  // Step 4: Location and Point of Contact
  if (step === 4) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLocationData({ ...locationData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // Simple validation
      if (!locationData.businessName || !locationData.address || !locationData.contactName || !locationData.contactEmail || !locationData.contactPhone) {
        setLocationError('Please fill out all required fields.');
        return;
      }
      setLocationError(null);
      // Prepare data for saving
      const slotSelectionsData = slotSelections.map((slot: any) => slot.productIds);
      const pricingData = slotSelections.map((slot: any) => (slot.productIds || []).map((id: string) => {
        const prod = products.find((p) => p.id === id);
        if (!prod) return null;
        const base = parseFloat(prod.base_price) || 0;
        const commissionAmt = base * commission;
        const processingFee = commissionAmt * 0.025;
        const tax = commissionAmt * 0.07;
        const finalPrice = base + commissionAmt + processingFee + tax;
        const roundedPrice = Math.ceil(finalPrice * 4) / 4;
        return {
          product_id: prod.id,
          base_price: base,
          commission,
          vending_price: roundedPrice,
        };
      }).filter(Boolean));
      // Save to Supabase
      const { error } = await supabase.from('customer_machines').insert([
        {
          user_id: user.id,
          machine_id: selectedMachine.id,
          slot_selections: slotSelectionsData,
          pricing: pricingData,
          business_name: locationData.businessName,
          address: locationData.address,
          suite: locationData.suite,
          delivery_instructions: locationData.instructions,
          contact_name: locationData.contactName,
          contact_email: locationData.contactEmail,
          contact_phone: locationData.contactPhone,
          approved: false,
        },
      ]);
      if (error) {
        setLocationError('Failed to save. Please try again.');
        return;
      }
      // Redirect to dashboard
      window.location.href = '/dashboard';
    };
    return (
      <div style={{ maxWidth: 500, margin: '80px auto', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Location & Point of Contact</h1>
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Location Information</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Business/Location Name *</label>
            <input name="businessName" value={locationData.businessName} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Address *</label>
            <input name="address" value={locationData.address} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Suite/Unit</label>
            <input name="suite" value={locationData.suite} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Special Delivery Instructions</label>
            <textarea name="instructions" value={locationData.instructions} onChange={handleChange} style={{ width: '100%', minHeight: 40, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: '20px 0 12px 0' }}>Point of Contact</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Name *</label>
            <input name="contactName" value={locationData.contactName} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Email *</label>
            <input name="contactEmail" type="email" value={locationData.contactEmail} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Phone *</label>
            <input name="contactPhone" type="tel" value={locationData.contactPhone} onChange={handleChange} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
          </div>
          {locationError && <div style={{ color: '#ef4444', marginBottom: 12 }}>{locationError}</div>}
          <button type="submit" style={{ width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
            Complete Onboarding
          </button>
        </form>
      </div>
    );
  }

  return null;
}

export const Route = createFileRoute('/onboard-machine')({
  component: OnboardMachine,
}); 