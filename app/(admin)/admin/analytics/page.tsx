'use client';

import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminPremiumFeature from '@/components/admin/AdminPremiumFeature';
import { useUserData } from '@/contexts/UserDataContext';

const AdminAnalyticsPage = () => {
  const { authUser: user, isLoading } = useUserData();
  const hasPremium = user?.memberShipType === 'active' || user?.isActive === true;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop_dark_green"></div>
      </div>
    );
  }

  if (!hasPremium) {
    return (
      <AdminPremiumFeature
        featureName="Advanced Analytics"
        description="Get detailed insights into your store performance, customer behavior, sales trends, and more with our comprehensive analytics dashboard."
      />
    );
  }

  return <AdminAnalytics />;
};

export default AdminAnalyticsPage;
