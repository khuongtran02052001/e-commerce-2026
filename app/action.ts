'use server';

import { signIn, signOut } from '@/lib/auth';
import { headers } from 'next/headers';

export async function doSocialLogin(provider: string) {
  await signIn(provider, {
    redirectTo:
      // process.env.NODE_ENV === 'production'
      //   ? 'https://photruyen.vn/auth/callback'
      //   : '/auth/callback',
      '/auth/callback',
  });
}

export async function doLogout() {
  const host = (await headers()).get('host') || '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  await signOut({
    redirectTo: baseUrl,
  });
}
