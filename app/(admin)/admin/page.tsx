'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminPremiumFeature from '@/components/admin/AdminPremiumFeature';
import { useUserData } from '@/contexts/UserDataContext';

const AdminPage = () => {
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
        featureName="Admin Dashboard"
        description="Unlock powerful analytics, insights, and management tools with the premium version of ShopCart Pro."
      />
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;
