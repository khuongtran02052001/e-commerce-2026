'use client';

import AdminPremiumFeature from '@/components/admin/AdminPremiumFeature';
import AdminSubscriptions from '@/components/admin/AdminSubscriptions';
import { useUserData } from '@/contexts/UserDataContext';

export default function SubscriptionsClientPage() {
  const { authUser: user, isLoading } = useUserData();
  const hasPremium = user?.memberShipType === 'active' || user?.isActive === true;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop_dark_green"></div>
      </div>
    );
  }

  if (hasPremium) {
    return <AdminSubscriptions />;
  }

  return (
    <AdminPremiumFeature
      featureName="Subscription Management"
      description="Manage newsletter subscriptions, segment your audience, and send targeted campaigns with our premium subscription management tools."
    />
  );
}
