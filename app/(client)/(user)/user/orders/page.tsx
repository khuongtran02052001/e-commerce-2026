import OrdersClient from '@/components/OrdersClient';
import Title from '@/components/Title';
import { auth } from '@/lib/auth';
import { fetchServiceJsonServer } from '@/lib/restClient';
import { UserOrder } from '@/types/domain/order';
import { redirect } from 'next/navigation';

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

async function UserOrdersPage({ searchParams }: OrdersPageProps) {
  const session = await auth();
  const sessionUser = session?.user;
  const accessToken = session?.accessToken;

  if (!sessionUser) {
    redirect('/sign-in');
  }

  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const ordersPerPage = 20;

  const query = new URLSearchParams({
    page: String(currentPage),
    limit: String(ordersPerPage),
  }).toString();

  const response = accessToken
    ? await fetchServiceJsonServer<
        | {
            orders?: UserOrder[];
            totalCount?: number;
            totalPages?: number;
            hasNextPage?: boolean;
            hasPrevPage?: boolean;
          }
        | UserOrder[]
      >(`/user/orders?${query}`, { accessToken }).catch(() => [] as UserOrder[])
    : ([] as UserOrder[]);

  const rawOrders = Array.isArray(response) ? response : response?.orders || [];
  const orders = rawOrders.map((order) => ({
    ...order,
    id: order.id,
  }));
  const totalCount = Array.isArray(response)
    ? orders.length
    : (response?.totalCount ?? orders.length);
  const totalPages = Array.isArray(response)
    ? Math.max(1, Math.ceil(totalCount / ordersPerPage))
    : (response?.totalPages ?? Math.max(1, Math.ceil(totalCount / ordersPerPage)));
  const hasNextPage = Array.isArray(response)
    ? currentPage < totalPages
    : (response?.hasNextPage ?? currentPage < totalPages);
  const hasPrevPage = Array.isArray(response)
    ? currentPage > 1
    : (response?.hasPrevPage ?? currentPage > 1);

  return (
    <div className="space-y-6">
      <div>
        <Title>My Orders</Title>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing {orders.length} of {totalCount} orders
          </p>
        )}
      </div>

      <OrdersClient
        initialOrders={orders}
        totalPages={totalPages}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}

export default UserOrdersPage;
