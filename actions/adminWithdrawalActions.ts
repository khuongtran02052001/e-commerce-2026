'use server';

import { isAdmin } from '@/lib/adminUtils';
import { auth } from '@/lib/auth';
import axiosClient from '@/lib/axiosClient';

/* ============================================================
   Helper: Get and validate admin
============================================================ */

async function getAdminSession() {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: 'Unauthorized', admin: null };
  }

  // Check admin using your isAdmin util
  if (!isAdmin({ email: session.user.email })) {
    return { error: 'Admin access required', admin: null };
  }

  return {
    error: null,
    admin: session.user, // { id, name, email }
  };
}

/* ============================================================
   Admin: Get all withdrawal requests
============================================================ */

export async function getAllWithdrawalRequests() {
  try {
    const { error, admin } = await getAdminSession();
    if (error) return { success: false, message: error };

    // Call REST API
    const res = await axiosClient.get('/withdrawals/all');

    return {
      success: true,
      requests: res.data || [],
    };
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    return { success: false, message: 'Failed to fetch withdrawal requests' };
  }
}

/* ============================================================
   Admin: Approve withdrawal
============================================================ */

export async function approveWithdrawal(userId: string, requestId: string, transactionId?: string) {
  try {
    const { error, admin } = await getAdminSession();
    if (error) return { success: false, message: error };

    await axiosClient.post(`/withdrawals/${userId}/${requestId}/approve`, {
      adminEmail: admin?.email,
      transactionId: transactionId || '',
    });

    return { success: true, message: 'Withdrawal approved and processing' };
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    return { success: false, message: 'Failed to approve withdrawal' };
  }
}

/* ============================================================
   Admin: Complete withdrawal
============================================================ */

export async function completeWithdrawal(userId: string, requestId: string) {
  try {
    const { error, admin } = await getAdminSession();
    if (error) return { success: false, message: error };

    await axiosClient.post(`/withdrawals/${userId}/${requestId}/complete`, {
      adminEmail: admin?.email,
    });

    return { success: true, message: 'Withdrawal marked as completed' };
  } catch (error) {
    console.error('Error completing withdrawal:', error);
    return { success: false, message: 'Failed to complete withdrawal' };
  }
}

/* ============================================================
   Admin: Reject withdrawal
============================================================ */

export async function rejectWithdrawal(userId: string, requestId: string, reason: string) {
  try {
    const { error, admin } = await getAdminSession();
    if (error) return { success: false, message: error };

    await axiosClient.post(`/withdrawals/${userId}/${requestId}/reject`, {
      adminEmail: admin?.email,
      reason,
    });

    return { success: true, message: 'Withdrawal request rejected' };
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    return { success: false, message: 'Failed to reject withdrawal' };
  }
}
