'use client';

import { requestOrderCancellation } from '@/actions/orderCancellationActions';
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/orderStatus';
import { getStatusColor } from '@/lib/renderStatus';
import { fetchService } from '@/lib/restClient';
import { cn } from '@/lib/utils';
import useCartStore from '@/store';
import { getOrderId, getOrderImageUrl } from '@/types/domain/order';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Package,
  ShoppingCart,
  Truck,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Order } from './admin/types';
import OrderTimeline from './OrderTimeline';
import PriceFormatter from './PriceFormatter';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface OrderDetailsPageProps {
  order: Order;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case ORDER_STATUSES.PAID:
    case ORDER_STATUSES.DELIVERED:
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case ORDER_STATUSES.CANCELLED:
      return <XCircle className="w-5 h-5 text-red-500" />;
    case ORDER_STATUSES.SHIPPED:
    case ORDER_STATUSES.OUT_FOR_DELIVERY:
      return <Truck className="w-5 h-5 text-blue-500" />;
    default:
      return <Clock className="w-5 h-5 text-yellow-500" />;
  }
};

const getPaymentStatusIcon = (status: string) => {
  switch (status) {
    case PAYMENT_STATUSES.PAID:
      return {
        display: <CheckCircle className="w-4 h-4 text-green-500" />,
        text: 'Paid',
      };
    case PAYMENT_STATUSES.FAILED:
      return {
        display: <XCircle className="w-4 h-4 text-red-500" />,
        text: 'Failed',
      };
    case PAYMENT_STATUSES.CANCELLED:
      return {
        display: <XCircle className="w-4 h-4 text-red-500" />,
        text: 'Cancelled',
      };
    default:
      return {
        display: <Clock className="w-4 h-4 text-yellow-500" />,
        text: 'Cash On Delivery',
      };
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case PAYMENT_STATUSES.PAID:
      return 'bg-green-100 text-green-800';
    case PAYMENT_STATUSES.FAILED:
    case PAYMENT_STATUSES.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ order }) => {
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(order);
  const [isReordering, setIsReordering] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const { addMultipleItems } = useCartStore();
  const router = useRouter();
  const orderDate = currentOrder.orderDate || currentOrder.createdAt;
  const timelineOrder = {
    ...currentOrder,
    orderDate: orderDate ? String(orderDate) : new Date().toISOString(),
  };

  const orderItems = (currentOrder.products || []).map((item) => {
    const product = item.product;
    const name = product?.name || item.name || `Product ${item.productId.slice(0, 8)}`;
    const slugValue = typeof product?.slug === 'string' ? product.slug : product?.slug?.current;
    // Use snapshot price stored in order item first; product price may have changed later.
    const price = item.price ?? product?.price ?? 0;
    const imageUrl = getOrderImageUrl(product);
    const categoryText = product?.categories
      ?.map((cat) => cat.title)
      .filter(Boolean)
      .join(', ');
    return {
      key: item.id || item.productId,
      productId: item.productId,
      quantity: item.quantity,
      name,
      slugValue,
      price,
      imageUrl,
      categoryText,
      product,
    };
  });

  const addressDisplay = {
    name:
      currentOrder.address?.name || currentOrder.addressName || currentOrder.customerName || '-',
    address: currentOrder.address?.address || currentOrder.addressLine || '-',
    city: currentOrder.address?.city || currentOrder.city || '-',
    state: currentOrder.address?.state || currentOrder.state || '-',
    zip: currentOrder.address?.zip || currentOrder.zip || '-',
  };

  const itemsSubtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summarySubtotal = currentOrder.subtotal ?? itemsSubtotal;
  const summaryTax = currentOrder.tax ?? 0;
  const summaryShipping = currentOrder.shipping ?? 0;
  const summaryDiscount = currentOrder.amountDiscount ?? 0;
  const summaryTotal =
    currentOrder.totalPrice ??
    Math.max(summarySubtotal + summaryTax + summaryShipping - summaryDiscount, 0);

  const handleReorder = async () => {
    const reorderableItems = orderItems.filter((item) => item.product);
    if (!reorderableItems.length) {
      toast.error('Cannot reorder this order because product details are missing.');
      return;
    }

    setIsReordering(true);
    try {
      // Transform order products to cart format
      const cartItems = reorderableItems.map(({ product, quantity }) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        product: product as any,
        quantity,
      }));

      // Add all items to cart at once
      addMultipleItems(cartItems);

      toast.success(`${reorderableItems.length} items added to cart!`, {
        description: 'Redirecting to cart...',
      });

      // Redirect to cart after a short delay
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to reorder items. Please try again.');
    } finally {
      setIsReordering(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setGeneratingInvoice(true);
    try {
      const response = await fetchService(`/orders/${getOrderId(order)}/generate-invoice`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Invoice generated successfully!');
        // Update the current order with the new invoice data
        setCurrentOrder((prev) => ({
          ...prev,
          invoice: data.invoice,
        }));
      } else {
        console.error('Invoice generation failed:', data);
        const errorMessage = data.error || 'Failed to generate invoice';
        const details = data.details ? ` Details: ${data.details}` : '';
        toast.error(errorMessage + details);
      }
    } catch (error) {
      console.error('Invoice generation error:', error);
      toast.error('Network error: Failed to generate invoice. Please try again.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const result = await requestOrderCancellation(
        getOrderId(order),
        cancellationReason || 'Cancelled by customer',
      );

      if (result.success) {
        toast.success(result.message);
        // Update the current order to show cancellation request pending
        setCurrentOrder(
          (prev) =>
            ({
              ...prev,
              cancellationRequested: true,
              cancellationRequestedAt: new Date().toISOString(),
              cancellationRequestReason: cancellationReason || 'Cancelled by customer',
            }) as any,
        );
        setShowCancelDialog(false);
        setCancellationReason('');

        // Refresh the page to show updated status
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to submit cancellation request');
      }
    } catch (error) {
      console.error('Error requesting cancellation:', error);
      toast.error('An error occurred while submitting the cancellation request');
    } finally {
      setIsCancelling(false);
    }
  };

  // Check if order can be cancelled (before order is confirmed)
  const canCancelOrder = () => {
    const cancellableStatuses = ['pending', 'address_confirmed'];
    return (
      cancellableStatuses.includes(currentOrder.status) &&
      currentOrder.status !== 'cancelled' &&
      !(currentOrder as any).cancellationRequested // Don't show cancel button if request already pending
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">Order #{currentOrder.orderNumber}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {currentOrder.invoice?.hosted_invoice_url ? (
            <Button asChild variant="outline">
              <Link
                href={currentOrder.invoice.hosted_invoice_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Link>
            </Button>
          ) : currentOrder.paymentStatus === 'paid' || currentOrder.status === 'paid' ? (
            <Button onClick={handleGenerateInvoice} disabled={generatingInvoice} variant="outline">
              {generatingInvoice ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Invoice
                </>
              )}
            </Button>
          ) : null}
          <Button
            onClick={handleReorder}
            disabled={isReordering}
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
          >
            {isReordering ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Adding to Cart...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Reorder
              </>
            )}
          </Button>
          {canCancelOrder() && (
            <Button
              onClick={() => setShowCancelDialog(true)}
              disabled={isCancelling}
              variant="outline"
              className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            >
              {isCancelling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Order
                </>
              )}
            </Button>
          )}
          <Button asChild>
            <Link href="/user/orders">← Back to Orders</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cancellation Request Notice */}
          {(currentOrder as any).cancellationRequested && (
            <Card className="border-orange-300 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Cancellation Request Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700">
                  Your cancellation request has been submitted and is awaiting admin review. You
                  will be notified once it has been processed.
                </p>
                {(currentOrder as any).cancellationRequestedAt && (
                  <p className="text-xs text-orange-600 mt-2">
                    Requested on:{' '}
                    {format(
                      new Date((currentOrder as any).cancellationRequestedAt),
                      "MMM dd, yyyy 'at' h:mm a",
                    )}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(currentOrder.status)}
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <Badge className={`${getStatusColor(currentOrder.status).style} mt-1`}>
                    {getStatusColor(currentOrder.status).text}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge
                    className={`${getPaymentStatusColor(
                      currentOrder.paymentStatus,
                    )} mt-1 flex items-center gap-1 w-fit`}
                  >
                    {getPaymentStatusIcon(currentOrder.paymentStatus).display}
                    {getPaymentStatusIcon(currentOrder.paymentStatus).text}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    {(currentOrder.paymentMethod || '-').replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {orderDate ? format(new Date(orderDate), 'PPP') : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <OrderTimeline order={timelineOrder} />

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({currentOrder.products?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => {
                  return (
                    <div key={item.key} className="flex items-center gap-4 p-4 border rounded-lg">
                      {item.imageUrl && (
                        <div className="relative w-16 h-16 shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name || 'Product'}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.slugValue ? (
                            <Link
                              href={`/product/${item.slugValue}`}
                              className="hover:text-shop_dark_green transition-colors"
                            >
                              {item.name}
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        {item.categoryText ? (
                          <p className="text-sm text-gray-500 mt-1">{item.categoryText}</p>
                        ) : null}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <PriceFormatter
                            showDecimals
                            amount={item.price}
                            className="font-medium"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <PriceFormatter
                          showDecimals
                          amount={item.price * item.quantity}
                          className="font-medium text-lg"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Address */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <PriceFormatter amount={summarySubtotal} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <PriceFormatter amount={summaryTax} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <PriceFormatter amount={summaryShipping} />
                </div>
                {summaryDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -<PriceFormatter amount={summaryDiscount} />
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <PriceFormatter amount={summaryTotal} />
                </div>
              </div>
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
              <div className="text-sm space-y-1">
                <p className="font-medium">{addressDisplay.name}</p>
                <p className="text-gray-600">{addressDisplay.address}</p>
                <p className="text-gray-600">
                  {addressDisplay.city}, {addressDisplay.state} {addressDisplay.zip}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div>
                  <p className="font-medium">{currentOrder.customerName}</p>
                  <p className="text-gray-600">{currentOrder.email}</p>
                </div>
                {currentOrder.paymentCompletedAt && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-600">Payment Completed</p>
                    <p className="font-medium">
                      {format(new Date(currentOrder.paymentCompletedAt), 'PPp')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            className={cn(
              'fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
            )}
          >
            <VisuallyHidden.Root>
              <DialogTitle>Cancel Order Confirmation</DialogTitle>
            </VisuallyHidden.Root>
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border-4 border-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Request Order Cancellation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your cancellation request will be submitted to our team for review.
                </p>

                {/* Cancellation Reason Input */}
                <div className="mt-4 text-left">
                  <label
                    htmlFor="cancellationReason"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Reason for cancellation (optional)
                  </label>
                  <textarea
                    id="cancellationReason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="e.g., Changed my mind, found a better deal..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                {currentOrder.paymentStatus === 'paid' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-blue-900">Refund Information</p>
                        <p className="text-sm text-blue-700 mt-1">
                          If approved, your payment of{' '}
                          <span className="font-bold">
                            <PriceFormatter amount={currentOrder.totalPrice} />
                          </span>{' '}
                          will be added to your wallet balance.
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                          <li>Use it for future orders</li>
                          <li>Request withdrawal anytime</li>
                          <li>View balance in your dashboard</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelDialog(false);
                  setCancellationReason('');
                }}
                disabled={isCancelling}
                className="flex-1 border-gray-300 hover:bg-gray-50 font-medium"
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 font-semibold shadow-lg hover:shadow-orange-200"
              >
                {isCancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default OrderDetailsPage;
