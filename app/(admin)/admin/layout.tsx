'use client';

import AdminTopNavigation from '@/components/admin/AdminTopNavigation';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useUserData } from '@/contexts/UserDataContext';
import { isAdmin } from '@/lib/adminUtils';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { data: session, status } = useSession();
  const { authUser: user, isLoading: isUserLoading } = useUserData();
  const router = useRouter();
  const pathname = usePathname();
  const isAdminUser = isAdmin(user);
  const isAdminBySessionEmail = isAdmin({ email: session?.user?.email ?? undefined });
  const hasAdminAccess = isAdminUser || isAdminBySessionEmail;

  // Redirect non-admin users
  useEffect(() => {
    if (status === 'authenticated' && !isUserLoading && !hasAdminAccess) {
      router.push('/403');
    }
  }, [hasAdminAccess, isUserLoading, router, status]);

  // Show loading while checking authentication
  if (status === 'loading' || isUserLoading) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shop_dark_green"></div>
        </div>
      </Container>
    );
  }

  // If not admin, don't render anything (redirect will happen)
  if (status === 'authenticated' && !hasAdminAccess) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Container className="py-6">
        <div className="flex flex-col gap-6">
          {/* Top Navigation */}
          <AdminTopNavigation currentPath={pathname} user={user} />

          {/* Main Content */}
          <div className="admin-content-push bg-white rounded-2xl shadow-xl border border-shop_light_green/10 overflow-hidden">
            {children}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminLayout;
