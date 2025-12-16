'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUserData } from '@/contexts/UserDataContext';
import CartIcon from './cart/CartIcon';
import Logo from './common/Logo';
import Container from './Container';
import FavoriteButton from './FavoriteButton';
import HeaderMenu from './layout/HeaderMenu';
import MobileMenu from './layout/MobileMenu';
import NotificationBell from './NotificationBell';
import UserDropdown from './UserDropdown';

const ClientHeader = () => {
  const { currentUser: user } = useUserData();
  const isSignedIn = !!user;

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle redirect after login
  useEffect(() => {
    if (isSignedIn && isMounted && typeof window !== 'undefined') {
      const redirectTo = searchParams.get('redirectTo');
      if (redirectTo) {
        const clean = decodeURIComponent(redirectTo);
        router.push(clean);
        router.replace(window.location.pathname);
      }
    }
  }, [isSignedIn, searchParams, router, isMounted]);

  const getSignInUrl = () => {
    if (!isMounted || typeof window === 'undefined') return '/login';
    const path = window.location.pathname + window.location.search;
    return `/login?redirectTo=${encodeURIComponent(path)}`;
  };

  const getSignUpUrl = () => {
    if (!isMounted || typeof window === 'undefined') return '/register';
    const path = window.location.pathname + window.location.search;
    return `/register?redirectTo=${encodeURIComponent(path)}`;
  };

  return (
    <header className="sticky top-0 z-40 py-2 sm:py-3 lg:py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <Container className="h-full">
        <div className="flex items-center h-full min-h-[3rem] sm:min-h-[3.5rem] lg:min-h-[4rem]">
          {/* Mobile menu + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <MobileMenu />
            <Logo />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <HeaderMenu />
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-4">
              <CartIcon />
              <FavoriteButton />
              <NotificationBell />

              {/* Signed In */}
              {isSignedIn && <UserDropdown />}

              {/* Signed Out */}
              {!isSignedIn && (
                <div className="flex items-center gap-3">
                  <Link
                    href={getSignInUrl()}
                    className="bg-transparent border border-shop_btn_dark_green hover:bg-shop_btn_dark_green text-shop_btn_dark_green hover:text-white px-2 py-1.5 rounded text-xs font-semibold hoverEffect"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={getSignUpUrl()}
                    className="bg-shop_btn_dark_green border border-shop_btn_dark_green hover:bg-transparent text-white hover:text-shop_btn_dark_green px-2 py-1.5 rounded text-xs font-semibold hoverEffect"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Tablet */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <CartIcon />
              <FavoriteButton />
              <NotificationBell />

              {isSignedIn ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={getSignInUrl()}
                    className="text-sm font-semibold hover:text-shop_light_green hoverEffect px-2 py-1 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={getSignUpUrl()}
                    className="bg-shop_dark_green hover:bg-shop_light_green text-white px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-1">
              {isSignedIn ? (
                <UserDropdown />
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href={getSignInUrl()}
                    className="bg-transparent border border-shop_btn_dark_green hover:bg-shop_btn_dark_green text-shop_btn_dark_green  hover:text-white px-2 py-1.5 rounded text-xs font-semibold hoverEffect"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={getSignUpUrl()}
                    className="bg-shop_btn_dark_green border border-shop_btn_dark_green hover:bg-transparent text-white hover:text-shop_btn_dark_green px-2 py-1.5 rounded text-xs font-semibold hoverEffect"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default ClientHeader;
