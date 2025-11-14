'use client';

import { CheckoutSkeleton } from '@/components/checkout/CheckoutSkeleton';
import useCartStore from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface CheckoutGuardProps {
  children: React.ReactNode;
}

export function CheckoutGuard({ children }: CheckoutGuardProps) {
  const router = useRouter();
  const { items: cart } = useCartStore();

  useEffect(() => {
    // Check if cart is empty on mount and redirect to cart page
    if (cart !== undefined && cart.length === 0) {
      router.replace('/cart');
    }
  }, [cart, router]);

  // Show loading while cart is being checked or during redirect
  if (cart === undefined || cart.length === 0) {
    return <CheckoutSkeleton />;
  }

  return <>{children}</>;
}
