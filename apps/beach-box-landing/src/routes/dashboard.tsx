import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from "react";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabaseClient';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Button,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  DialogFooter
} from '@beach-box/unify-ui';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

function Dashboard() {
  const { user, loading } = useAuth();
  const [machines, setMachines] = useState<any[]>([]);
  const [machinesLoading, setMachinesLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [openSections, setOpenSections] = useState<{[machineId: string]: 'analytics' | 'details' | 'products' | null}>({});
  const [machineProducts, setMachineProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [changeRequestForm, setChangeRequestForm] = useState({
    currentProductId: '',
    currentSlotPosition: '',
    newProductId: '',
    reason: ''
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = useState(false);
  
  React.useEffect(() => {
    if (user) {
      setMachinesLoading(true);
      supabase
        .from('customer_machines')
        .select(`
          *,
          machines!inner(name, category, image_url, product_config)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            console.error('Dashboard - Error loading machines:', error);
          }
          setMachines(data || []);
          setMachinesLoading(false);
        });
    } else {
      setMachines([]);
      setMachinesLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Refresh to update auth state
  };

  const handleMachineClick = (machine: any) => {
    setSelectedMachine(machine);
    // Toggle details section - if already open, close it; otherwise open it
    const currentSection = openSections[machine.id];
    const newSection = currentSection === 'details' ? null : 'details';
    setOpenSections({ ...openSections, [machine.id]: newSection });
  };

  const handleProductsClick = (machine: any) => {
    setSelectedMachine(machine);
    // Toggle products section - if already open, close it; otherwise open it
    const currentSection = openSections[machine.id];
    const newSection = currentSection === 'products' ? null : 'products';
    setOpenSections({ ...openSections, [machine.id]: newSection });
    
    if (newSection === 'products') {
      // Load products for this machine
      getMachineProducts(machine).then(products => {
        setMachineProducts(products);
      });
    }
  };

  const handleAnalyticsClick = (machine: any) => {
    setSelectedMachine(machine);
    // Toggle analytics section - if already open, close it; otherwise open it
    const currentSection = openSections[machine.id];
    const newSection = currentSection === 'analytics' ? null : 'analytics';
    setOpenSections({ ...openSections, [machine.id]: newSection });
  };

  const handleCloseModal = () => {
    setSelectedMachine(null);
    if (selectedMachine) {
      setOpenSections({ ...openSections, [selectedMachine.id]: null });
    }
  };

  const handleCloseProductsModal = () => {
    setSelectedMachine(null);
    if (selectedMachine) {
      setOpenSections({ ...openSections, [selectedMachine.id]: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock sales data for demonstration
  const generateMockSalesData = (machineId: string) => {
    const days = 30;
    const salesData = [];
    const revenueData = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      const sales = Math.floor(Math.random() * 50) + 10;
      const revenue = sales * (Math.random() * 5 + 2); // $2-7 per sale
      
      salesData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: sales
      });
      
      revenueData.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(revenue)
      });
    }
    
    return { salesData, revenueData };
  };

  // Simplified Product type definition
  type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    productType: string;
    slotPosition: string; // Add slot position tracking
  };

  // Parse products from machine data
  const getMachineProducts = async (machine: any) => {
    try {
      setProductsLoading(true);
      
      // Parse slot selections and pricing from the machine data
      // Handle both parsed objects and JSON strings
      const slotSelections = typeof machine.slot_selections === 'string' 
        ? JSON.parse(machine.slot_selections) 
        : machine.slot_selections || [];
      const pricing = typeof machine.pricing === 'string' 
        ? JSON.parse(machine.pricing) 
        : machine.pricing || [];
      
      console.log('Slot selections:', slotSelections);
      console.log('Pricing:', pricing);
      
      // Get all product IDs from slot selections
      const allProductIds = slotSelections.flat();
      
      if (allProductIds.length === 0) {
        setMachineProducts([]);
        setProductsLoading(false);
        return [];
      }
      
      // Fetch product details from the database
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .in('id', allProductIds);
      
      if (error) {
        console.error('Error fetching products:', error);
        setMachineProducts([]);
        setProductsLoading(false);
        return [];
      }
      
      console.log('Fetched products data:', productsData);
      
      const products: Product[] = [];
      
      // Flatten the slot selections and pricing into a single array
      slotSelections.forEach((slotProductIds: string[], slotIndex: number) => {
        slotProductIds.forEach((productId: string, productIndex: number) => {
          const pricingData = pricing[slotIndex]?.[productIndex];
          const productData = productsData?.find(p => p.id === productId);
          
          if (pricingData && productData) {
            // Create a unique slot position identifier
            const slotPosition = `${slotIndex}-${productIndex}`;
            
            products.push({
              id: productId, // Use the actual database product ID
              name: `${productData.brand} ${productData.product}`,
              price: pricingData.vending_price || 0,
              image: productData.image_url || '/products/default.png',
              category: getProductCategory(`${productData.brand} ${productData.product}`),
              productType: productData.product_type, // Add product_type for filtering
              slotPosition: slotPosition // Add slot position for duplicate handling
            });
          }
        });
      });
      
      console.log('Processed products:', products);
      setProductsLoading(false);
      return products;
    } catch (error) {
      console.error('Error processing machine products:', error);
      setProductsLoading(false);
      return [];
    }
  };

  // Helper function to categorize products
  const getProductCategory = (productName: string) => {
    const name = productName.toLowerCase();
    if (name.includes('sunscreen') || name.includes('spf')) return 'Sun Protection';
    if (name.includes('bug') || name.includes('insect')) return 'Insect Protection';
    if (name.includes('shampoo') || name.includes('hair')) return 'Hair Care';
    if (name.includes('baby') || name.includes('kids')) return 'Kids & Baby';
    if (name.includes('sport') || name.includes('active')) return 'Sports & Active';
    return 'General';
  };

  // Fetch available products for change requests
  const fetchAvailableProducts = async (currentProductId?: string) => {
    try {
      console.log('fetchAvailableProducts called with currentProductId:', currentProductId);
      console.log('selectedMachine:', selectedMachine);
      
      // Get all available products
      const { data: allProducts, error } = await supabase
        .from('products')
        .select('id, brand, product, product_type, base_price, image_url')
        .eq('is_available', true)
        .order('brand');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('All products from database:', allProducts);
      
      // Get the machine's allowed product types from its configuration
      const machineConfig = selectedMachine?.machines?.product_config;
      const allowedProductTypes = machineConfig?.slots?.map((slot: any) => slot.type) || [];
      
      console.log('Machine config:', machineConfig);
      console.log('Machine allowed product types:', allowedProductTypes);
      
      // If a current product is selected, filter by the same product_type as the current product
      if (currentProductId) {
        // Find the current product in machineProducts to get its productType
        const currentProduct = machineProducts.find(p => p.id === currentProductId);
        console.log('Current product found:', currentProduct);
        
        if (currentProduct && currentProduct.productType) {
          // Filter products by the same product_type as the current product
          const filteredProducts = allProducts?.filter(product => 
            product.product_type === currentProduct.productType
          ) || [];
          
          console.log('Current product type:', currentProduct.productType);
          console.log('Filtered products:', filteredProducts);
          
          setAvailableProducts(filteredProducts);
          return;
        }
      }
      
      // If no current product selected, show all products that are compatible with the machine
      const compatibleProducts = allProducts?.filter(product => 
        allowedProductTypes.includes(product.product_type)
      ) || [];
      
      console.log('Compatible products for machine:', compatibleProducts);
      setAvailableProducts(compatibleProducts);
    } catch (error) {
      console.error('Error fetching available products:', error);
      setAvailableProducts([]);
    }
  };

  // Handle product change request
  const handleChangeRequest = async () => {
    if (!changeRequestForm.currentProductId || !changeRequestForm.newProductId || !changeRequestForm.reason) {
      alert('Please fill in all fields');
      return;
    }

    setSubmittingRequest(true);
    try {
      // Get current pending changes or initialize empty array
      let currentPendingChanges = [];
      
      if (selectedMachine.pending_changes) {
        // Check if it's already an array (parsed) or a string (needs parsing)
        if (typeof selectedMachine.pending_changes === 'string') {
          try {
            currentPendingChanges = JSON.parse(selectedMachine.pending_changes);
          } catch (parseError) {
            console.warn('Failed to parse pending_changes, using empty array:', parseError);
            currentPendingChanges = [];
          }
        } else if (Array.isArray(selectedMachine.pending_changes)) {
          currentPendingChanges = selectedMachine.pending_changes;
        } else {
          console.warn('pending_changes is not a string or array, using empty array');
          currentPendingChanges = [];
        }
      }
      
      // Ensure currentPendingChanges is an array
      if (!Array.isArray(currentPendingChanges)) {
        currentPendingChanges = [];
      }
      
      // Add new change request to pending changes
      const newChangeRequest = {
        id: crypto.randomUUID(),
        currentProductId: changeRequestForm.currentProductId,
        currentSlotPosition: changeRequestForm.currentSlotPosition,
        newProductId: changeRequestForm.newProductId,
        reason: changeRequestForm.reason,
        status: 'pending',
        requestedBy: user?.id,
        requestedAt: new Date().toISOString()
      };
      
      const updatedPendingChanges = [...currentPendingChanges, newChangeRequest];
      
      // Update the customer_machines table with the new pending change
      const { error } = await supabase
        .from('customer_machines')
        .update({
          pending_changes: JSON.stringify(updatedPendingChanges)
        })
        .eq('id', selectedMachine.id);

      if (error) throw error;

      alert('Product change request submitted successfully! It will be reviewed by an administrator.');
      setIsChangeRequestModalOpen(false);
      setChangeRequestForm({
        currentProductId: '',
        currentSlotPosition: '',
        newProductId: '',
        reason: ''
      });
      
      // Update the local machines state to reflect the change
      setMachines(prevMachines => 
        prevMachines.map(machine => 
          machine.id === selectedMachine.id 
            ? { ...machine, pending_changes: JSON.stringify(updatedPendingChanges) }
            : machine
        )
      );
      
      // Also update the selectedMachine state
      setSelectedMachine((prev: any) => prev ? { ...prev, pending_changes: JSON.stringify(updatedPendingChanges) } : null);
      
      // Refresh the machines data to ensure everything is up to date
      if (user) {
        supabase
          .from('customer_machines')
          .select(`
            *,
            machines!inner(name, category, image_url, product_config)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => {
            if (!error && data) {
              setMachines(data);
            }
          });
      }
    } catch (error) {
      console.error('Error submitting change request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleRequestChangeClick = async (machine: any) => {
    setSelectedMachine(machine);
    setIsChangeRequestModalOpen(true);
    
    // Load products for this machine first
    const products = await getMachineProducts(machine);
    setMachineProducts(products);
    
    // Then fetch available products for replacement
    fetchAvailableProducts(); // Show all products initially
  };

  // Handle current product selection change
  const handleCurrentProductChange = (productIdAndSlot: string) => {
    // Parse the combined product ID and slot position
    const [productId, slotPosition] = productIdAndSlot.split('|');
    
    setChangeRequestForm(prev => ({ 
      ...prev, 
      currentProductId: productId,
      currentSlotPosition: slotPosition,
      newProductId: '' // Reset new product selection
    }));
    fetchAvailableProducts(productId); // Refetch products filtered by category
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: 64 }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#f8fafc", padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Dashboard</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: 12 }}><a href="/dashboard">My Machines</a></li>
            <li><a href="/onboard-machine">Onboard New Machine</a></li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: 32 }}>
        {/* Dashboard Home Content */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 4 }}>Dashboard Home</h1>
            {user && (
              <div style={{ color: '#64748b', fontSize: 16 }}>Signed in as: {user.email}</div>
            )}
          </div>
          <button onClick={handleSignOut} style={{ padding: '8px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
        
        {/* Placeholder for future sales/commission data */}
        <div style={{ marginBottom: 40, textAlign: 'center', color: '#64748b', fontSize: 20 }}>
          Sales and commission analytics coming soon.
        </div>
        
        {/* My Machines section */}
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>My Machines</h2>
        {machinesLoading ? (
          <div style={{ color: '#64748b' }}>Loading machines...</div>
        ) : machines.length === 0 ? (
          <div style={{ color: '#64748b' }}>(Your machines will appear here.)</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {machines.map((m: any) => {
              const isAnalyticsOpen = openSections[m.id] === 'analytics';
              const isDetailsOpen = openSections[m.id] === 'details';
              const isProductsOpen = openSections[m.id] === 'products';
              const { salesData, revenueData } = generateMockSalesData(m.id);
              
              return (
                <div key={m.id} style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  background: m.approved ? '#fff' : '#f1f5f9',
                  color: m.approved ? '#222' : '#64748b',
                  opacity: m.approved ? 1 : 0.6,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}>
                  {/* Machine Header - Always Visible */}
                  <div style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {/* Machine image */}
                        <div>
                          {m.machines?.image_url ? (
                            <img
                              src={m.machines.image_url}
                              alt={m.business_name || 'Machine'}
                              style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, background: '#f1f5f9', border: '1px solid #e5e7eb' }}
                            />
                          ) : (
                            <div style={{ width: 80, height: 60, borderRadius: 8, background: '#f1f5f9', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: 24 }}>
                              ?
                            </div>
                          )}
                        </div>
                        
                        {/* Basic Info */}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 2 }}>{m.business_name}</div>
                          <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Machine ID: {m.machine_id_admin || 'Not assigned'}</div>
                          <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>{m.address}{m.suite ? `, ${m.suite}` : ''}</div>
                          <div style={{ fontSize: 13 }}>
                            <span style={{ fontWeight: 500 }}>Status: </span>
                            {m.approved ? (
                              <span style={{ color: '#22c55e', fontWeight: 600 }}>Approved</span>
                            ) : (
                              <span style={{ color: '#64748b', fontWeight: 600 }}>Pending Approval</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {!m.approved && (
                        <div style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: '#f1f5f9',
                          color: '#64748b',
                          borderRadius: 6,
                          padding: '2px 10px',
                          fontWeight: 600,
                          fontSize: 13,
                        }}>
                          Pending Approval
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <button
                        onClick={() => handleAnalyticsClick(m)}
                        style={{
                          padding: '6px 12px',
                          background: isAnalyticsOpen ? '#64748b' : '#f1f5f9',
                          color: isAnalyticsOpen ? '#fff' : '#64748b',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {isAnalyticsOpen ? 'Hide Analytics' : 'Show Analytics'}
                        <span style={{ 
                          transform: isAnalyticsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          fontSize: 14
                        }}>
                          ▼
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleMachineClick(m)}
                        style={{
                          padding: '6px 12px',
                          background: isDetailsOpen ? '#64748b' : '#f1f5f9',
                          color: isDetailsOpen ? '#fff' : '#64748b',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {isDetailsOpen ? 'Hide Details' : 'Show Details'}
                        <span style={{ 
                          transform: isDetailsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          fontSize: 14
                        }}>
                          ▼
                        </span>
                      </button>
                      
                      <button
                        onClick={() => handleProductsClick(m)}
                        style={{
                          padding: '6px 12px',
                          background: isProductsOpen ? '#64748b' : '#f1f5f9',
                          color: isProductsOpen ? '#fff' : '#64748b',
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {isProductsOpen ? 'Hide Products' : 'Show Products'}
                        <span style={{ 
                          transform: isProductsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          fontSize: 14
                        }}>
                          ▼
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Analytics Section */}
                  {isAnalyticsOpen && (
                    <div style={{ 
                      borderTop: '1px solid #e5e7eb', 
                      background: '#f8fafc',
                      padding: 24
                    }}>
                      <div style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Sales Analytics (Last 30 Days)</h3>
                        
                        {/* Quick Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                          <Card>
                            <CardContent style={{ padding: 16 }}>
                              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Total Sales</div>
                              <div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>
                                {salesData.reduce((sum, day) => sum + day.sales, 0)}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent style={{ padding: 16 }}>
                              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Total Revenue</div>
                              <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>
                                ${revenueData.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent style={{ padding: 16 }}>
                              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Avg Daily Sales</div>
                              <div style={{ fontSize: 24, fontWeight: 600, color: '#f59e0b' }}>
                                {Math.round(salesData.reduce((sum, day) => sum + day.sales, 0) / salesData.length)}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent style={{ padding: 16 }}>
                              <div style={{ fontSize: 14, color: '#64748b', marginBottom: 4 }}>Best Day</div>
                              <div style={{ fontSize: 24, fontWeight: 600, color: '#ef4444' }}>
                                {salesData.reduce((max, day) => day.sales > max.sales ? day : max).sales}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Charts */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
                          {/* Sales Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle style={{ fontSize: 16 }}>Daily Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div style={{ height: 200 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="sales" fill="#22c55e" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Revenue Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle style={{ fontSize: 16 }}>Daily Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div style={{ height: 200 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Details Section */}
                  {isDetailsOpen && (
                    <div style={{ 
                      borderTop: '1px solid #e5e7eb', 
                      background: '#f8fafc',
                      padding: 24
                    }}>
                      <div className="space-y-6">
                        {/* Location Details */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Location Details</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Business Name</label>
                                <p className="text-lg">{m.business_name || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-lg">{m.address || 'Not provided'}</p>
                              </div>
                              {m.suite && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Suite/Unit</label>
                                  <p className="text-lg">{m.suite}</p>
                                </div>
                              )}
                              {m.delivery_instructions && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Delivery Instructions</label>
                                  <p className="text-lg">{m.delivery_instructions}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Contact Name</label>
                                <p className="text-lg">{m.contact_name || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Phone</label>
                                <p className="text-lg">{m.contact_phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-lg">{m.contact_email || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Machine ID</label>
                                <p className="text-lg">{m.machine_id_admin || 'Not assigned'}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Machine Information */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Machine Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Machine Type</label>
                                <p className="text-lg">{m.machines?.category || 'Not specified'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <p className="text-lg">
                                  {m.approved ? (
                                    <span className="text-green-600 font-semibold">Approved</span>
                                  ) : (
                                    <span className="text-yellow-600 font-semibold">Pending Approval</span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Onboarded</label>
                                <p className="text-lg">{m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Not available'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                <p className="text-lg">{m.updated_at ? new Date(m.updated_at).toLocaleDateString() : 'Not available'}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Pending Changes */}
                        {m.pending_changes && (() => {
                          try {
                            const pendingChanges = JSON.parse(m.pending_changes);
                            if (pendingChanges.length > 0) {
                              return (
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Pending Change Requests</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    {pendingChanges.map((change: any) => (
                                      <div key={change.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-sm font-medium text-gray-700">
                                            Product Change Request
                                          </span>
                                          <span className={`text-xs px-2 py-1 rounded-full ${
                                            change.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            change.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                          }`}>
                                            {change.status}
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                          <p><strong>Reason:</strong> {change.reason}</p>
                                          <p><strong>Requested:</strong> {new Date(change.requestedAt).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </CardContent>
                                </Card>
                              );
                            }
                          } catch (e) {
                            console.error('Error parsing pending changes:', e);
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  )}
                  
                  {/* Products Section */}
                  {isProductsOpen && (
                    <div style={{ 
                      borderTop: '1px solid #e5e7eb', 
                      background: '#f8fafc',
                      padding: 24
                    }}>
                      <div className="space-y-6">
                        {/* Machine Info Header */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {m.machines?.image_url ? (
                                <img
                                  src={m.machines.image_url}
                                  alt={m.business_name || 'Machine'}
                                  className="w-16 h-12 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-16 h-12 bg-gray-100 border rounded-lg flex items-center justify-center text-gray-400 text-lg">
                                  ?
                                </div>
                              )}
                              <div>
                                <h3 className="text-lg font-semibold">{m.business_name}</h3>
                                <p className="text-sm text-gray-500">{m.address}{m.suite ? `, ${m.suite}` : ''}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Products Grid */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Customer's Selected Products</h3>
                          
                          {productsLoading ? (
                            <div className="text-center py-8 text-gray-500">
                              <p>Loading products...</p>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {machineProducts.map((product: Product) => (
                                  <Card key={product.id} className="overflow-hidden">
                                    <div className="aspect-square relative">
                                      <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDEzMCAxMDBDMTMwIDExNi41NjkgMTE2LjU2OSAxMzAgMTAwIDEzMEM4My40MzEgMTMwIDcwIDExNi41NjkgNzAgMTAwQzcwIDgzLjQzMSA4My40MzEgNzAgMTAwIDcwWiIgZmlsbD0iI0MxQzVEMiIvPgo8L3N2Zz4K';
                                        }}
                                      />
                                      <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full font-medium">
                                        ${product.price}
                                      </div>
                                    </div>
                                    <CardContent className="p-2">
                                      <h4 className="font-semibold text-xs mb-1 line-clamp-2">{product.name}</h4>
                                      <p className="text-xs text-gray-500">{product.category}</p>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                              
                              {machineProducts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No products found for this machine.</p>
                                  <p className="text-sm mt-2">Products and prices should be set during machine onboarding.</p>
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <Button 
                                    onClick={() => handleRequestChangeClick(m)}
                                    className="w-full max-w-xs"
                                  >
                                    Request Product Change
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Product Change Request Modal */}
        <Dialog open={isChangeRequestModalOpen} onOpenChange={setIsChangeRequestModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Product Change</DialogTitle>
              <DialogDescription>
                Submit a request to change one of your machine's products. This request will be reviewed by an administrator.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Current Product Selection */}
              <div>
                <Label htmlFor="current-product">Current Product to Replace</Label>
                <Select 
                  value={`${changeRequestForm.currentProductId}|${changeRequestForm.currentSlotPosition}`} 
                  onValueChange={handleCurrentProductChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product to replace" />
                  </SelectTrigger>
                  <SelectContent>
                    {machineProducts.map((product) => {
                      // Check if this product appears multiple times
                      const duplicateCount = machineProducts.filter(p => p.id === product.id).length;
                      const slotInfo = duplicateCount > 1 ? ` (Slot ${product.slotPosition})` : '';
                      
                      return (
                        <SelectItem key={`${product.id}-${product.slotPosition}`} value={`${product.id}|${product.slotPosition}`}>
                          <div className="flex items-center gap-2">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-6 h-6 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlNWU3ZWYiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
                              }}
                            />
                            <span>{product.name}{slotInfo}</span>
                            <span className="text-gray-500">(${product.price})</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* New Product Selection */}
              <div>
                <Label htmlFor="new-product">New Product</Label>
                <Select 
                  value={changeRequestForm.newProductId} 
                  onValueChange={(value) => setChangeRequestForm(prev => ({ ...prev, newProductId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a new product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          <img 
                            src={product.image_url || `/products/${product.name.toLowerCase().replace(/\s+/g, '')}.png`} 
                            alt={product.name} 
                            className="w-6 h-6 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlNWU3ZWYiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
                            }}
                          />
                          <span>{product.name}</span>
                          <span className="text-gray-500">(${product.base_price})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Only products of the same type (e.g., spray bottle, lotion, etc.) are shown. The final price will be calculated based on your machine's pricing model.
                </p>
              </div>

              {/* Reason for Change */}
              <div>
                <Label htmlFor="reason">Reason for Change</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you want to change this product..."
                  value={changeRequestForm.reason}
                  onChange={(e) => setChangeRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Machine Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Machine Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Machine ID:</span>
                    <p className="font-mono">{selectedMachine?.machine_id_admin || selectedMachine?.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Business:</span>
                    <p>{selectedMachine?.business_name || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p>{selectedMachine?.address || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Machine Type:</span>
                    <p>{selectedMachine?.machines?.category || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsChangeRequestModalOpen(false)}
                disabled={submittingRequest}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleChangeRequest}
                disabled={submittingRequest || !changeRequestForm.currentProductId || !changeRequestForm.newProductId || !changeRequestForm.reason}
              >
                {submittingRequest ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});