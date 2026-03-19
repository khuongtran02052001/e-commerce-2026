import OrderDetailsPage from '@/components/OrderDetailsPage';
import { getOrderById } from '@/data/server';
import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';
import type { Order } from '@/types/domain/order';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    return {
      title: 'Order Details - Shopcart',
    };
  }

  const order = await getOrderById(id, accessToken).catch(() => null);
  if (!order) {
    return {
      title: 'Order Not Found',
    };
  }

  return {
    title: `Order ${order.orderNumber} - Shopcart`,
    description: `Order details for ${order.customerName}`,
  };
}

export default async function OrderDetailsPageRoute({ params }: Props) {
  const session = await auth();
  const { id } = await params;
  const sessionUser = session?.user;
  const accessToken = session?.accessToken;

  if (!sessionUser || !accessToken) {
    redirect('/sign-in');
  }

  const [order, profile] = await Promise.all([
    getOrderById(id, accessToken),
    accessToken
      ? fetchServiceJsonServer<{
          id?: string;
          email?: string;
        }>('/auth/me', { accessToken }).catch(() => null)
      : Promise.resolve(null),
  ]);
  console.log(order);
  if (!order) {
    notFound();
  }

  // Security check: ensure user can only view their own orders
  const profileId = profile?.id;
  const profileEmail = profile?.email || sessionUser.email;
  const matchesUser =
    (order.userId && profileId && order.userId === profileId) ||
    (order.email && profileEmail && order.email === profileEmail);

  if (!matchesUser) {
    notFound();
  }

  const normalizedOrder: Order = {
    ...order,
    id: order.id,
    orderDate: order.orderDate || String(order.createdAt || ''),
    addressLine:
      order.addressLine ||
      (typeof (order as { address?: unknown }).address === 'string'
        ? ((order as { address?: string }).address ?? null)
        : null),
    address:
      typeof (order as { address?: unknown }).address === 'object'
        ? (order as { address?: Order['address'] }).address
        : {
            name: order.addressName || order.customerName,
            address:
              order.addressLine ||
              (typeof (order as { address?: unknown }).address === 'string'
                ? ((order as { address?: string }).address ?? undefined)
                : undefined),
            city: order.city || undefined,
            state: order.state || undefined,
            zip: order.zip || undefined,
          },
  };

  return (
    <div className="w-full">
      <OrderDetailsPage order={normalizedOrder} />
    </div>
  );
}
