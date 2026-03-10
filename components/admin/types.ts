// Backward-compatibility layer for admin components.
// Prefer importing from `@/types/domain/admin` and `@/types/domain/order`.
export type { AdminAnalytics as Analytics, ChartDataPoint, AdminProduct as Product, AdminUser as User } from '@/types/domain/admin';
export type { Order } from '@/types/domain/order';

