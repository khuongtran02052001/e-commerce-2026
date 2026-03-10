'use server';

import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';
import { v4 as uuid } from 'uuid';

interface WalletUser {
  walletBalance?: number;
  walletTransactions?: unknown[];
}

/* ============================================================
   GET USER WALLET BALANCE
============================================================ */
export async function getUserWalletBalance() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) return { success: false, message: 'Unauthorized' };

    const user = await fetchServiceJsonServer<WalletUser>(`/users/by-email/${email}`, {
      accessToken: session?.accessToken,
    });

    return { success: true, balance: user.walletBalance ?? 0 };
  } catch (err) {
    console.error('getUserWalletBalance error:', err);
    return { success: false, message: 'Failed to load wallet' };
  }
}

/* ============================================================
   GET WALLET TRANSACTION HISTORY
============================================================ */
export async function getWalletTransactions() {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) return { success: false, message: 'Unauthorized' };

    const res = await fetchServiceJsonServer<unknown[]>(`/wallet/transactions/${email}`, {
      accessToken: session?.accessToken,
    });

    return { success: true, transactions: res ?? [] };
  } catch (err) {
    console.error('getWalletTransactions error:', err);
    return { success: false, message: 'Failed to load wallet history' };
  }
}

/* ============================================================
   ADD CREDIT TO WALLET  (refund order)
============================================================ */
export async function addWalletCredit(
  userEmail: string,
  amount: number,
  description: string,
  orderId?: string,
  processedBy?: string,
) {
  try {
    const user = await fetchServiceJsonServer<WalletUser>(`/users/by-email/${userEmail}`);

    if (!user) return { success: false, message: 'User not found' };

    const currentBalance = user.walletBalance ?? 0;
    const newBalance = currentBalance + amount;

    const transaction = {
      id: uuid(),
      type: 'credit_refund',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description,
      orderId,
      processedBy,
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    await fetchServiceJsonServer(`/wallet/update/${userEmail}`, {
      method: 'PUT',
      body: JSON.stringify({
        walletBalance: newBalance,
        walletTransactions: [transaction, ...(user.walletTransactions ?? [])],
      }),
    });

    return { success: true, message: 'Credit added', newBalance };
  } catch (err) {
    console.error('addWalletCredit error:', err);
    return { success: false, message: 'Failed to add credit' };
  }
}

/* ============================================================
   DEDUCT WALLET BALANCE  (checkout)
============================================================ */
export async function deductWalletBalance(amount: number, orderId: string) {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) return { success: false, message: 'Unauthorized' };

    const user = await fetchServiceJsonServer<WalletUser>(`/users/by-email/${email}`, {
      accessToken: session?.accessToken,
    });

    const currentBalance = user.walletBalance ?? 0;
    if (currentBalance < amount) return { success: false, message: 'Insufficient wallet balance' };

    const newBalance = currentBalance - amount;

    const transaction = {
      id: uuid(),
      type: 'debit_order',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: `Payment for order #${orderId}`,
      orderId,
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    await fetchServiceJsonServer(`/wallet/update/${email}`, {
      method: 'PUT',
      body: JSON.stringify({
        walletBalance: newBalance,
        walletTransactions: [transaction, ...(user.walletTransactions ?? [])],
      }),
      accessToken: session?.accessToken,
    });

    return { success: true, newBalance, message: 'Deducted successfully' };
  } catch (err) {
    console.error('deductWalletBalance error:', err);
    return { success: false, message: 'Failed to deduct' };
  }
}

/* ============================================================
   USER: REQUEST WITHDRAWAL
============================================================ */
export async function requestWithdrawal(data: {
  amount: number;
  method: 'bank' | 'paypal' | 'stripe' | 'check';
  bankDetails?: any;
  paypalEmail?: string;
}) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return { success: false, message: 'Unauthorized' };

    if (data.amount < 10) return { success: false, message: 'Minimum withdrawal is $10' };

    const user = await fetchServiceJsonServer<WalletUser>(`/users/by-email/${email}`, {
      accessToken: session?.accessToken,
    });

    const currentBalance = user.walletBalance ?? 0;
    if (currentBalance < data.amount)
      return {
        success: false,
        message: `Insufficient balance: $${currentBalance.toFixed(2)}`,
      };

    const newRequest = {
      id: uuid(),
      amount: data.amount,
      method: data.method,
      bankDetails: data.bankDetails,
      paypalEmail: data.paypalEmail,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    await fetchServiceJsonServer(`/wallet/withdrawal/${email}`, {
      method: 'POST',
      body: JSON.stringify(newRequest),
      accessToken: session?.accessToken,
    });

    return { success: true, requestId: newRequest.id };
  } catch (err) {
    console.error('requestWithdrawal error:', err);
    return { success: false, message: 'Failed to request withdrawal' };
  }
}

/* ============================================================
   USER: GET WITHDRAWAL REQUESTS
============================================================ */
export async function getWithdrawalRequests() {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return { success: false, message: 'Unauthorized' };

    const res = await fetchServiceJsonServer(`/wallet/withdrawal/${email}`, {
      accessToken: session?.accessToken,
    });
    return { success: true, requests: res ?? [] };
  } catch (err) {
    console.error('getWithdrawalRequests error:', err);
    return { success: false, message: 'Failed to load withdrawals' };
  }
}

/* ============================================================
   USER: CANCEL WITHDRAWAL REQUEST
============================================================ */
export async function cancelWithdrawalRequest(requestId: string) {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return { success: false, message: 'Unauthorized' };

    await fetchServiceJsonServer(`/wallet/withdrawal/cancel/${email}`, {
      method: 'PUT',
      body: JSON.stringify({ requestId }),
      accessToken: session?.accessToken,
    });

    return { success: true, message: 'Withdrawal request cancelled' };
  } catch (err) {
    console.error('cancelWithdrawalRequest error:', err);
    return { success: false, message: 'Failed to cancel withdrawal' };
  }
}
