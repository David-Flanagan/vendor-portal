'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beach-box/unify-ui';
import { Badge } from '@beach-box/unify-ui';
import { Button } from '@beach-box/unify-ui';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@beach-box/unify-ui';
import { Alert, AlertDescription } from '@beach-box/unify-ui';
import {
  CreditCard,
  Plus,
  Trash2,
  Shield,
  CheckCircle,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useBilling } from '@/lib/hooks/useBilling';

export function PaymentMethods() {
  const { data: billingInfo, isLoading } = useBilling();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <PaymentMethodsSkeleton />;
  }

  const paymentMethods = billingInfo?.paymentMethods || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Methods</span>
            </span>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card for billing
                  </DialogDescription>
                </DialogHeader>
                <AddPaymentMethodForm onClose={() => setShowAddDialog(false)} />
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Manage your saved payment methods for subscriptions and invoices
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your payment information is securely stored and encrypted. We never store your full card number.
        </AlertDescription>
      </Alert>

      {/* Payment Methods List */}
      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">No Payment Methods</p>
            <p className="text-gray-600 mb-6">
              Add a payment method to handle subscription billing automatically
            </p>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card for billing
                  </DialogDescription>
                </DialogHeader>
                <AddPaymentMethodForm onClose={() => setShowAddDialog(false)} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PaymentMethodCard({ method }: { method: any }) {
  const [isRemoving, setIsRemoving] = useState(false);

  const removePaymentMethod = async () => {
    setIsRemoving(true);
    try {
      // TODO: Implement payment method removal
      console.log('Removing payment method:', method.id);
    } catch (error) {
      console.error('Error removing payment method:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    // In a real implementation, you'd have proper card brand icons
    return <CreditCard className="h-6 w-6 text-gray-500" />;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getCardBrandIcon(method.card?.brand)}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  •••• •••• •••• {method.card?.last4}
                </span>
                <Badge variant="outline" className="text-xs uppercase">
                  {method.card?.brand}
                </Badge>
                {method.is_default && (
                  <Badge className="text-xs">Default</Badge>
                )}
              </div>
              <div className="text-sm text-gray-600 flex items-center space-x-4 mt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Expires {method.card?.exp_month}/{method.card?.exp_year}</span>
                </span>
                {method.card?.funding && (
                  <span className="capitalize">{method.card.funding}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!method.is_default && (
              <Button variant="outline" size="sm">
                Set as Default
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={removePaymentMethod}
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AddPaymentMethodForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement Stripe payment method creation
      console.log('Adding payment method...');
      // This would integrate with Stripe Elements or similar

      // Close dialog on success
      onClose();
    } catch (error) {
      console.error('Error adding payment method:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your payment information is processed securely through Stripe and is never stored on our servers.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* This would normally contain Stripe Elements */}
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Stripe Payment Form</p>
          <p className="text-sm text-gray-500">
            In a real implementation, this would contain Stripe Elements for secure card input
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Payment Method'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function PaymentMethodsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}