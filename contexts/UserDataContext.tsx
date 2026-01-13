'use client';

import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface UserData {
  currentUser: User | null;
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

  const authReady = status !== 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;

  const sessionUser = session?.user ?? null;

  const cacheRef = useRef<{
    data: Omit<UserData, 'currentUser'>;
    timestamp: number;
  } | null>(null);

  const [state, setState] = useState<UserData & { isLoading: boolean }>({
    currentUser: null,
    ordersCount: 0,
    isEmployee: false,
    unreadNotifications: 0,
    walletBalance: 0,
    isLoading: false,
  });

  const loadUserStats = useCallback(
    async (force = false) => {
      if (!sessionUser) return;
      const now = Date.now();
      if (!force && cacheRef.current && now - cacheRef.current.timestamp < 30_000) {
        setState((prev) => ({
          ...prev,
          ...cacheRef.current!.data,
        }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const res = await fetch('/api/user/combined-data', {
          cache: 'no-store',
        });
        const data = await res.json();

        const normalized = {
          ordersCount: data.ordersCount ?? 0,
          isEmployee: data.isEmployee ?? false,
          unreadNotifications: data.unreadNotifications ?? 0,
          walletBalance: data.walletBalance ?? 0,
        };

        cacheRef.current = {
          data: normalized,
          timestamp: now,
        };

        setState((prev) => ({
          ...prev,
          ...normalized,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Failed to load user stats', err);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [sessionUser],
  );

  const doLogoutLocal = async () => {
    cacheRef.current = null;
    setState({
      currentUser: null,
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

    if (sessionUser) {
      loadUserStats();
    }
  }, [authReady, sessionUser, loadUserStats]);

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
