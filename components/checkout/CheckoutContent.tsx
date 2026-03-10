'use client';

import { OrderPlacementOverlay } from '@/components/cart/OrderPlacementSkeleton';
import { CheckoutSkeleton } from '@/components/checkout/CheckoutSkeleton';
import { OrderAddressSelector } from '@/components/checkout/OrderAddressSelector';
import PriceFormatter from '@/components/PriceFormatter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useUserData } from '@/contexts/UserDataContext';
import { useOrderPlacement } from '@/hooks/useOrderPlacement';
import { PAYMENT_METHODS, PaymentMethod } from '@/lib/orderStatus';
import { fetchService } from '@/lib/restClient';
import useCartStore, { CartItem } from '@/store';
import { CreditCard, Loader2, MapPin, Package, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface OrderAddress {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  default: boolean;
  createdAt: string;
  lastUsed: string;
  orderNumber: string;
  source: 'order';
}

export function CheckoutContent() {
  const { authUser, authReady, isAuthenticated, isLoading } = useUserData();
  const searchParams = useSearchParams();
  const { items: cart, resetCart, getSubTotalPrice, getTotalDiscount } = useCartStore();
  const { placeOrder, isPlacingOrder, orderStep } = useOrderPlacement({
    user: authUser ? { id: authUser.id, email: authUser.email ?? undefined } : null,
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(
    PAYMENT_METHODS.STRIPE,
  );
  const [selectedAddress, setSelectedAddress] = useState<OrderAddress | null>(null);
  const [addresses, setAddresses] = useState<OrderAddress[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [actionType, setActionType] = useState<'pay' | 'order' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasInitialCart, setHasInitialCart] = useState<boolean | null>(null);
  const isBusinessUser = Boolean(authUser?.isBusiness);

  // New pricing structure
  const grossSubtotal = getSubTotalPrice(); // Gross amount (before discount)
  const totalDiscount = getTotalDiscount(); // Total discount amount
  const currentSubtotal = grossSubtotal - totalDiscount; // After discount

  // Business account discount (2% additional discount)
  const businessDiscount = isBusinessUser ? currentSubtotal * 0.02 : 0;
  const finalSubtotal = currentSubtotal - businessDiscount;

  const shipping = finalSubtotal > 100 ? 0 : 10;
  const tax = finalSubtotal * (parseFloat(process.env.TAX_AMOUNT || '0') || 0);
  const total = finalSubtotal + shipping + tax;

  // Fetch user addresses from previous orders
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!authUser?.id) return;

      try {
        const response = await fetchService('/user/addresses');
        if (response.ok) {
          const payload = await response.json();
          const rawAddresses = payload?.data ?? payload?.addresses ?? payload;
          const list = Array.isArray(rawAddresses) ? rawAddresses : rawAddresses?.data || [];
          const normalized = (list as OrderAddress[]).map((addr: any) => ({
            id: addr.id,
            name: addr.name || addr.addressName || 'Address',
            email: addr.email || authUser?.email || '',
            address: addr.address || '',
            city: addr.city || '',
            state: addr.state || '',
            zip: addr.zip || '',
            default: Boolean(addr.isDefault ?? addr.default),
            createdAt: addr.createdAt || new Date().toISOString(),
            lastUsed: addr.lastUsed || addr.updatedAt || new Date().toISOString(),
            orderNumber: addr.orderNumber || '',
            source: 'order' as const,
          }));
          setAddresses(normalized);

          // Set default address (most recently used)
          const defaultAddress = normalized.find((addr) => addr.default);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          } else if (normalized.length > 0) {
            setSelectedAddress(normalized[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (authReady && authUser) {
      fetchAddresses();
    }
  }, [authReady, authUser]);

  // Read address from URL parameters (when coming from cart)
  useEffect(() => {
    const addressParam = searchParams.get('address');
    if (addressParam) {
      try {
        const decodedAddress = JSON.parse(decodeURIComponent(addressParam));
        // Convert regular address to OrderAddress format
        const orderAddress: OrderAddress = {
          id: decodedAddress.id,
          name: decodedAddress.name,
          email: decodedAddress.email,
          address: decodedAddress.address,
          city: decodedAddress.city,
          state: decodedAddress.state,
          zip: decodedAddress.zip,
          default: decodedAddress.default,
          createdAt: decodedAddress.createdAt,
          lastUsed: new Date().toISOString(),
          orderNumber: 'cart-selected',
          source: 'order' as const,
        };
        setSelectedAddress(orderAddress);

        // Show success message
        toast.success('Ready for Checkout! 🛒', {
          description: 'Complete your order by selecting a payment method below',
          duration: 4000,
        });
      } catch (error) {
        console.error('Error parsing address from URL:', error);
        toast.error('Error loading address from cart');
      }
    }
  }, [searchParams]);

  // Track initial cart state and redirect if empty
  useEffect(() => {
    if (hasInitialCart === null && authReady && cart !== undefined) {
      setHasInitialCart(cart.length > 0);

      // If cart is empty on initial load, redirect to cart
      if (cart.length === 0) {
        window.location.href = '/cart';
        return;
      }
    }
  }, [cart, hasInitialCart, authReady]);

  const handlePayNowClick = () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    if (selectedPaymentMethod !== PAYMENT_METHODS.STRIPE) {
      toast.error('Please select Credit/Debit Card to pay now.');
      return;
    }
    void handlePlaceOrder('pay', 'stripe');
  };

  const handlePlaceOrder = async (action: 'pay' | 'order', paymentGateway?: 'stripe') => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setActionType(action);

    // Determine payment method based on action and gateway
    let paymentMethodToUse = selectedPaymentMethod;
    if (action === 'pay' && paymentGateway === 'stripe') {
      paymentMethodToUse = PAYMENT_METHODS.STRIPE;
    }

    const result = await placeOrder(
      selectedAddress,
      paymentMethodToUse,
      finalSubtotal, // Pass final subtotal (includes business discount)
      shipping,
      tax,
      total,
    );

    if (result?.success && result.redirectTo) {
      setIsRedirecting(true);
      if (action === 'pay' && result.isStripeRedirect) {
        // Direct payment - clear cart and redirect
        resetCart();
        window.location.href = result.redirectTo;
      } else {
        // Order placed - clear cart and redirect with appropriate delay
        setTimeout(
          () => {
            resetCart();
            window.location.href = result.redirectTo;
          },
          action === 'order' ? 1500 : 500,
        );
      }
    }

    setActionType(null);
  };

  if (!authReady || isLoading) {
    return <CheckoutSkeleton />;
  }

  if (!isAuthenticated || !authUser) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Please sign in to proceed with checkout.</p>
      </div>
    );
  }

  // Show loading during redirect process
  if (isRedirecting) {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
        <h2 className="text-xl font-semibold mb-2">Processing your order...</h2>
        <p className="text-muted-foreground">
          Please wait while we redirect you to complete your payment.
        </p>
      </div>
    );
  }

  // If cart is empty and we had an initial cart, show loading (likely during order processing)
  if ((!cart || cart.length === 0) && hasInitialCart) {
    return <CheckoutSkeleton />;
  }

  // If cart is empty and no initial cart, this shouldn't happen due to redirect
  // But show fallback just in case
  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-10 animate-in fade-in-0 duration-500">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Add some products to continue with checkout</p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <a href="/shop">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Order Items */}
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={(value) => setSelectedPaymentMethod(value as PaymentMethod)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem
                  value={PAYMENT_METHODS.CASH_ON_DELIVERY}
                  id="cod"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor="cod" className="cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <Truck className="w-4 h-4" />
                      Cash on Delivery
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay when your order is delivered to your doorstep
                    </p>
                  </Label>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value={PAYMENT_METHODS.STRIPE} id="stripe" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="stripe" className="cursor-pointer">
                    <div className="flex items-center gap-2 font-medium">
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay securely with your credit or debit card via Stripe
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingAddresses ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-40"></div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-52"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-36"></div>
                  </div>
                </div>
              </div>
            ) : searchParams.get('address') ? (
              // Show only selected address when coming from cart
              selectedAddress && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{selectedAddress.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedAddress.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                      </p>
                      {selectedAddress.email && (
                        <p className="text-sm text-muted-foreground">{selectedAddress.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                      ✓ Selected
                    </div>
                  </div>
                </div>
              )
            ) : (
              <OrderAddressSelector
                addresses={addresses}
                selectedAddress={selectedAddress}
                onAddressSelect={setSelectedAddress}
                isLoading={isLoadingAddresses}
              />
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items ({cart.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item: CartItem) => (
              <div key={item.product.id} className="flex gap-3 p-3 border rounded-lg">
                <div className="w-16 h-16 shrink-0">
                  <Image
                    src={
                      (typeof item.product.images?.[0] === 'string'
                        ? item.product.images[0]
                        : item.product.images?.[0]?.url) || '/placeholder.jpg'
                    }
                    alt={item.product.name || 'Product'}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    <PriceFormatter amount={(item.product.price || 0) * item.quantity} />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <PriceFormatter amount={item.product.price || 0} /> each
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <PriceFormatter amount={grossSubtotal} />
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  -<PriceFormatter amount={totalDiscount} />
                </span>
              </div>
            )}
            {businessDiscount > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Business Account Discount (2%)</span>
                <span>
                  -<PriceFormatter amount={businessDiscount} />
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <PriceFormatter amount={shipping} />
              )}
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <PriceFormatter amount={tax} />
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <PriceFormatter amount={total} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={handlePayNowClick}
            disabled={isPlacingOrder || !selectedAddress || cart.length === 0}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isPlacingOrder && actionType === 'pay' ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Pay Now
              </div>
            )}
          </Button>

          <Button
            onClick={() => handlePlaceOrder('order')}
            disabled={isPlacingOrder || !selectedAddress || cart.length === 0}
            variant="outline"
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isPlacingOrder && actionType === 'order' ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing Order...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Place Order (Pay Later)
              </div>
            )}
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          {selectedPaymentMethod === PAYMENT_METHODS.STRIPE ? (
            <>
              <p>🔒 Secure checkout powered by Stripe</p>
              <p>Your payment information is encrypted and secure</p>
            </>
          ) : (
            <>
              <p>💵 Pay when your order arrives</p>
              <p>Cash payment to delivery agent</p>
            </>
          )}
        </div>
      </div>

      {/* Order Placement Overlay */}
      {isPlacingOrder && (
        <OrderPlacementOverlay step={orderStep} isCheckoutRedirect={actionType === 'pay'} />
      )}
    </div>
  );
}
