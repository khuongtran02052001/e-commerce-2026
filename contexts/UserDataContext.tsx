'use client';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface UserData {
  currentUser: User | null;
  ordersCount: number;
  isEmployee: boolean;
  unreadNotifications: number;
  walletBalance: number;
  isLoading: boolean;
}

interface UserDataContextType extends UserData {
  refreshUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

let cachedData: Omit<UserData, 'isLoading'> | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000;

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const sessionUser = session?.user;
  const isSessionLoaded = status !== 'loading';

  const [userData, setUserData] = useState<UserData>({
    currentUser: null,
    ordersCount: 0,
    isEmployee: false,
    unreadNotifications: 0,
    walletBalance: 0,
    isLoading: false,
  });

  const loadUserStats = useCallback(
    async (forceRefresh = false) => {
      if (!sessionUser || !isSessionLoaded) return;

      const now = Date.now();
      if (!forceRefresh && cachedData && now - cacheTimestamp < CACHE_DURATION) {
        setUserData((prev) => ({ ...prev, ...cachedData }));
        return;
      }

      setUserData((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await fetch('/api/user/combined-data', {
          cache: 'no-store',
        });

        const data = await response.json();

        const newUserData: Omit<UserData, 'isLoading'> = {
          currentUser: sessionUser,
          ordersCount: data.ordersCount ?? 0,
          isEmployee: data.isEmployee ?? false,
          unreadNotifications: data.unreadNotifications ?? 0,
          walletBalance: data.walletBalance ?? 0,
        };

        cachedData = newUserData;
        cacheTimestamp = now;

        setUserData((prev) => ({ ...prev, ...newUserData, isLoading: false }));
      } catch (e) {
        console.error('Failed to load user stats:', e);
        setUserData((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [sessionUser, isSessionLoaded],
  );

  useEffect(() => {
    if (isSessionLoaded && sessionUser) {
      setUserData((prev) => ({ ...prev, currentUser: sessionUser }));
      loadUserStats();
    }
  }, [isSessionLoaded, sessionUser, loadUserStats]);

  return (
    <UserDataContext.Provider
      value={{
        ...userData,
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
