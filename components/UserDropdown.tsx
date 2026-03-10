'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUserData } from '@/contexts/UserDataContext';
import { isAdmin as isAdminUser } from '@/lib/adminUtils';
import { formatCompactUSD, formatCurrency } from '@/lib/formatCurrency';
import {
  Briefcase,
  Crown,
  Heart,
  LogOut,
  Logs,
  Package,
  Settings,
  Shield,
  User,
  UserCircle,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

const UserDropdown = () => {
  const [open, setOpen] = useState(false);

  const {
    currentUser: user,
    authUser,
    isEmployee,
    ordersCount,
    walletBalance,
    isLoading: isLoadingOrders,
    doLogoutLocal,
  } = useUserData();

  const isAdmin = isAdminUser(authUser);
  const isEmployeeUser = Boolean(isEmployee || authUser?.isEmployee || authUser?.employeeRole);

  const handleSignOut = async () => {
    setOpen(false);
    doLogoutLocal();
    await signOut({ callbackUrl: '/' });
  };

  const handleLinkClick = () => setOpen(false);
  const [mounted, setMounted] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  useEffect(() => setMounted(true), []);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-shop_light_bg group border border-shop_dark_green/20 hover:border-shop_dark_green hoverEffect">
          <div className="relative">
            {mounted && user?.image && !avatarError ? (
              <img
                src={user.image}
                alt={user.name || 'Username'}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  setAvatarError(true);
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <UserCircle className="w-8 h-8 text-gray-500 group-hover:text-shop_light_green transition-colors" />
            )}

            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
          </div>

          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-800 group-hover:text-shop_light_green transition-colors">
              {user?.name || 'Username'}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="end" sideOffset={5}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {user?.image && !avatarError ? (
              <img
                src={user?.image}
                alt={user?.name || 'User'}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  setAvatarError(true);
                  e.currentTarget.onerror = null;
                }}
              />
            ) : (
              <UserCircle className="w-12 h-12 text-gray-500" />
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{user?.name || 'Username'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="p-2">
          {/* Wallet */}
          {walletBalance > 0 && (
            <div className="mb-2 mx-2 p-3 rounded-lg bg-linear-to-r from-shop_light_green/10 to-shop_dark_green/10 border border-shop_light_green/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-shop_dark_green" />
                  <span className="text-sm font-medium text-gray-700">Wallet Balance</span>
                </div>
                <p
                  title={formatCurrency(walletBalance)}
                  className="text-lg font-bold text-shop_dark_green"
                >
                  {formatCompactUSD(walletBalance)}
                </p>
              </div>
            </div>
          )}

          {/* Profile */}
          <Link
            href="/user/profile"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-shop_light_bg transition-colors duration-200 group"
          >
            <User className="w-4 h-4 text-gray-500 group-hover:text-shop_light_green" />
            <span className="text-gray-800 group-hover:text-shop_light_green">My Profile</span>
          </Link>

          {/* Orders */}
          <Link
            href="/user/orders"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-shop_light_bg transition-colors duration-200 group"
          >
            <Package className="w-4 h-4 text-gray-500 group-hover:text-shop_light_green" />
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-800 group-hover:text-shop_light_green">My Orders</span>
              {isLoadingOrders ? (
                <div className="w-4 h-4 border-2 border-shop_btn_dark_green border-t-transparent rounded-full animate-spin"></div>
              ) : (
                ordersCount > 0 && (
                  <span className="bg-shop_btn_dark_green text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {ordersCount}
                  </span>
                )
              )}
            </div>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-shop_light_bg transition-colors duration-200 group"
          >
            <Heart className="w-4 h-4 text-gray-500 group-hover:text-shop_light_green" />
            <span className="text-gray-800 group-hover:text-shop_light_green">Wishlist</span>
          </Link>

          {/* Dashboard */}
          <Link
            href="/user"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-shop_light_bg transition-colors duration-200 group"
          >
            <Logs className="w-4 h-4 text-gray-500 group-hover:text-shop_light_green" />
            <span className="text-gray-800 group-hover:text-shop_light_green">Dashboard</span>
          </Link>

          {/* Settings */}
          <Link
            href="/user/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-shop_light_bg transition-colors duration-200 group"
          >
            <Settings className="w-4 h-4 text-gray-500 group-hover:text-shop_light_green" />
            <span className="text-gray-800 group-hover:text-shop_light_green">Settings</span>
          </Link>

          <div className="my-1 border-t border-gray-100"></div>

          {/* Employee Dashboard */}
          {isEmployeeUser && (
            <Link
              href="/employee"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-purple-50 transition-colors duration-200 group border border-purple-100"
            >
              <Briefcase className="w-4 h-4 text-purple-500" />
              <div className="flex items-center justify-between w-full">
                <span className="text-purple-600 font-medium">Employee Dashboard</span>
                <Crown className="w-4 h-4 text-purple-500" />
              </div>
            </Link>
          )}

          {/* Help */}
          <Link
            href="/help"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-shop_light_bg transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 text-gray-500 group-hover:text-shop_light_green"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-800 group-hover:text-shop_light_green">Help & Support</span>
          </Link>

          {/* Admin */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-shop_light_bg transition-colors duration-200 group"
            >
              <Shield className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Sign Out */}
        <div className="p-2 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-red-50 transition-colors duration-200 w-full text-left"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span className="text-red-600">Sign Out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserDropdown;
