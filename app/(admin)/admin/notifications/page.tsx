'use client';

import AdminNotifications from '@/components/admin/AdminNotifications';
import { useUserData } from '@/contexts/UserDataContext';

const AdminNotificationsPage = () => {
  const { authUser: user } = useUserData();

  return <AdminNotifications adminEmail={user?.email ?? ''} />;
};

export default AdminNotificationsPage;
