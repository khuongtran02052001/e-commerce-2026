'use client';

import AdminPremiumFeature from '@/components/admin/AdminPremiumFeature';
import AdminReviews from '@/components/admin/AdminReviews';
import { useUserData } from '@/contexts/UserDataContext';

const AdminReviewsPage = () => {
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
        featureName="Review Management"
        description="Manage customer reviews, moderate content, and gain valuable insights from customer feedback with our premium review management system."
      />
    );
  }

  return <AdminReviews />;
};

export default AdminReviewsPage;
