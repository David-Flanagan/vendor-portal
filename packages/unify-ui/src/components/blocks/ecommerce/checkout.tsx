import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CreditCard, Lock, Package, Truck } from 'lucide-react';

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  label: string;
  icon?: React.ReactNode;
}

export interface CheckoutProps {
  items: CheckoutItem[];
  shippingMethods: ShippingMethod[];
  paymentMethods: PaymentMethod[];
  onPlaceOrder: (orderData: any) => void;
  className?: string;
  currency?: string;
  defaultShippingMethod?: string;
  defaultPaymentMethod?: string;
  onBack?: () => void;
  isLoading?: boolean;
}

export function Checkout({
  items,
  shippingMethods,
  paymentMethods,
  onPlaceOrder,
  className,
  currency = '$',
  defaultShippingMethod,
  defaultPaymentMethod,
  onBack,
  isLoading = false,
}: CheckoutProps) {
  const [step, setStep] = React.useState(1);
  const [shippingMethod, setShippingMethod] = React.useState(defaultShippingMethod);
  const [paymentMethod, setPaymentMethod] = React.useState(defaultPaymentMethod);
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    saveInfo: false,
    notes: '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.1; // Example tax calculation
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      onPlaceOrder({
        ...formData,
        shippingMethod,
        paymentMethod,
        items,
        subtotal,
        shipping,
        tax,
        total,
      });
    }
  };

  return (
    <div className={cn('grid gap-8 lg:grid-cols-2', className)}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, country: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          {/* Add more countries as needed */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Shipping Method</Label>
                    <RadioGroup
                      value={shippingMethod}
                      onValueChange={setShippingMethod}
                      className="space-y-4"
                    >
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center space-x-4 rounded-lg border p-4"
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label
                            htmlFor={method.id}
                            className="flex flex-1 cursor-pointer items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4" />
                              <span>{method.name}</span>
                            </div>
                            <span className="font-medium">
                              {currency}
                              {method.price.toFixed(2)}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Add any special instructions or notes for your order..."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center space-x-4 rounded-lg border p-4"
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label
                            htmlFor={method.id}
                            className="flex flex-1 cursor-pointer items-center space-x-2"
                          >
                            {method.icon}
                            <span>{method.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, saveInfo: checked as boolean }))
                      }
                    />
                    <Label
                      htmlFor="saveInfo"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Save payment information for next time
                    </Label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  onBack && (
                    <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Button>
                  )
                )}
                <Button type="submit" disabled={isLoading}>
                  {step === 3 ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {currency}
                      {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {currency}
                    {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>
                    {currency}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>
                    {currency}
                    {shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>
                    {currency}
                    {tax.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>
                    {currency}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secure Checkout</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
