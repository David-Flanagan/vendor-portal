import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../components/AuthProvider';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Alert,
  AlertDescription
} from '@beach-box/unify-ui';

interface PendingChange {
  id: string;
  currentProductId: string;
  currentSlotPosition: string;
  newProductId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

interface MachineWithRequests {
  id: string;
  business_name: string;
  address: string;
  suite?: string;
  location: string; // Computed field
  user_id: string;
  pending_changes: string;
  user_email?: string;
}

function PendingRequestsAdmin() {
  const { user } = useAuth();
  const [machinesWithRequests, setMachinesWithRequests] = useState<MachineWithRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<{ machine: MachineWithRequests; change: PendingChange } | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: 'approved' as 'approved' | 'rejected',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  // Fetch all machines with pending changes
  const fetchMachinesWithRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_machines')
        .select(`
          id,
          business_name,
          address,
          suite,
          user_id,
          pending_changes
        `)
        .not('pending_changes', 'is', null)
        .not('pending_changes', 'eq', '[]')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For now, we'll use a placeholder for user emails since auth.users is not accessible
      const machinesWithUserData = data?.map(machine => ({
        ...machine,
        location: `${machine.address}${machine.suite ? `, ${machine.suite}` : ''}`,
        user_email: `User ${machine.user_id.slice(0, 8)}...` // Show first 8 chars of user ID
      })) || [];

      setMachinesWithRequests(machinesWithUserData);
    } catch (error) {
      console.error('Error fetching machines with requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products for reference
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, brand, product, product_type')
        .order('brand');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchMachinesWithRequests();
    fetchProducts();
  }, []);

  // Get product name by ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? `${product.brand} ${product.product}` : 'Unknown Product';
  };

  // Parse pending changes from JSON string
  const parsePendingChanges = (pendingChangesJson: string): PendingChange[] => {
    try {
      return JSON.parse(pendingChangesJson);
    } catch (error) {
      console.error('Error parsing pending changes:', error);
      return [];
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (!selectedRequest) return;

    setSubmitting(true);
    try {
      const { machine, change } = selectedRequest;
      console.log('Starting review process for:', { machine, change });
      console.log('Change request details:', {
        id: change.id,
        currentProductId: change.currentProductId,
        currentSlotPosition: change.currentSlotPosition,
        newProductId: change.newProductId,
        status: change.status
      });
      
      const pendingChanges = parsePendingChanges(machine.pending_changes);
      console.log('Current pending changes:', pendingChanges);
      
      // Update the specific change request
      const updatedChanges = pendingChanges.map(c => 
        c.id === change.id 
          ? {
              ...c,
              status: reviewForm.status,
              reviewedBy: user?.id,
              reviewedAt: new Date().toISOString(),
              reviewNotes: reviewForm.notes
            }
          : c
      );

      console.log('Updated changes:', updatedChanges);

      // If approved, update the actual machine products
      if (reviewForm.status === 'approved') {
        console.log('Approving request - updating machine products...');
        
        // Get current machine data
        const { data: machineData, error: machineError } = await supabase
          .from('customer_machines')
          .select('slot_selections, pricing')
          .eq('id', machine.id)
          .single();

        if (machineError) {
          console.error('Error fetching machine data:', machineError);
          throw machineError;
        }

        console.log('Current machine data:', machineData);
        console.log('Raw slot_selections:', machineData.slot_selections);
        console.log('Raw pricing:', machineData.pricing);
        console.log('Change request:', change);
        console.log('Change request currentProductId:', change.currentProductId, 'type:', typeof change.currentProductId);
        console.log('Change request newProductId:', change.newProductId, 'type:', typeof change.newProductId);

        // Parse current slot selections and pricing
        let slotSelections: Record<string, any> = {};
        let pricing: Record<string, any> = {};

        // Handle slot_selections - check if it's already an object or needs parsing
        if (machineData.slot_selections) {
          if (typeof machineData.slot_selections === 'string') {
            try {
              slotSelections = JSON.parse(machineData.slot_selections);
            } catch (parseError) {
              console.error('Error parsing slot_selections:', parseError);
              slotSelections = {};
            }
          } else if (typeof machineData.slot_selections === 'object') {
            slotSelections = machineData.slot_selections;
          }
        }

        // Handle pricing - check if it's already an object or needs parsing
        if (machineData.pricing) {
          if (typeof machineData.pricing === 'string') {
            try {
              pricing = JSON.parse(machineData.pricing);
            } catch (parseError) {
              console.error('Error parsing pricing:', parseError);
              pricing = {};
            }
          } else if (typeof machineData.pricing === 'object') {
            pricing = machineData.pricing;
          }
        }

        console.log('Parsed slot selections:', slotSelections);
        console.log('Parsed pricing:', pricing);
        console.log('Looking for product:', change.currentProductId, 'in slots:', slotSelections);
        console.log('Product ID type:', typeof change.currentProductId);
        console.log('Current product ID value:', change.currentProductId);
        console.log('New product ID value:', change.newProductId);
        console.log('Slot values types:', Object.entries(slotSelections).map(([k, v]) => `${k}: ${typeof v} = ${v}`));

        // Helper function to compare product IDs (handle string vs number)
        const compareProductIds = (id1: any, id2: any) => {
          return String(id1) === String(id2);
        };

        // Find the specific slot that contains the current product and replace it
        let productReplaced = false;
        
        // Check if currentSlotPosition exists, if not, fall back to the old method
        if (!change.currentSlotPosition) {
          console.log('No slot position found, using fallback method for old change requests');
          
          // Handle different possible data structures
          if (Array.isArray(slotSelections)) {
            // Check if it's an array of arrays (nested structure)
            if (slotSelections.length > 0 && Array.isArray(slotSelections[0])) {
              console.log('Found nested array structure:', slotSelections);
              // Handle array of arrays: [[7,2,6]]
              for (let fallbackSlotIndex = 0; fallbackSlotIndex < slotSelections.length; fallbackSlotIndex++) {
                const innerArray = slotSelections[fallbackSlotIndex];
                if (Array.isArray(innerArray)) {
                  for (let fallbackProductIndex = 0; fallbackProductIndex < innerArray.length; fallbackProductIndex++) {
                    console.log(`Checking nested slot [${fallbackSlotIndex}][${fallbackProductIndex}]: ${innerArray[fallbackProductIndex]} vs ${change.currentProductId}`);
                    if (compareProductIds(innerArray[fallbackProductIndex], change.currentProductId)) {
                      console.log(`Replacing product in nested slot [${fallbackSlotIndex}][${fallbackProductIndex}]: ${innerArray[fallbackProductIndex]} -> ${change.newProductId}`);
                      innerArray[fallbackProductIndex] = change.newProductId;
                      productReplaced = true;
                      break;
                    }
                  }
                  if (productReplaced) break;
                }
              }
            } else {
              // Handle simple array: [7,2,6]
              for (let fallbackIndex = 0; fallbackIndex < slotSelections.length; fallbackIndex++) {
                console.log(`Checking simple array slot ${fallbackIndex}: ${slotSelections[fallbackIndex]} vs ${change.currentProductId}`);
                if (compareProductIds(slotSelections[fallbackIndex], change.currentProductId)) {
                  console.log(`Replacing product in simple array slot ${fallbackIndex}: ${slotSelections[fallbackIndex]} -> ${change.newProductId}`);
                  slotSelections[fallbackIndex] = change.newProductId;
                  productReplaced = true;
                  break;
                }
              }
            }
          } else if (typeof slotSelections === 'object' && slotSelections !== null) {
            // If slot_selections is an object, search through its properties
            for (const [slotKey, productId] of Object.entries(slotSelections)) {
              console.log(`Checking object slot ${slotKey}: ${productId} vs ${change.currentProductId}`);
              if (compareProductIds(productId, change.currentProductId)) {
                console.log(`Replacing product in object slot ${slotKey}: ${productId} -> ${change.newProductId}`);
                slotSelections[slotKey] = change.newProductId;
                productReplaced = true;
                break;
              }
            }
          }
        } else {
          // Parse the slot position to get slot and product indices
          const [slotIndex, productIndex] = change.currentSlotPosition.split('-').map(Number);
          console.log('Target slot position:', change.currentSlotPosition);
          console.log('Parsed slot index:', slotIndex, 'product index:', productIndex);
          
          // Handle different possible data structures
          if (Array.isArray(slotSelections)) {
            // Check if it's an array of arrays (nested structure)
            if (slotSelections.length > 0 && Array.isArray(slotSelections[0])) {
              console.log('Found nested array structure:', slotSelections);
              // Handle array of arrays: [[7,2,6]]
              if (slotSelections[slotIndex] && Array.isArray(slotSelections[slotIndex])) {
                if (compareProductIds(slotSelections[slotIndex][productIndex], change.currentProductId)) {
                  console.log(`Replacing product in specific nested slot [${slotIndex}][${productIndex}]: ${slotSelections[slotIndex][productIndex]} -> ${change.newProductId}`);
                  slotSelections[slotIndex][productIndex] = change.newProductId;
                  productReplaced = true;
                } else {
                  console.warn(`Product ID mismatch at slot [${slotIndex}][${productIndex}]: expected ${change.currentProductId}, found ${slotSelections[slotIndex][productIndex]}`);
                }
              }
            } else {
              // Handle simple array: [7,2,6]
              if (compareProductIds(slotSelections[productIndex], change.currentProductId)) {
                console.log(`Replacing product in specific simple array slot ${productIndex}: ${slotSelections[productIndex]} -> ${change.newProductId}`);
                slotSelections[productIndex] = change.newProductId;
                productReplaced = true;
              } else {
                console.warn(`Product ID mismatch at slot ${productIndex}: expected ${change.currentProductId}, found ${slotSelections[productIndex]}`);
              }
            }
          } else if (typeof slotSelections === 'object' && slotSelections !== null) {
            // If slot_selections is an object, use the slot position as key
            const slotKey = change.currentSlotPosition;
            if (compareProductIds(slotSelections[slotKey], change.currentProductId)) {
              console.log(`Replacing product in specific object slot ${slotKey}: ${slotSelections[slotKey]} -> ${change.newProductId}`);
              slotSelections[slotKey] = change.newProductId;
              productReplaced = true;
            } else {
              console.warn(`Product ID mismatch at slot ${slotKey}: expected ${change.currentProductId}, found ${slotSelections[slotKey]}`);
            }
          }
        }

        if (!productReplaced) {
          console.warn('Product not found in any slot:', change.currentProductId);
          console.warn('Available slots:', slotSelections);
          console.warn('Slot selections type:', typeof slotSelections);
          console.warn('Slot selections keys:', Object.keys(slotSelections));
        }

        // Also update pricing if the product was found
        if (productReplaced && pricing) {
          console.log('Updating pricing for product replacement...');
          
          // Get the new product's price
          const { data: newProductData, error: productError } = await supabase
            .from('products')
            .select('base_price')
            .eq('id', change.newProductId)
            .single();

          if (productError) {
            console.error('Error fetching new product data:', productError);
            throw productError;
          }

          console.log('New product data:', newProductData);

          if (newProductData) {
            // Handle nested pricing structure similar to slot_selections
            if (Array.isArray(pricing)) {
              if (pricing.length > 0 && Array.isArray(pricing[0])) {
                // Handle array of arrays for pricing: [[{product_id, base_price, commission, vending_price}]]
                if (change.currentSlotPosition) {
                  // Use specific slot position
                  const [slotIndex, productIndex] = change.currentSlotPosition.split('-').map(Number);
                  if (pricing[slotIndex] && Array.isArray(pricing[slotIndex])) {
                    const priceObj = pricing[slotIndex][productIndex];
                    if (compareProductIds(priceObj.product_id, change.currentProductId)) {
                      console.log(`Updating pricing for product ${change.currentProductId} -> ${change.newProductId} at position [${slotIndex}][${productIndex}]`);
                      const newBasePrice = newProductData.base_price;
                      
                      // Use the same formula as onboard-machine.tsx
                      const base = parseFloat(newBasePrice) || 0;
                      const commission = priceObj.commission; // Use existing commission, no default needed
                      const commissionAmt = base * commission;
                      const processingFee = commissionAmt * 0.025; // 2.5% processing fee
                      const tax = commissionAmt * 0.07; // 7% tax
                      const finalPrice = base + commissionAmt + processingFee + tax;
                      const roundedPrice = Math.ceil(finalPrice * 4) / 4; // Round up to next $0.25
                      
                      pricing[slotIndex][productIndex] = {
                        ...priceObj,
                        product_id: change.newProductId,
                        base_price: newBasePrice,
                        vending_price: roundedPrice
                      };
                      console.log('Updated pricing object:', pricing[slotIndex][productIndex]);
                    } else {
                      console.warn(`Pricing object mismatch at [${slotIndex}][${productIndex}]: expected product_id ${change.currentProductId}, found ${priceObj?.product_id}`);
                    }
                  }
                } else {
                  // Fallback: search for the product in pricing
                  for (let i = 0; i < pricing.length; i++) {
                    const innerPricing = pricing[i];
                    if (Array.isArray(innerPricing)) {
                      for (let j = 0; j < innerPricing.length; j++) {
                        const priceObj = innerPricing[j];
                        if (compareProductIds(priceObj.product_id, change.currentProductId)) {
                          console.log(`Updating pricing for product ${change.currentProductId} -> ${change.newProductId} at fallback position [${i}][${j}]`);
                          const newBasePrice = newProductData.base_price;
                          
                          // Use the same formula as onboard-machine.tsx
                          const base = parseFloat(newBasePrice) || 0;
                          const commission = priceObj.commission; // Use existing commission, no default needed
                          const commissionAmt = base * commission;
                          const processingFee = commissionAmt * 0.025; // 2.5% processing fee
                          const tax = commissionAmt * 0.07; // 7% tax
                          const finalPrice = base + commissionAmt + processingFee + tax;
                          const roundedPrice = Math.ceil(finalPrice * 4) / 4; // Round up to next $0.25
                          
                          innerPricing[j] = {
                            ...priceObj,
                            product_id: change.newProductId,
                            base_price: newBasePrice,
                            vending_price: roundedPrice
                          };
                          console.log('Updated pricing object:', innerPricing[j]);
                          break;
                        }
                      }
                    }
                  }
                }
              } else {
                // Handle simple array for pricing
                if (change.currentSlotPosition) {
                  // Use specific slot position
                  const [_, productIndex] = change.currentSlotPosition.split('-').map(Number);
                  const priceObj = pricing[productIndex];
                  if (compareProductIds(priceObj.product_id, change.currentProductId)) {
                    console.log(`Updating pricing for product ${change.currentProductId} -> ${change.newProductId} at position ${productIndex}`);
                    const newBasePrice = newProductData.base_price;
                    
                    // Use the same formula as onboard-machine.tsx
                    const base = parseFloat(newBasePrice) || 0;
                    const commission = priceObj.commission; // Use existing commission, no default needed
                    const commissionAmt = base * commission;
                    const processingFee = commissionAmt * 0.025; // 2.5% processing fee
                    const tax = commissionAmt * 0.07; // 7% tax
                    const finalPrice = base + commissionAmt + processingFee + tax;
                    const roundedPrice = Math.ceil(finalPrice * 4) / 4; // Round up to next $0.25
                    
                    pricing[productIndex] = {
                      ...priceObj,
                      product_id: change.newProductId,
                      base_price: newBasePrice,
                      vending_price: roundedPrice
                    };
                    console.log('Updated pricing object:', pricing[productIndex]);
                  } else {
                    console.warn(`Pricing object mismatch at ${productIndex}: expected product_id ${change.currentProductId}, found ${priceObj?.product_id}`);
                  }
                } else {
                  // Fallback: search for the product in pricing
                  for (let i = 0; i < pricing.length; i++) {
                    const priceObj = pricing[i];
                    if (compareProductIds(priceObj.product_id, change.currentProductId)) {
                      console.log(`Updating pricing for product ${change.currentProductId} -> ${change.newProductId} at fallback position ${i}`);
                      const newBasePrice = newProductData.base_price;
                      
                      // Use the same formula as onboard-machine.tsx
                      const base = parseFloat(newBasePrice) || 0;
                      const commission = priceObj.commission; // Use existing commission, no default needed
                      const commissionAmt = base * commission;
                      const processingFee = commissionAmt * 0.025; // 2.5% processing fee
                      const tax = commissionAmt * 0.07; // 7% tax
                      const finalPrice = base + commissionAmt + processingFee + tax;
                      const roundedPrice = Math.ceil(finalPrice * 4) / 4; // Round up to next $0.25
                      
                      pricing[i] = {
                        ...priceObj,
                        product_id: change.newProductId,
                        base_price: newBasePrice,
                        vending_price: roundedPrice
                      };
                      console.log('Updated pricing object:', pricing[i]);
                      break;
                    }
                  }
                }
              }
            } else if (typeof pricing === 'object' && pricing !== null) {
              // Handle object structure for pricing
              if (change.currentSlotPosition) {
                const slotKey = change.currentSlotPosition;
                if (compareProductIds(pricing[slotKey].product_id, change.currentProductId)) {
                  const newBasePrice = newProductData.base_price;
                  const priceObj = pricing[slotKey];
                  
                  // Use the same formula as onboard-machine.tsx
                  const base = parseFloat(newBasePrice) || 0;
                  const commission = priceObj.commission; // Use existing commission, no default needed
                  const commissionAmt = base * commission;
                  const processingFee = commissionAmt * 0.025; // 2.5% processing fee
                  const tax = commissionAmt * 0.07; // 7% tax
                  const finalPrice = base + commissionAmt + processingFee + tax;
                  const roundedPrice = Math.ceil(finalPrice * 4) / 4; // Round up to next $0.25
                  
                  pricing[slotKey] = {
                    ...priceObj,
                    product_id: change.newProductId,
                    base_price: newBasePrice,
                    vending_price: roundedPrice
                  };
                  console.log('Updated pricing object:', pricing[slotKey]);
                } else {
                  console.warn(`Pricing object mismatch at ${slotKey}: expected product_id ${change.currentProductId}, found ${pricing[slotKey]?.product_id}`);
                }
              } else {
                // Fallback: search for the product in pricing object
                for (const [key, priceObj] of Object.entries(pricing)) {
                  if (compareProductIds(priceObj.product_id, change.currentProductId)) {
                    console.log(`Updating pricing for product ${change.currentProductId} -> ${change.newProductId} at fallback key ${key}`);
                    const newBasePrice = newProductData.base_price;
                    
                    // Use the same formula as onboard-machine.tsx
                    const base = parseFloat(newBasePrice) || 0;
                    const commission = priceObj.commission; // Use existing commission, no default needed
                    const commissionAmt = base * commission;
                    const processingFee = commissionAmt * 0.025; // 2.5% processing fee
                    const tax = commissionAmt * 0.07; // 7% tax
                    const finalPrice = base + commissionAmt + processingFee + tax;
                    const roundedPrice = Math.ceil(finalPrice * 4) / 4; // Round up to next $0.25
                    
                    pricing[key] = {
                      ...priceObj,
                      product_id: change.newProductId,
                      base_price: newBasePrice,
                      vending_price: roundedPrice
                    };
                    console.log('Updated pricing object:', pricing[key]);
                    break;
                  }
                }
              }
            }
            
            console.log('Updated pricing structure:', pricing);
          }
        }

        // Update the machine with new slot selections, pricing, and pending changes
        console.log('Updating machine with new data...');
        console.log('Final slot selections to save:', slotSelections);
        console.log('Final pricing to save:', pricing);
        console.log('Final pending changes to save:', updatedChanges);
        
        const { data: updateResult, error: updateError } = await supabase
          .from('customer_machines')
          .update({
            slot_selections: JSON.stringify(slotSelections),
            pricing: JSON.stringify(pricing),
            pending_changes: JSON.stringify(updatedChanges)
          })
          .eq('id', machine.id)
          .select();

        if (updateError) {
          console.error('Error updating machine:', updateError);
          throw updateError;
        }

        console.log('Machine updated successfully:', updateResult);
        
        // Verify the update by fetching the machine data again
        const { data: verifyData, error: verifyError } = await supabase
          .from('customer_machines')
          .select('slot_selections, pricing, pending_changes')
          .eq('id', machine.id)
          .single();

        if (verifyError) {
          console.error('Error verifying update:', verifyError);
        } else {
          console.log('Verification - Updated machine data:', verifyData);
        }
      } else {
        console.log('Rejecting request - only updating pending changes...');
        
        // Just update the pending changes for rejected requests
        const { error: updateError } = await supabase
          .from('customer_machines')
          .update({
            pending_changes: JSON.stringify(updatedChanges)
          })
          .eq('id', machine.id);

        if (updateError) {
          console.error('Error updating pending changes:', updateError);
          throw updateError;
        }
      }

      // Close modal and refresh data
      setReviewModalOpen(false);
      setSelectedRequest(null);
      setReviewForm({ status: 'approved', notes: '' });
      
      // Force refresh of all data to ensure UI updates
      await fetchMachinesWithRequests();
      await fetchProducts();
      
      // Add a small delay to ensure the database update is reflected
      setTimeout(() => {
        fetchMachinesWithRequests();
      }, 1000);

      alert(`Request ${reviewForm.status} successfully!`);
    } catch (error: any) {
      console.error('Error reviewing request:', error);
      alert(`Error reviewing request: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Get all pending changes across all machines
  const getAllPendingChanges = () => {
    const allChanges: { machine: MachineWithRequests; change: PendingChange }[] = [];
    
    machinesWithRequests.forEach(machine => {
      const changes = parsePendingChanges(machine.pending_changes);
      changes.forEach(change => {
        allChanges.push({ machine, change });
      });
    });

    return allChanges;
  };

  const pendingChanges = getAllPendingChanges();
  const pendingRequests = pendingChanges.filter(({ change }) => change.status === 'pending');
  const approvedRequests = pendingChanges.filter(({ change }) => change.status === 'approved');
  const rejectedRequests = pendingChanges.filter(({ change }) => change.status === 'rejected');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading pending requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Product Change Requests</h1>
        <p className="text-gray-600">Review and manage customer requests to change machine products</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Alert>
              <AlertDescription>No pending requests found.</AlertDescription>
            </Alert>
          ) : (
            pendingRequests.map(({ machine, change }) => (
              <Card key={change.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{machine.business_name}</CardTitle>
                      <CardDescription>{machine.location}</CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Current Product</Label>
                      <p className="text-sm">{getProductName(change.currentProductId)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Requested Product</Label>
                      <p className="text-sm">{getProductName(change.newProductId)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Slot Position</Label>
                      <p className="text-sm">{change.currentSlotPosition ? `Slot ${change.currentSlotPosition}` : 'Not specified (legacy request)'}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-500">Reason</Label>
                    <p className="text-sm">{change.reason}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Requested by: {machine.user_email}</span>
                    <span>{new Date(change.requestedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedRequest({ machine, change });
                        setReviewForm({ status: 'approved', notes: '' });
                        setReviewModalOpen(true);
                      }}
                      size="sm"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest({ machine, change });
                        setReviewForm({ status: 'rejected', notes: '' });
                        setReviewModalOpen(true);
                      }}
                      size="sm"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.map(({ machine, change }) => (
            <Card key={change.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{machine.business_name}</CardTitle>
                    <CardDescription>{machine.location}</CardDescription>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Product</Label>
                    <p className="text-sm">{getProductName(change.currentProductId)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">New Product</Label>
                    <p className="text-sm">{getProductName(change.newProductId)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Slot Position</Label>
                    <p className="text-sm">Slot {change.currentSlotPosition}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-500">Reason</Label>
                  <p className="text-sm">{change.reason}</p>
                </div>
                {change.reviewNotes && (
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-500">Review Notes</Label>
                    <p className="text-sm">{change.reviewNotes}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Reviewed on: {new Date(change.reviewedAt!).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.map(({ machine, change }) => (
            <Card key={change.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{machine.business_name}</CardTitle>
                    <CardDescription>{machine.location}</CardDescription>
                  </div>
                  <Badge variant="destructive">Rejected</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Product</Label>
                    <p className="text-sm">{getProductName(change.currentProductId)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Requested Product</Label>
                    <p className="text-sm">{getProductName(change.newProductId)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Slot Position</Label>
                    <p className="text-sm">Slot {change.currentSlotPosition}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <Label className="text-sm font-medium text-gray-500">Reason</Label>
                  <p className="text-sm">{change.reason}</p>
                </div>
                {change.reviewNotes && (
                  <div className="mb-4">
                    <Label className="text-sm font-medium text-gray-500">Rejection Reason</Label>
                    <p className="text-sm">{change.reviewNotes}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Rejected on: {new Date(change.reviewedAt!).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewForm.status === 'approved' ? 'Approve' : 'Reject'} Request
            </DialogTitle>
            <DialogDescription>
              Review the customer's product change request and make your decision.
            </DialogDescription>
            {selectedRequest && (
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Machine:</strong> {selectedRequest.machine.business_name}
                </div>
                <div>
                  <strong>Current Product:</strong> {getProductName(selectedRequest.change.currentProductId)}
                </div>
                <div>
                  <strong>Requested Product:</strong> {getProductName(selectedRequest.change.newProductId)}
                </div>
                <div>
                  <strong>Slot Position:</strong> {selectedRequest.change.currentSlotPosition ? `Slot ${selectedRequest.change.currentSlotPosition}` : 'Not specified (legacy request)'}
                </div>
                <div>
                  <strong>Customer Reason:</strong> {selectedRequest.change.reason}
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Decision</Label>
              <Select
                value={reviewForm.status}
                onValueChange={(value: 'approved' | 'rejected') => 
                  setReviewForm(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">
                {reviewForm.status === 'approved' ? 'Notes (Optional)' : 'Rejection Reason'}
              </Label>
              <Textarea
                id="notes"
                placeholder={
                  reviewForm.status === 'approved' 
                    ? 'Add any notes about this approval...' 
                    : 'Please provide a reason for rejection...'
                }
                value={reviewForm.notes}
                onChange={(e) => setReviewForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={submitting || (reviewForm.status === 'rejected' && !reviewForm.notes.trim())}
            >
              {submitting ? 'Processing...' : reviewForm.status === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Route = createFileRoute('/admin/pending-requests')({
  component: () => (
    <ProtectedRoute>
      <PendingRequestsAdmin />
    </ProtectedRoute>
  ),
}); 