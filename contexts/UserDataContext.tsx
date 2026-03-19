'use client';

import { fetchService } from '@/lib/restClient';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useCartStore from '@/store';

interface AuthUserProfile {
  id?: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  profileImage?: { url?: string; asset?: { url: string } };
  isAdmin?: boolean;
  isEmployee?: boolean;
  employeeRole?: string | null;
  isActive?: boolean;
  premiumStatus?: string;
  isBusiness?: boolean;
  memberShipType?: string;
  businessStatus?: string;
}

interface UserData {
  currentUser: User | null;
  authUser: AuthUserProfile | null;
  ordersCount: number;
  isEmployee: boolean;
  unreadNotifications: number;
  walletBalance: number;
}

interface UserDataContextType extends UserData {
  authReady: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>;
  doLogoutLocal: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const authReady = status !== 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const sessionUser = session?.user ?? null;
  const hasAccessToken = Boolean(session?.accessToken);
  const isAuthRoute =
    pathname === '/sign-in' ||
    pathname?.startsWith('/sign-in/') ||
    pathname === '/sign-up' ||
    pathname?.startsWith('/sign-up/') ||
    pathname?.startsWith('/auth/');
  const resetCart = useCartStore((state) => state.resetCart);
  const resetFavorite = useCartStore((state) => state.resetFavorite);
  const cacheRef = useRef<{
    data: Omit<UserData, 'currentUser'>;
    timestamp: number;
  } | null>(null);
  const CACHE_TTL_MS = 2 * 60 * 1000;

  const [state, setState] = useState<UserData & { isLoading: boolean }>({
    currentUser: null,
    authUser: null,
    ordersCount: 0,
    isEmployee: false,
    unreadNotifications: 0,
    walletBalance: 0,
    isLoading: false,
  });

  const loadUserStats = useCallback(
    async (force = false) => {
      if (!sessionUser || !session?.accessToken || isAuthRoute) {
        if (sessionUser) {
          setState((prev) => ({
            ...prev,
            authUser: {
              email: sessionUser.email ?? undefined,
              firstName: sessionUser.name?.split(' ')[0] ?? undefined,
              lastName: sessionUser.name?.split(' ').slice(1).join(' ') || undefined,
              profileImage: sessionUser.image ? { url: sessionUser.image } : undefined,
            },
          }));
        }
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }
      const now = Date.now();
      if (!force && cacheRef.current && now - cacheRef.current.timestamp < CACHE_TTL_MS) {
        setState((prev) => ({
          ...prev,
          ...cacheRef.current!.data,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await fetchService('/auth/me', {
          cache: 'no-store',
          accessToken: session.accessToken,
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setState((prev) => ({
              ...prev,
              authUser: null,
              ordersCount: 0,
              unreadNotifications: 0,
              walletBalance: 0,
              isLoading: false,
            }));
            if (!isAuthRoute) {
              resetCart();
              resetFavorite();
              if (typeof window !== 'undefined') {
                localStorage.removeItem('cart-store');
              }
              void signOut({ callbackUrl: '/sign-in' });
            }
          } else {
            console.error('Failed to load user data', res.status);
            setState((prev) => ({ ...prev, isLoading: false }));
          }
          return;
        }
        const payload = await res.json().catch(() => null);
        const user = payload?.data ?? payload?.user ?? payload;
        const normalized = {
          ordersCount: user?.orders?.length ?? 0,
          isEmployee: user?.isEmployee ?? false,
          unreadNotifications: user?.notifications?.length ?? 0,
          walletBalance: user?.walletBalance ?? 0,
        };

        cacheRef.current = {
          data: normalized as UserData,
          timestamp: now,
        };

        setState((prev) => ({
          ...prev,
          authUser: user ?? null,
          ...normalized,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Failed to load user stats', err);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [sessionUser, session?.accessToken, isAuthRoute, resetCart, resetFavorite],
  );

  const doLogoutLocal = async () => {
    cacheRef.current = null;
    setState({
      currentUser: null,
      authUser: null,
      ordersCount: 0,
      isEmployee: false,
      unreadNotifications: 0,
      walletBalance: 0,
      isLoading: false,
    });
  };
  useEffect(() => {
    if (!authReady) return;

    setState((prev) => ({
      ...prev,
      currentUser: sessionUser,
    }));

    if (sessionUser && hasAccessToken && !isAuthRoute) {
      loadUserStats();
    } else {
      setState((prev) => ({
        ...prev,
        authUser: null,
        isLoading: false,
      }));
    }
  }, [authReady, sessionUser, loadUserStats, hasAccessToken, isAuthRoute]);

  return (
    <UserDataContext.Provider
      value={{
        ...state,
        authReady,
        isAuthenticated,
        doLogoutLocal,
        refreshUserData: () => loadUserStats(true),
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider');
  return ctx;
}
