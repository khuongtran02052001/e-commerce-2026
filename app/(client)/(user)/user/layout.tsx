'use client';

import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { isAdmin as isAdminUser } from '@/lib/adminUtils';
import { useUserData } from '@/contexts/UserDataContext';
import { cn } from '@/lib/utils';
import {
  Bell,
  Building2,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Shield,
  User,
  Users,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/user/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & stats',
  },
  {
    title: 'Orders',
    href: '/user/orders',
    icon: Package,
    description: 'Track your orders',
  },
  {
    title: 'Profile',
    href: '/user/profile',
    icon: User,
    description: 'Personal information',
  },
  {
    title: 'Notifications',
    href: '/user/notifications',
    icon: Bell,
    description: 'Updates & alerts',
  },
  {
    title: 'Wishlist',
    href: '/wishlist',
    icon: Heart,
    description: 'Saved items',
  },
  {
    title: 'Settings',
    href: '/user/settings',
    icon: Settings,
    description: 'Account preferences',
  },
];

const adminItems = [
  {
    title: 'Manage Users',
    href: '/user/admin/manage-users',
    icon: Users,
    description: 'User premium status',
  },
  {
    title: 'Premium Accounts',
    href: '/user/admin/premium-accounts',
    icon: Shield,
    description: 'Premium approvals',
  },
  {
    title: 'Business Accounts',
    href: '/user/admin/business-accounts',
    icon: Building2,
    description: 'Business approvals',
  },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authUser: profile } = useUserData();


  const displayName = profile
    ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'User'
    : 'User';
  const displayEmail = profile?.email || '';
  const avatarUrl = profile?.profileImage?.url || profile?.profileImage?.asset?.url || '';
  const isAdmin = isAdminUser(profile);

  return (
    <div className="min-h-screen py-5 bg-gradient-to-br from-shop_light_bg via-white to-shop_light_pink/20">
      <Container className="py-6">
        <div className="flex flex-col gap-6">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between rounded-xl border border-shop_light_green/15 bg-white/90 p-4 shadow-[0_18px_40px_rgba(139,76,114,0.08)] backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-shop_light_green/30"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-shop_light_pink/80">
                    <User className="h-6 w-6 text-shop_dark_green" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-dark-color">{displayName}</h2>
                  <p className="text-sm text-dark-text">User Dashboard</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Desktop Top Navigation */}
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-2xl border border-shop_light_green/15 bg-white/95 shadow-[0_24px_60px_rgba(139,76,114,0.1)]">
              {/* User Profile Header */}
              <div className="bg-gradient-to-r from-shop_dark_green via-[#9b5f88] to-shop_light_green p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/30">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-bold text-lg text-white">{displayName}</h2>
                      <p className="text-white/80 text-sm">{displayEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#ffd0e6]"></div>
                      <span className="text-white/90 text-sm">
                        {profile?.isActive === false ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                    <Button
                      onClick={() => signOut()}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 border border-white/30"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>

              {/* Horizontal Navigation */}
              <nav className="p-6">
                <div className="flex flex-wrap gap-3">
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group border',
                          isActive
                            ? 'border-shop_light_green/20 bg-linear-to-r from-shop_light_pink/85 via-white to-shop_light_pink/60 shadow-[0_12px_28px_rgba(201,124,167,0.12)]'
                            : 'border-shop_light_green/10 hover:border-shop_light_green/20 hover:bg-shop_light_pink/35',
                        )}
                      >
                        <div
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            isActive
                              ? 'bg-shop_dark_green text-white shadow-sm'
                              : 'bg-shop_light_bg text-dark-text group-hover:bg-shop_light_pink/80 group-hover:text-shop_dark_green',
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div
                            className={cn(
                              'font-medium text-sm',
                              isActive ? 'text-shop_dark_green' : 'text-dark-color',
                            )}
                          >
                            {item.title}
                          </div>
                          <div className="text-xs text-dark-text">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}


                  {isAdmin && (
                    <>
                      <div className="my-3 w-full border-t border-shop_light_green/15"></div>
                      <div className="mb-2 w-full px-2 text-xs text-dark-text">Admin Tools</div>
                      {adminItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                              'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group border',
                              isActive
                                ? 'border-shop_light_green/18 bg-linear-to-r from-[#fdeef6] via-white to-[#f8edf3] shadow-[0_12px_28px_rgba(201,124,167,0.12)]'
                                : 'border-shop_light_green/10 hover:border-shop_light_green/20 hover:bg-shop_light_pink/35',
                            )}
                          >
                            <div
                              className={cn(
                                'p-2 rounded-lg transition-colors',
                                isActive
                                  ? 'bg-shop_dark_green text-white shadow-sm'
                                  : 'bg-shop_light_bg text-dark-text group-hover:bg-shop_light_pink/80 group-hover:text-shop_dark_green',
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div
                                className={cn(
                                  'font-medium text-sm',
                                  isActive ? 'text-shop_dark_green' : 'text-dark-color',
                                )}
                              >
                                {item.title}
                              </div>
                              <div className="text-xs text-dark-text">{item.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className={cn('lg:hidden', sidebarOpen ? 'block' : 'hidden')}>
            <div className="overflow-hidden rounded-2xl border border-shop_light_green/15 bg-white/95 shadow-[0_24px_60px_rgba(139,76,114,0.1)]">
              {/* User Profile Section */}
              <div className="bg-gradient-to-r from-shop_dark_green via-[#9b5f88] to-shop_light_green p-6 text-white">
                <div className="flex items-center space-x-4">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User avatar"
                      className="w-16 h-16 rounded-full object-cover border-3 border-white/30"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/18 ring-1 ring-white/30">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-white">{displayName}</h2>
                    <p className="text-white/80 text-sm">{displayEmail}</p>
                    <div className="flex items-center mt-2">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#ffd0e6]"></div>
                      <span className="text-white/90 text-xs">
                        {profile?.isActive === false ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl transition-all duration-200 group',
                        isActive
                          ? 'border border-shop_light_green/20 bg-linear-to-r from-shop_light_pink/85 via-white to-shop_light_pink/60 shadow-[0_12px_28px_rgba(201,124,167,0.12)]'
                          : 'border border-transparent hover:bg-shop_light_pink/35',
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            isActive
                              ? 'bg-shop_dark_green text-white shadow-sm'
                              : 'bg-shop_light_bg text-dark-text group-hover:bg-shop_light_pink/80 group-hover:text-shop_dark_green',
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div
                            className={cn(
                              'font-medium',
                              isActive ? 'text-shop_dark_green' : 'text-dark-color',
                            )}
                          >
                            {item.title}
                          </div>
                          <div className="text-xs text-dark-text">{item.description}</div>
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-colors',
                          isActive ? 'text-shop_dark_green' : 'text-light-text',
                        )}
                      />
                    </Link>
                  );
                })}

                {/* Admin Section - Mobile */}
                {isAdmin && (
                  <>
                    <div className="mt-4 border-t border-shop_light_green/15 pt-4">
                      <div className="mb-3 px-4 text-xs text-dark-text">Admin Tools</div>
                      {adminItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              'flex items-center justify-between p-4 rounded-xl transition-all duration-200 group',
                              isActive
                                ? 'border border-shop_light_green/20 bg-linear-to-r from-[#fdeef6] via-white to-[#f8edf3] shadow-[0_12px_28px_rgba(201,124,167,0.12)]'
                                : 'border border-transparent hover:bg-shop_light_pink/35',
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={cn(
                                  'p-2 rounded-lg transition-colors',
                                  isActive
                                    ? 'bg-shop_dark_green text-white shadow-sm'
                                    : 'bg-shop_light_bg text-dark-text group-hover:bg-shop_light_pink/80 group-hover:text-shop_dark_green',
                                )}
                              >
                                <item.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <div
                                  className={cn(
                                    'font-medium text-sm',
                                    isActive ? 'text-shop_dark_green' : 'text-dark-color',
                                  )}
                                >
                                  {item.title}
                                </div>
                                <div className="text-xs text-dark-text">{item.description}</div>
                              </div>
                            </div>
                            <ChevronRight
                              className={cn(
                                'h-4 w-4 transition-colors',
                                isActive ? 'text-shop_dark_green' : 'text-light-text',
                              )}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </nav>

              {/* Mobile Sign Out Button */}
              <div className="border-t border-shop_light_green/12 p-4">
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="w-full justify-start text-shop_dark_green hover:bg-shop_light_pink/55 hover:text-shop_btn_dark_green"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full">
            <div className="overflow-hidden rounded-2xl border border-shop_light_green/15 bg-white/95 shadow-[0_24px_60px_rgba(139,76,114,0.1)]">
              <div className="p-6 lg:p-8">{children}</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
