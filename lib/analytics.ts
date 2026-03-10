import { fetchService } from '@/lib/restClient';

type AnalyticsParams = Record<string, string | number | boolean | undefined | unknown[]>;

export type AddToCartParams = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  userId?: string;
};

export type RemoveFromCartParams = AddToCartParams;

export type OrderPlacedParams = {
  orderId: string;
  amount: number;
  status: string;
  userId?: string;
};

export type OrderStatusUpdateParams = {
  orderId: string;
  status: string;
  userId?: string;
};

export type UserRegistrationParams = {
  userId: string;
  email: string;
};

export type UserLoginParams = UserRegistrationParams;

export type ProductViewParams = {
  productId: string;
  name: string;
  userId?: string;
};

const queue: Array<{ eventName: string; eventParams: AnalyticsParams }> = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const enqueue = (eventName: string, eventParams: AnalyticsParams) => {
  queue.push({ eventName, eventParams });
  if (flushTimer) return;
  flushTimer = setTimeout(async () => {
    const batch = queue.splice(0, queue.length);
    flushTimer = null;
    for (const item of batch) {
      try {
        await fetchService('/analytics/track', {
          method: 'POST',
          body: JSON.stringify({
            eventName: item.eventName,
            eventParams: item.eventParams,
          }),
        });
      } catch {
        // ignore tracking failures
      }
    }
  }, 500);
};

// Helper to safely track events via REST (client only)
export function trackEvent(eventName: string, eventParams: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'production') return;

  enqueue(eventName, eventParams);
}

// E-commerce specific events
export function trackAddToCart(params: AddToCartParams) {
  trackEvent('add_to_cart', params);
}

export function trackRemoveFromCart(params: RemoveFromCartParams) {
  trackEvent('remove_from_cart', params);
}

export function trackOrderPlaced(params: OrderPlacedParams) {
  trackEvent('order_placed', params);
}

export function trackOrderStatusUpdate(params: OrderStatusUpdateParams) {
  trackEvent('order_status_update', params);
}

export function trackUserRegistration(params: UserRegistrationParams) {
  trackEvent('user_registration', params);
}

export function trackUserLogin(params: UserLoginParams) {
  trackEvent('user_login', params);
}

export function trackProductView(params: ProductViewParams) {
  trackEvent('view_product', params);
}

// Additional e-commerce tracking functions
export function trackCartView(userId?: string) {
  trackEvent('view_cart', { userId });
}

export function trackCheckoutStarted(params: {
  userId?: string;
  cartValue: number;
  itemCount: number;
}) {
  trackEvent('begin_checkout', params);
}

export function trackSearchPerformed(params: {
  searchTerm: string;
  userId?: string;
  resultCount?: number;
}) {
  trackEvent('search', params);
}

export function trackCategoryView(params: {
  categoryId: string;
  categoryName: string;
  userId?: string;
}) {
  trackEvent('view_category', params);
}

export function trackWishlistAdd(params: { productId: string; name: string; userId?: string }) {
  trackEvent('add_to_wishlist', params);
}

export function trackWishlistRemove(params: { productId: string; name: string; userId?: string }) {
  trackEvent('remove_from_wishlist', params);
}

export function trackPageView(params: { pagePath: string; pageTitle?: string; userId?: string }) {
  trackEvent('page_view', params);
}

// Advanced e-commerce tracking
export function trackPurchase(params: {
  orderId: string;
  value: number;
  currency?: string;
  items: Array<{
    productId: string;
    name: string;
    category?: string;
    quantity: number;
    price: number;
  }>;
  userId?: string;
}) {
  trackEvent('purchase', params);
}

export function trackBestSellingProducts(params: {
  products: Array<{
    productId: string;
    name: string;
    category?: string;
    salesCount: number;
    revenue: number;
  }>;
  timeframe: string;
}) {
  trackEvent('best_selling_products', params);
}

export function trackOrderDetails(params: {
  orderId: string;
  orderNumber: string;
  status: string;
  value: number;
  itemCount: number;
  paymentMethod: string;
  shippingMethod?: string;
  userId?: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}) {
  trackEvent('order_details', params);
}

export function trackOrderFullfillment(params: {
  orderId: string;
  status: string;
  previousStatus: string;
  value: number;
  fulfillmentTime?: number;
  userId?: string;
}) {
  trackEvent('order_fulfillment', params);
}

export function trackInventoryAction(params: {
  productId: string;
  name: string;
  action: 'restock' | 'low_stock' | 'out_of_stock';
  currentStock: number;
  previousStock?: number;
}) {
  trackEvent('inventory_action', params);
}

export function trackCustomerLifetime(
  userId: string,
  totalSpent: number,
  orderCount: number,
  avgOrderValue: number,
) {
  trackEvent('customer_lifetime_value', {
    user_id: userId,
    total_spent: totalSpent,
    order_count: orderCount,
    average_order_value: avgOrderValue,
    ltv_segment: totalSpent > 1000 ? 'high_value' : totalSpent > 500 ? 'medium_value' : 'low_value',
    timestamp: new Date().toISOString(),
  });
}

export function trackProductSearch(
  searchTerm: string,
  resultsCount: number,
  category?: string,
  filters?: Record<string, string | number | boolean>,
) {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    category: category || 'all',
    filters: JSON.stringify(filters || {}),
    timestamp: new Date().toISOString(),
  });
}

export function trackCategoryViewEnhanced(
  categoryName: string,
  categoryId: string,
  productCount: number,
) {
  trackEvent('view_item_list', {
    item_list_id: categoryId,
    item_list_name: categoryName,
    items_count: productCount,
    list_type: 'category',
    timestamp: new Date().toISOString(),
  });
}

export function trackUserRegistrationEnhanced(
  userId: string,
  registrationMethod: 'email' | 'google' | 'facebook' | 'other',
) {
  trackEvent('sign_up', {
    method: registrationMethod,
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}

export function trackUserLoginEnhanced(
  userId: string,
  loginMethod: 'email' | 'google' | 'facebook' | 'other',
) {
  trackEvent('login', {
    method: loginMethod,
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}
