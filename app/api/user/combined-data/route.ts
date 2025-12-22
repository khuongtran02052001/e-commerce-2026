import { auth } from '@/lib/auth';
import axiosClient from '@/lib/axiosClient';
import { User } from '@/types/common-type';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRes = await axiosClient.get<User>(`/auth/me`);

    const user = userRes.data || null;
    return NextResponse.json(
      {
        user,
        ordersCount: user.orders.length || 0,
        isEmployee: user?.isEmployee || false,
        unreadNotifications: user.notifications.length || 0,
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
