'use server';

// | Chức năng                  | API cần gọi                  |
// | -------------------------- | ---------------------------- |
// | Lấy user bằng email        | `GET /users/by-email/:email` |
// | Thêm notification cho user | `POST /notifications/:email` |
// | Lấy notifications          | `GET /notifications/:email`  |

import axiosClient from '@/lib/axiosClient';
import { v4 as uuid } from 'uuid';

export type NotificationType = 'promo' | 'order' | 'system' | 'marketing' | 'general';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

interface CreateNotificationParams {
  userEmail: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  actionUrl?: string;
  sentBy?: string;
}

interface OrderStatusNotificationParams {
  userEmail: string;
  orderNumber: string;
  orderId: string;
  status: string;
  previousStatus?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const {
      userEmail,
      title,
      message,
      type,
      priority = 'medium',
      actionUrl,
      sentBy = 'System',
    } = params;

    // Generate notification object
    const notification = {
      id: uuid(),
      title,
      message,
      type,
      read: false,
      priority,
      sentAt: new Date().toISOString(),
      sentBy,
      ...(actionUrl && { actionUrl }),
    };

    // POST to your backend
    await axiosClient.post(`/notifications/${userEmail}`, notification);

    return { success: true, notification };
  } catch (err) {
    console.error('Error creating notification:', err);
    return { success: false, error: 'Failed to create notification' };
  }
}

const getOrderStatusMessage = (
  status: string,
  orderNumber: string,
  previousStatus?: string,
): { title: string; message: string; priority: NotificationPriority } => {
  switch (status.toLowerCase()) {
    case 'pending':
      return {
        title: 'Order Received',
        message: `Your order #${orderNumber} has been received.`,
        priority: 'medium',
      };
    case 'paid':
      return {
        title: 'Payment Confirmed',
        message: `Order #${orderNumber} payment successful.`,
        priority: 'high',
      };
    case 'shipped':
      return {
        title: 'Order Shipped',
        message: `Order #${orderNumber} is on the way.`,
        priority: 'high',
      };
    case 'delivered':
      return {
        title: 'Order Delivered',
        message: `Order #${orderNumber} has been delivered.`,
        priority: 'high',
      };
    case 'cancelled':
      return {
        title: 'Order Cancelled',
        message: `Order #${orderNumber} has been cancelled.`,
        priority: 'urgent',
      };
    default:
      return {
        title: 'Order Update',
        message: `Your order #${orderNumber} is updated: ${status}`,
        priority: 'medium',
      };
  }
};

export async function sendOrderStatusNotification(params: OrderStatusNotificationParams) {
  try {
    const { userEmail, orderNumber, orderId, status, previousStatus } = params;

    const { title, message, priority } = getOrderStatusMessage(status, orderNumber, previousStatus);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const actionUrl = `${baseUrl}/user/orders/${orderId}`;

    return await createNotification({
      userEmail,
      title,
      message,
      type: 'order',
      priority,
      actionUrl,
      sentBy: 'ShopCart System',
    });
  } catch (err) {
    console.error('Error sending order status notification:', err);
    return { success: false, error: 'Failed to send notification' };
  }
}

export async function sendBulkNotifications(
  emails: string[],
  data: Omit<CreateNotificationParams, 'userEmail'>,
) {
  try {
    const results = await Promise.allSettled(
      emails.map((email) =>
        createNotification({
          userEmail: email,
          ...data,
        }),
      ),
    );

    return {
      success: true,
      total: emails.length,
      successful: results.filter((r) => r.status === 'fulfilled').length,
      failed: results.filter((r) => r.status === 'rejected').length,
    };
  } catch (err) {
    console.error('Bulk notification error:', err);
    return { success: false, error: 'Bulk notification failed' };
  }
}
