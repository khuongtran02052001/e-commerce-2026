'use server';

import { signIn, signOut } from '@/lib/auth';

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
  await signOut({
    redirect: false,
  });
}
