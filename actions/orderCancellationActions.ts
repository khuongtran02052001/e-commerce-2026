'use server';

import { isAdmin } from '@/lib/adminUtils';
import { auth } from '@/lib/auth';
import { getOrderById, updateOrderById } from '@/data/server/order';
import { sendOrderStatusNotification } from '@/lib/notificationService';
import { addWalletCredit } from './walletActions';

/* ============================================================================
   1. ADMIN: APPROVE CANCELLATION REQUEST
============================================================================ */
export async function approveCancellationRequest(orderId: string) {
  try {
    const session = await auth();
    const adminEmail = session?.user?.email;
    if (!adminEmail) return { success: false, message: 'Unauthorized' };

    // Check if admin
    if (!isAdmin({ email: session.user.email })) {
      return { success: false, message: 'Admin access required' };
    }

    // Fetch order from API
    const order = await getOrderById(orderId, session.accessToken);

    if (!order) return { success: false, message: 'Order not found' };
    if (!order.cancellationRequested)
      return { success: false, message: 'No cancellation request found' };
    if (order.status === 'cancelled') return { success: false, message: 'Order already cancelled' };

    // Refund amount
    const refundAmount = order.amountPaid || order.totalPrice || 0;
    const shouldRefund = order.paymentStatus === 'paid' && refundAmount > 0;

    let walletRefunded = false;

    if (shouldRefund) {
      const refundResult = await addWalletCredit(
        order.userId,
        refundAmount,
        `Refund for cancelled order #${order.orderNumber}`,
        orderId,
        adminEmail,
      );
      walletRefunded = refundResult.success;
    }

    // Update order
    await updateOrderById(
      orderId,
      {
        status: 'cancelled',
        paymentStatus: walletRefunded ? 'refunded' : 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancelledBy: adminEmail,
        refundedToWallet: walletRefunded,
        refundAmount,
        cancellationRequested: false,
      },
      session.accessToken,
    );

    // Send notification
    await sendOrderStatusNotification({
      userEmail: order.email,
      orderNumber: order.orderNumber,
      orderId,
      status: 'cancelled',
    });

    return {
      success: true,
      message: walletRefunded
        ? `Cancellation approved. $${refundAmount} refunded to wallet.`
        : 'Cancellation approved successfully.',
    };
  } catch (err) {
    console.error('approveCancellationRequest error:', err);
    return { success: false, message: 'Failed to approve cancellation request' };
  }
}

/* ============================================================================
   2. ADMIN: REJECT CANCELLATION REQUEST
============================================================================ */
export async function rejectCancellationRequest(orderId: string, rejectionReason?: string) {
  try {
    const session = await auth();
    const adminEmail = session?.user?.email;
    if (!adminEmail) return { success: false, message: 'Unauthorized' };

    if (!isAdmin({ email: session.user.email }))
      return { success: false, message: 'Admin access required' };

    // Get order
    const order = await getOrderById(orderId, session.accessToken);

    if (!order) return { success: false, message: 'Order not found' };
    if (!order.cancellationRequested) return { success: false, message: 'Request not found' };

    // Update order
    await updateOrderById(
      orderId,
      {
        cancellationRequested: false,
        status: 'confirmed',
        orderConfirmedBy: adminEmail,
        orderConfirmedAt: new Date().toISOString(),
      },
      session.accessToken,
    );

    // Notify
    await sendOrderStatusNotification({
      userEmail: order.email,
      orderId,
      orderNumber: order.orderNumber,
      status: 'confirmed',
    });

    return {
      success: true,
      message: rejectionReason
        ? `Cancellation rejected: ${rejectionReason}`
        : 'Cancellation request rejected',
    };
  } catch (err) {
    console.error('rejectCancellationRequest error:', err);
    return { success: false, message: 'Failed to reject cancellation' };
  }
}

/* ============================================================================
   3. ADMIN: CANCEL ORDER DIRECTLY
============================================================================ */
export async function cancelOrder(orderId: string, reason: string) {
  try {
    const session = await auth();
    const adminEmail = session?.user?.email;

    if (!adminEmail) return { success: false, message: 'Unauthorized' };
    if (!isAdmin({ email: session.user.email })) return { success: false, message: 'Admin only' };

    const order = await getOrderById(orderId, session.accessToken);

    if (!order) return { success: false, message: 'Order not found' };
    if (order.status === 'delivered')
      return { success: false, message: 'Delivered orders cannot be cancelled' };

    const refundAmount = order.amountPaid || order.totalPrice || 0;
    const shouldRefund = order.paymentStatus === 'paid';

    let refunded = false;

    if (shouldRefund && refundAmount > 0) {
      const refund = await addWalletCredit(
        order.userId,
        refundAmount,
        `Refund for cancelled order #${order.orderNumber}`,
        orderId,
        adminEmail,
      );
      refunded = refund.success;
    }

    await updateOrderById(
      orderId,
      {
        status: 'cancelled',
        paymentStatus: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason,
        refundAmount: refunded ? refundAmount : 0,
        refundedToWallet: refunded,
      },
      session.accessToken,
    );

    await sendOrderStatusNotification({
      userEmail: order.email,
      orderId,
      orderNumber: order.orderNumber,
      status: 'cancelled',
    });

    return {
      success: true,
      message: refunded
        ? `Order cancelled. $${refundAmount} refunded.`
        : 'Order cancelled successfully.',
    };
  } catch (err) {
    console.error('cancelOrder error:', err);
    return { success: false, message: 'Failed to cancel order' };
  }
}

/* ============================================================================
   4. USER: REQUEST CANCELLATION
============================================================================ */
export async function requestOrderCancellation(orderId: string, reason: string) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) return { success: false, message: 'Unauthorized' };

    const order = await getOrderById(orderId, session.accessToken);

    if (!order) return { success: false, message: 'Order not found' };
    if (order.status === 'delivered')
      return { success: false, message: 'Delivered orders cannot be cancelled' };

    // Send cancellation request → Admin review
    await updateOrderById(
      orderId,
      {
        cancellationRequested: true,
        cancellationRequestReason: reason,
        cancellationRequestedAt: new Date().toISOString(),
      },
      session.accessToken,
    );

    return {
      success: true,
      message: 'Cancellation request submitted for admin approval.',
    };
  } catch (err) {
    console.error('requestOrderCancellation error:', err);
    return { success: false, message: 'Failed to request cancellation' };
  }
}
