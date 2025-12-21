import { auth } from '@/lib/auth';
import axiosClient from '@/lib/axiosClient';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const userRes = await axiosClient.get(`/auth/me`);
    // axiosClient.get(`/orders/count`, { params: { email } }),
    // axiosClient.get(`/notifications/unread`, { params: { userId, limit: 20 } }),

    const user = userRes.data || null;
    // const ordersCount = ordersRes.data?.count || 0;
    const unreadNotifications = 0;
    console.log(user);
    return NextResponse.json(
      {
        user,
        // ordersCount,
        isEmployee: user?.isEmployee || false,
        unreadNotifications,
        walletBalance: user?.walletBalance || 0,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
        },
      },
    );
  } catch (error: any) {
    console.error('Error fetching combined user data:', error?.response?.data || error);

    return NextResponse.json(
      {
        user: null,
        ordersCount: 0,
        isEmployee: false,
        unreadNotifications: 0,
        walletBalance: 0,
      },
      { status: 200 },
    );
  }
}
