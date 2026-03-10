export interface OrderProductRef {
  id?: string;
  name?: string;
  slug?: { current?: string } | string;
  image?: string | { url?: string; asset?: { url: string } };
  images?: Array<string | { url?: string; asset?: { url: string } }>;
  price?: number;
  currency?: string;
  categories?: Array<{ title?: string }>;
}

export interface OrderProduct {
  _key?: string;
  id?: string;
  orderId?: string;
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string | { url?: string; asset?: { url: string } };
  product?: OrderProductRef;
}

export interface OrderInvoice {
  id?: string;
  number?: string;
  hosted_invoice_url?: string;
}

export interface OrderAddress {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface OrderTrackingFields {
  addressConfirmedBy?: string;
  addressConfirmedAt?: string;
  orderConfirmedBy?: string;
  orderConfirmedAt?: string;
  packedBy?: string;
  packedAt?: string;
  packingNotes?: string;
  dispatchedBy?: string;
  dispatchedAt?: string;
  assignedWarehouseBy?: string;
  assignedWarehouseAt?: string;
  assignedDeliverymanId?: string;
  assignedDeliverymanName?: string;
  deliveredBy?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
  deliveryAttempts?: number;
  rescheduledDate?: string;
  rescheduledReason?: string;
  cashCollected?: boolean;
  cashCollectedAmount?: number;
  cashCollectedAt?: string;
  paymentReceivedBy?: string;
  paymentReceivedById?: string;
  paymentReceivedAt?: string;
}

export interface OrderCancellationFields {
  cancellationRequested?: boolean;
  cancellationRequestedAt?: string;
  cancellationRequestReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  refundedToWallet?: boolean;
  refundAmount?: number;
}

export interface OrderPaymentFields {
  amountPaid?: number;
  paymentCompletedAt?: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
}

export interface Order extends OrderTrackingFields, OrderCancellationFields, OrderPaymentFields {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  totalAmount?: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal?: number | null;
  shipping?: number | null;
  tax?: number | null;
  addressName?: string | null;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
  orderDate?: string;
  currency?: string;
  amountDiscount?: number;
  invoice?: OrderInvoice;
  clerkUserId?: string;
  address?: OrderAddress;
  products: OrderProduct[];
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface UserOrder extends Partial<
  Omit<Order, 'id' | 'userId' | 'customerName' | 'products'>
> {
  id?: string;
  userId?: string;
  customerName?: string;
  products?: OrderProduct[];
  customerId?: string;
}

export const getOrderId = (order: UserOrder) => order.id || '';

export const getOrderImageUrl = (product?: {
  image?: string | { url?: string; asset?: { url: string } };
  images?: Array<string | { url?: string; asset?: { url: string } }>;
  product?: {
    image?: string | { url?: string; asset?: { url: string } };
    images?: Array<string | { url?: string; asset?: { url: string } }>;
  };
}) => {
  if (!product) return '';
  const source = product.product || product;
  const imageCandidate = source.images?.[0] || source.image;
  if (!imageCandidate) return '';
  if (typeof imageCandidate === 'string') return imageCandidate;
  return imageCandidate.url || imageCandidate.asset?.url || '';
};
