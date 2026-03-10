import { fetchServiceJson } from '@/lib/restClient';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
  productsChange: number;
}

export interface AccountRequestsSummary {
  pendingPremiumCount: number;
  pendingBusinessCount: number;
  totalPendingRequests: number;
  recentRequests: number;
}

export interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
    trend: number[];
  };
  orders: {
    total: number;
    change: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  customers: {
    total: number;
    change: number;
    active: number;
    new: number;
  };
  products: {
    total: number;
    change: number;
    lowStock: number;
    outOfStock: number;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    action: string;
    time: string;
    value: string;
  }>;
}

export const getAdminStats = () => fetchServiceJson<DashboardStats>('/admin/stats');

export const getAdminAccountRequestsSummary = () =>
  fetchServiceJson<AccountRequestsSummary>('/admin/account-requests-summary');

export const getAdminAnalytics = (period = '30d') =>
  fetchServiceJson<AnalyticsData>(`/admin/analytics?period=${period}`);
