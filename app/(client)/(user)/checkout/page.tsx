import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { OrderCheckoutContent } from '@/components/checkout/OrderCheckoutContent';
import Container from '@/components/Container';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import { getOrderById } from '@/data/server';
import { auth } from '@/lib/auth';
import { ShoppingBag } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Props {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (orderId) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      notFound();
    }

    const order = await getOrderById(orderId);
    if (!order || order.userId !== userId) {
      notFound();
    }

    return (
      <Container className="py-6">
        {/* Breadcrumb with custom items for payment flow */}
        <DynamicBreadcrumb
          customItems={[
            { label: 'Home', href: '/' },
            { label: 'Orders', href: '/orders' },
            { label: 'Payment' },
          ]}
          className="mb-6"
        />

        {/* Checkout Header */}
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Complete Payment</h1>
        </div>

        {/* Order Checkout Content */}
        <OrderCheckoutContent order={order as any} />
      </Container>
    );
  }

  // Regular checkout flow
  return (
    <Container className="py-6">
      {/* Breadcrumb with parent context showing "Home > Dashboard > Cart > Checkout" */}
      <DynamicBreadcrumb
        customItems={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/user' },
          { label: 'Cart', href: '/cart' },
          { label: 'Checkout' },
        ]}
        className="mb-6"
      />

      {/* Checkout Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Checkout Content */}
      <CheckoutContent />
    </Container>
  );
}
