'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { updateAdminOrder } from '@/data/client/order';
import { trackOrderDetails, trackOrderFullfillment } from '@/lib/analytics';
import { formatCurrency } from '@/lib/formatCurrency';
import { getStatusBadgeClass } from '@/lib/renderStatus';
import { showToast } from '@/lib/toast';
import { formatOrderActor } from '@/types/domain/order';
import { Calendar, DollarSign, Package, Save, Truck, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { OrderDetailsSkeleton } from './SkeletonLoaders';
import { Order } from './types';

interface OrderDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOrderUpdate: (updatedOrderId?: string) => void;
  isLoading?: boolean;
}

const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  isOpen,
  onClose,
  order,
  onOrderUpdate,
  isLoading = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: order?.status || '',
    totalPrice: order?.totalPrice || 0,
    paymentStatus: order?.paymentStatus || '',
    trackingNumber: order?.trackingNumber || '',
    notes: order?.notes || '',
    estimatedDelivery: order?.estimatedDelivery || '',
    packingNotes: order?.packingNotes || '',
    deliveryNotes: order?.deliveryNotes || '',
    deliveryAttempts: order?.deliveryAttempts || 0,
    rescheduledDate: order?.rescheduledDate || '',
    rescheduledReason: order?.rescheduledReason || '',
    cashCollectedAmount: order?.cashCollectedAmount || 0,
  });

  React.useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || '',
        totalPrice: order.totalPrice || 0,
        paymentStatus: order.paymentStatus || '',
        trackingNumber: order.trackingNumber || '',
        notes: order.notes || '',
        estimatedDelivery: order.estimatedDelivery || '',
        packingNotes: order.packingNotes || '',
        deliveryNotes: order.deliveryNotes || '',
        deliveryAttempts: order.deliveryAttempts || 0,
        rescheduledDate: order.rescheduledDate || '',
        rescheduledReason: order.rescheduledReason || '',
        cashCollectedAmount: order.cashCollectedAmount || 0,
      });
    }
  }, [order]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const trackingEntries = order
    ? [
        {
          label: 'Address Confirmed By',
          actor: order.addressConfirmedBy,
          at: order.addressConfirmedAt,
          empty: 'Not confirmed',
        },
        {
          label: 'Order Confirmed By',
          actor: order.orderConfirmedBy,
          at: order.orderConfirmedAt,
          empty: 'Not confirmed',
        },
        {
          label: 'Packed By',
          actor: order.packedBy,
          at: order.packedAt,
          empty: 'Not packed',
        },
        {
          label: 'Dispatched By',
          actor: order.dispatchedBy,
          at: order.dispatchedAt,
          empty: 'Not dispatched',
        },
        {
          label: 'Delivery Assigned By',
          actor: order.assignedWarehouseBy,
          at: order.assignedWarehouseAt,
          empty: 'Not assigned',
        },
        {
          label: 'Delivered By',
          actor: order.deliveredBy,
          at: order.deliveredAt,
          empty: 'Not delivered',
        },
      ]
    : [];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateOrder = async () => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const result = await updateAdminOrder(order.id, formData);

      // Track order fulfillment analytics
      if (formData.status !== order.status) {
        trackOrderFullfillment({
          orderId: order.id,
          status: formData.status,
          previousStatus: order.status,
          value: formData.totalPrice,
          userId: order.clerkUserId || '',
        });
      }

      // Track detailed order information
      trackOrderDetails({
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: formData.status,
        value: formData.totalPrice,
        itemCount: order.products?.length || 0,
        paymentMethod: order.paymentMethod,
        userId: order.clerkUserId || '',
        products:
          order.products?.map((p) => ({
            productId: p.product?.id || '',
            name: p.product?.name || 'Unknown Product',
            quantity: p.quantity,
            price: p.product?.price || 0,
          })) || [],
      });

      // Show success message with refund info if applicable
      const refundAmount =
        typeof result.refundAmount === 'number' ? result.refundAmount : undefined;
      if (result.walletRefunded && refundAmount) {
        showToast.success(
          `Order updated successfully! $${refundAmount.toFixed(2)} refunded to customer's wallet.`,
        );
      } else {
        showToast.success('Order updated successfully');
      }

      // Refresh the orders list immediately to get the latest data
      await onOrderUpdate(order.id);

      // Close the sidebar immediately after refresh
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      showToast.error('Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInteractOutside = (e: Event) => {
    if (isUpdating) {
      e.preventDefault();
      showToast.warning(
        'Action in Progress',
        'Please wait for the current action to complete before closing.',
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="w-[60vw] max-w-3xl md:max-w-4xl xl:max-w-5xl overflow-y-auto px-6 py-8"
        onInteractOutside={handleInteractOutside}
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {order ? `Order Details - #${order.orderNumber}` : 'Loading Order Details...'}
          </SheetTitle>
          <SheetDescription>
            {order
              ? 'View and manage order information, status, and tracking details.'
              : 'Loading order information...'}
          </SheetDescription>
        </SheetHeader>

        {isLoading || !order ? (
          <OrderDetailsSkeleton />
        ) : (
          <div className="space-y-8 mt-8">
            {/* Cancellation Request Alert */}
            {order.cancellationRequested && (
              <Card className="border-orange-300 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    Cancellation Request Pending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-orange-700 mb-2">
                      <strong>Requested At:</strong>{' '}
                      {formatDate(order.cancellationRequestedAt || '')}
                    </p>
                    <p className="text-sm text-orange-700 mb-4">
                      <strong>Reason:</strong>{' '}
                      {order.cancellationRequestReason || 'No reason provided'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={async () => {
                        setIsUpdating(true);
                        try {
                          const { rejectCancellationRequest } = await import(
                            '@/actions/orderCancellationActions'
                          );
                          const result = await rejectCancellationRequest(order.id);

                          if (result.success) {
                            showToast.success(result.message);
                            // Wait for order update to complete before closing
                            await onOrderUpdate(order.id);
                            // Small delay to ensure the UI has updated
                            await new Promise((resolve) => setTimeout(resolve, 300));
                            onClose();
                          } else {
                            showToast.error(result.message);
                          }
                        } catch (error) {
                          console.error('Error rejecting cancellation:', error);
                          showToast.error('Failed to reject cancellation request');
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isUpdating ? 'Processing...' : '✓ Confirm Order'}
                    </Button>
                    <Button
                      onClick={async () => {
                        setIsUpdating(true);
                        try {
                          const { approveCancellationRequest } = await import(
                            '@/actions/orderCancellationActions'
                          );
                          const result = await approveCancellationRequest(order.id);

                          if (result.success) {
                            showToast.success(result.message);
                            // Wait for order update to complete before closing
                            await onOrderUpdate(order.id);
                            // Small delay to ensure the UI has updated
                            await new Promise((resolve) => setTimeout(resolve, 300));
                            onClose();
                          } else {
                            showToast.error(result.message);
                          }
                        } catch (error) {
                          console.error('Error approving cancellation:', error);
                          showToast.error('Failed to approve cancellation request');
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                      disabled={isUpdating}
                      variant="destructive"
                    >
                      {isUpdating ? 'Processing...' : '✗ Approve Cancellation'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Debug Information - Remove this after testing */}
            {process.env.NODE_ENV === 'development' && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-800">Debug Info (Dev Only)</CardTitle>
                </CardHeader>
                <CardContent>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-yellow-700 font-medium mb-2">
                      Raw Order Data (Click to expand)
                    </summary>
                    <pre className="bg-white p-2 rounded border overflow-auto max-h-40 text-xs">
                      {JSON.stringify(
                        {
                          totalPrice: order.totalPrice,
                          products: order.products?.map((p) => ({
                            quantity: p.quantity,
                            product: p.product,
                          })),
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </details>
                </CardContent>
              </Card>
            )}

            {/* Order Status and Actions */}
            <Card className="p-4 md:p-6 lg:p-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Order Status</span>
                  <Badge className={getStatusBadgeClass(order.status)}>{order.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">🔴 Pending</SelectItem>
                        <SelectItem value="address_confirmed">🟡 Address Confirmed</SelectItem>
                        <SelectItem value="order_confirmed">🟢 Order Confirmed</SelectItem>
                        <SelectItem value="packed">📦 Packed</SelectItem>
                        <SelectItem value="ready_for_delivery">✅ Ready for Delivery</SelectItem>
                        <SelectItem value="out_for_delivery">🚚 Out for Delivery</SelectItem>
                        <SelectItem value="delivered">📬 Delivered</SelectItem>
                        <SelectItem value="completed">✔️ Completed</SelectItem>
                        <SelectItem value="cancelled">❌ Cancelled</SelectItem>
                        <SelectItem value="rescheduled">📅 Rescheduled</SelectItem>
                        <SelectItem value="failed_delivery">⚠️ Failed Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value) => handleInputChange('paymentStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm">{order.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{order.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalPrice">Total Amount</Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      step="0.01"
                      value={formData.totalPrice}
                      onChange={(e) => handleInputChange('totalPrice', parseFloat(e.target.value))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Original: {formatCurrency(order.totalPrice || 0)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <p className="text-sm capitalize">{order.paymentMethod || 'Not specified'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Currency</Label>
                    <p className="text-sm">{order.currency || 'USD'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Subtotal</Label>
                    <p className="text-sm font-medium">{formatCurrency(order.subtotal || 0)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Tax</Label>
                    <p className="text-sm">{formatCurrency(order.tax || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Shipping</Label>
                    <p className="text-sm">{formatCurrency(order.shipping || 0)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Discount</Label>
                    <p className="text-sm text-green-600">
                      -{formatCurrency(order.amountDiscount || 0)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Items Total</Label>
                    <p className="text-sm font-medium">
                      {formatCurrency(
                        order.products?.reduce(
                          (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
                          0,
                        ) || 0,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Shipping & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                  <Input
                    id="estimatedDelivery"
                    type="datetime-local"
                    value={formData.estimatedDelivery}
                    onChange={(e) => handleInputChange('estimatedDelivery', e.target.value)}
                  />
                </div>
                {order.address && (
                  <div>
                    <Label className="text-sm font-medium">Shipping Address</Label>
                    <div className="text-sm bg-gray-50 p-3 rounded-md">
                      <p>{order.address.name}</p>
                      <p>{order.address.address}</p>
                      <p>
                        {order.address.city}, {order.address.state} {order.address.zip}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Employee Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Employee Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {trackingEntries.map((entry) => (
                    <div key={entry.label}>
                      <Label className="text-sm font-medium">{entry.label}</Label>
                      <p className="text-sm">
                        {formatOrderActor(entry.actor) || entry.empty}
                      </p>
                      {entry.at && (
                        <p className="text-xs text-gray-500">{formatDate(entry.at)}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned Deliveryman</Label>
                  <p className="text-sm">
                    {formatOrderActor(order.assignedDeliverymanName) || 'Not assigned'}
                  </p>
                  {order.assignedDeliverymanId && (
                    <p className="text-xs text-gray-500">ID: {order.assignedDeliverymanId}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Packing & Delivery Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Packing & Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="packingNotes">Packing Notes</Label>
                  <Textarea
                    id="packingNotes"
                    value={formData.packingNotes}
                    onChange={(e) => handleInputChange('packingNotes', e.target.value)}
                    placeholder="Enter packing notes"
                    className="min-h-20"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                  <Textarea
                    id="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                    placeholder="Enter delivery notes"
                    className="min-h-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryAttempts">Delivery Attempts</Label>
                    <Input
                      id="deliveryAttempts"
                      type="number"
                      min="0"
                      value={formData.deliveryAttempts}
                      onChange={(e) =>
                        handleInputChange('deliveryAttempts', parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="rescheduledDate">Rescheduled Date</Label>
                    <Input
                      id="rescheduledDate"
                      type="date"
                      value={formData.rescheduledDate}
                      onChange={(e) => handleInputChange('rescheduledDate', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="rescheduledReason">Reschedule Reason</Label>
                  <Textarea
                    id="rescheduledReason"
                    value={formData.rescheduledReason}
                    onChange={(e) => handleInputChange('rescheduledReason', e.target.value)}
                    placeholder="Enter reason for rescheduling"
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cash Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Cash Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Cash Collected</Label>
                    <p className="text-sm font-semibold">
                      {order.cashCollected ? '✅ Yes' : '❌ No'}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="cashCollectedAmount">Cash Amount</Label>
                    <Input
                      id="cashCollectedAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.cashCollectedAmount}
                      onChange={(e) =>
                        handleInputChange('cashCollectedAmount', parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Collected At</Label>
                    <p className="text-sm">
                      {order.cashCollectedAt ? formatDate(order.cashCollectedAt) : 'Not collected'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Received By</Label>
                    <p className="text-sm">
                      {formatOrderActor(order.paymentReceivedBy) || 'Not received'}
                    </p>
                    {order.paymentReceivedAt && (
                      <p className="text-xs text-gray-500">{formatDate(order.paymentReceivedAt)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.products?.map((item, index) => {
                    // Extract product data from the nested structure
                    const product = item.product;
                    const quantity = item.quantity || 1;
                    const price = product?.price || 0;
                    const lineTotal = price * quantity;
                    const imageUrl =
                      typeof product?.image === 'string'
                        ? product.image
                        : product?.image?.url || product?.image?.asset?.url;

                    // Debug logging to help identify the issue

                    return (
                      <div
                        key={item._key || index}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={product?.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-md border shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate mb-1">
                            {product?.name || 'Unknown Product'}
                          </p>
                          <div className="text-sm text-gray-600">
                            <p>
                              Qty: {quantity} × {formatCurrency(price)}
                            </p>
                            {price === 0 && (
                              <p className="text-xs text-red-500 mt-1 flex items-center">
                                <span className="mr-1">⚠️</span>
                                No price data found - check order source data
                              </p>
                            )}
                            {process.env.NODE_ENV === 'development' && price === 0 && (
                              <p className="text-xs text-orange-600 mt-1">
                                Available fields: {Object.keys(item).join(', ')} | Product fields:{' '}
                                {product ? Object.keys(product).join(', ') : 'No product data'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg text-gray-900">
                            {formatCurrency(lineTotal)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Order Total */}
                  <div className="border-t border-gray-200 pt-4 mt-4 bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lg text-gray-700">Order Total:</p>
                      <p className="font-bold text-2xl text-green-600">
                        {formatCurrency(order.totalPrice || 0)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Items calculated total:{' '}
                      {formatCurrency(
                        order.products?.reduce((sum, item) => {
                          const price = item.product?.price || 0;
                          return sum + price * (item.quantity || 1);
                        }, 0) || 0,
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Order Date</Label>
                  <p className="text-sm">{formatDate(order.orderDate || String(order.createdAt || ''))}</p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <Label className="text-sm font-medium">Estimated Delivery</Label>
                    <p className="text-sm">{formatDate(order.estimatedDelivery)}</p>
                  </div>
                )}
                {order.actualDelivery && (
                  <div>
                    <Label className="text-sm font-medium">Actual Delivery</Label>
                    <p className="text-sm">{formatDate(order.actualDelivery)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add notes about this order..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 pb-4 px-2">
              <Button
                onClick={handleUpdateOrder}
                disabled={isUpdating}
                className="flex-1 h-12 text-base font-medium"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {isUpdating ? 'Updating...' : 'Update Order'}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="h-12 px-8 text-base font-medium"
                size="lg"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetailsSidebar;
