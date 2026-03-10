'use server';

import { isAdmin } from '@/lib/adminUtils';
import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';

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
    accessToken: session.accessToken,
  };
}

/* ============================================================
   Admin: Get all withdrawal requests
============================================================ */

export async function getAllWithdrawalRequests() {
  try {
    const { error, admin, accessToken } = await getAdminSession();
    if (error) return { success: false, message: error };

    // Call REST API
    const res = await fetchServiceJsonServer('/withdrawals/all', {
      accessToken,
    });

    return {
      success: true,
      requests: res || [],
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
    const { error, admin, accessToken } = await getAdminSession();
    if (error) return { success: false, message: error };

    await fetchServiceJsonServer(`/withdrawals/${userId}/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({
        adminEmail: admin?.email,
        transactionId: transactionId || '',
      }),
      accessToken,
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
    const { error, admin, accessToken } = await getAdminSession();
    if (error) return { success: false, message: error };

    await fetchServiceJsonServer(`/withdrawals/${userId}/${requestId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ adminEmail: admin?.email }),
      accessToken,
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
    const { error, admin, accessToken } = await getAdminSession();
    if (error) return { success: false, message: error };

    await fetchServiceJsonServer(`/withdrawals/${userId}/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({
        adminEmail: admin?.email,
        reason,
      }),
      accessToken,
    });

    return { success: true, message: 'Withdrawal request rejected' };
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    return { success: false, message: 'Failed to reject withdrawal' };
  }
}
