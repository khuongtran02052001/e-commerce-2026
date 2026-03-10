'use server';

import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';
import { OrderWithTracking } from '@/types/domain/employee';

type ApiAny = Record<string, any>;

type ActionResult = { success: boolean; message: string };

const unwrapList = (payload: any, key: string) => {
  const direct = Array.isArray(payload?.[key]) ? payload[key] : null;
  const inData = Array.isArray(payload?.data?.[key]) ? payload.data[key] : null;
  const dataArray = Array.isArray(payload?.data) ? payload.data : null;
  const plainArray = Array.isArray(payload) ? payload : null;
  return direct || inData || dataArray || plainArray || [];
};

const toUiOrder = (value: ApiAny): OrderWithTracking => {
  const id = value?.id || '';
  return {
    id,
    orderNumber: value?.orderNumber || '',
    customerName: value?.customerName || '',
    email: value?.email || '',
    totalPrice: Number(value?.totalPrice || 0),
    currency: value?.currency || 'USD',
    status: value?.status || '',
    paymentStatus: value?.paymentStatus || '',
    paymentMethod: value?.paymentMethod || '',
    orderDate: value?.orderDate || value?.createdAt || '',
    address: {
      name: value?.addressName || value?.address?.name || '',
      address: value?.addressLine || value?.address || value?.address?.address || '',
      city: value?.city || value?.address?.city || '',
      state: value?.state || value?.address?.state || '',
      zip: value?.zip || value?.address?.zip || '',
    },
    products: (value?.products || []).map((item: ApiAny) => ({
      product: {
        id: item?.product?.id || item?.productId || '',
        name: item?.name || item?.product?.name || 'Unknown product',
        price: Number(item?.price || item?.product?.price || 0),
        image:
          item?.image ||
          item?.product?.image ||
          item?.product?.images?.[0] ||
          item?.product?.mainImageUrl ||
          '',
      },
      quantity: Number(item?.quantity || 0),
    })),
    tracking: {
      addressConfirmedBy: value?.addressConfirmedBy,
      addressConfirmedAt: value?.addressConfirmedAt,
      orderConfirmedBy: value?.orderConfirmedBy,
      orderConfirmedAt: value?.orderConfirmedAt,
      packedBy: value?.packedBy,
      packedAt: value?.packedAt,
      packingNotes: value?.packingNotes,
      assignedWarehouseBy: value?.assignedWarehouseBy,
      assignedWarehouseAt: value?.assignedWarehouseAt,
      dispatchedBy: value?.dispatchedBy,
      dispatchedAt: value?.dispatchedAt,
      assignedDeliverymanId: value?.assignedDeliverymanId,
      assignedDeliverymanName: value?.assignedDeliverymanName,
      deliveredBy: value?.deliveredBy,
      deliveredAt: value?.deliveredAt,
      deliveryNotes: value?.deliveryNotes,
      deliveryAttempts: value?.deliveryAttempts,
      rescheduledDate: value?.rescheduledDate,
      rescheduledReason: value?.rescheduledReason,
      cashCollected: Boolean(value?.cashCollected || value?.cashCollectedAt),
      cashCollectedAmount: value?.cashCollectedAmount,
      cashCollectedAt: value?.cashCollectedAt,
      paymentReceivedBy: value?.paymentReceivedBy || value?.paymentReceivedById,
      paymentReceivedAt: value?.paymentReceivedAt,
    },
  };
};

async function getSessionToken() {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error('Unauthorized');
  }
  return session.accessToken;
}

async function patchWorkflow(
  orderId: string,
  actionPath: string,
  body?: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    const accessToken = await getSessionToken();
    const res = await fetchServiceJsonServer<ApiAny>(`/admin/orders/${orderId}/${actionPath}`, {
      method: 'PATCH',
      body: JSON.stringify(body || {}),
      accessToken,
    });
    return {
      success: res?.success !== false,
      message: res?.message || 'Workflow updated successfully',
    };
  } catch (error) {
    console.error(`Error updating workflow (${actionPath}):`, error);
    return { success: false, message: 'Failed to update order workflow' };
  }
}

export async function getOrdersForEmployee(): Promise<OrderWithTracking[]> {
  try {
    const accessToken = await getSessionToken();
    const urls = [
      '/admin/orders?page=1&perPage=200',
      '/admin/orders?limit=200&offset=0',
      '/admin/orders?page=1&limit=200',
      '/admin/orders',
    ];

    for (const url of urls) {
      try {
        const res = await fetchServiceJsonServer<ApiAny>(url, {
          accessToken,
          cache: 'no-store',
        });
        const orders = unwrapList(res, 'orders').map(toUiOrder);
        if (orders.length) return orders;
      } catch {
        // try next pagination format
      }
    }

    return [];
  } catch (error) {
    console.error('Error fetching employee orders:', error);
    return [];
  }
}

export async function confirmAddress(orderId: string, notes?: string): Promise<ActionResult> {
  return patchWorkflow(orderId, 'address-confirm', { notes });
}

export async function confirmOrder(orderId: string, notes?: string): Promise<ActionResult> {
  return patchWorkflow(orderId, 'order-confirm', { notes });
}

export async function markAsPacked(orderId: string, notes?: string): Promise<ActionResult> {
  return patchWorkflow(orderId, 'pack', { notes });
}

export async function assignDeliveryman(
  orderId: string,
  deliverymanId: string,
  notes?: string,
): Promise<ActionResult> {
  return patchWorkflow(orderId, 'assign-deliveryman', { deliverymanId, notes });
}

export async function startDelivery(orderId: string, notes?: string): Promise<ActionResult> {
  return patchWorkflow(orderId, 'start-delivery', { notes });
}

export async function markAsDelivered(
  orderId: string,
  cashCollectedAmount?: number,
  notes?: string,
): Promise<ActionResult> {
  return patchWorkflow(orderId, 'deliver', {
    cashCollectedAmount:
      typeof cashCollectedAmount === 'number' && Number.isFinite(cashCollectedAmount)
        ? cashCollectedAmount
        : undefined,
    notes,
  });
}

export async function rescheduleDelivery(orderId: string, notes?: string): Promise<ActionResult> {
  return patchWorkflow(orderId, 'reschedule-delivery', { notes });
}

export async function markFailedDelivery(orderId: string, notes?: string): Promise<ActionResult> {
  return patchWorkflow(orderId, 'failed-delivery', { notes });
}

export async function receivePaymentFromDeliveryman(
  orderId: string,
  notes?: string,
): Promise<ActionResult> {
  return patchWorkflow(orderId, 'receive-payment', { notes });
}

export async function getOrderWorkflow(orderId: string): Promise<any[]> {
  try {
    const accessToken = await getSessionToken();
    const res = await fetchServiceJsonServer<ApiAny>(`/admin/orders/${orderId}/workflow`, {
      accessToken,
      cache: 'no-store',
    });
    return unwrapList(res, 'logs');
  } catch (error) {
    console.error('Error fetching order workflow logs:', error);
    return [];
  }
}
