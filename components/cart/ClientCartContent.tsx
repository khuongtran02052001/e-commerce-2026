'use client';

import { useUserData } from '@/contexts/UserDataContext';
import { trackCartView } from '@/lib/analytics';
import { fetchService } from '@/lib/restClient';
import { useCallback, useEffect, useState } from 'react';
import { CartSkeleton } from './CartSkeleton';
import { ServerCartContent } from './ServerCartContent';

interface Address {
  id: string;
  name: string;
  email: string;
  address: string;
  addressName: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: string;
}

interface UserOrder {
  id: string;
  orderNumber: string;
  totalPrice: number;
  currency: string;
  status: string;
  orderDate: string;
  customerName: string;
  email: string;
}

interface UserData {
  addresses: Address[];
  orders: UserOrder[];
}

export function ClientCartContent() {
  const { authReady, isAuthenticated, currentUser: user } = useUserData();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    const userEmail = user?.email;
    if (!userEmail) {
      setError('Email not found. Please contact support.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch user data from API endpoint
      const response = await fetchService(`/user-data?email=${encodeURIComponent(userEmail)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const payload = await response.json();
      const data = payload?.data ?? payload;
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshAddresses = async () => {
    if (!user) return;

    const userEmail = user.email;
    if (!userEmail) return;

    try {
      // Only fetch addresses to refresh them
      const response = await fetchService(`/user-data?email=${encodeURIComponent(userEmail)}`);

      if (!response.ok) {
        throw new Error('Failed to refresh addresses');
      }

      const payload = await response.json();
      const data = payload?.data ?? payload;
      setUserData((prev) =>
        prev ? { ...prev, addresses: Array.isArray(data?.addresses) ? data.addresses : [] } : data,
      );
    } catch (err) {
      console.error('Failed to refresh addresses:', err);
      // Don't show error toast for refresh failures
    }
  };

  useEffect(() => {
    if (!authReady) return;

    if (!isAuthenticated || !user) {
      setLoading(false);
      setUserData(null);
      return;
    }

    fetchUserData();

    // Track cart view
    trackCartView(user.email || user.id);
  }, [authReady, isAuthenticated, user, fetchUserData]);

  if (loading) {
    return <CartSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Please sign in to view your cart.</p>
      </div>
    );
  }
  const userEmail = user.email!;

  return (
    <ServerCartContent
      userEmail={userEmail}
      userAddresses={userData?.addresses || []}
      userOrders={userData?.orders || []}
      onAddressesRefresh={refreshAddresses}
    />
  );
}
