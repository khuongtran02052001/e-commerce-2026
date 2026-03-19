'use server';

import { signIn, signOut } from '@/lib/auth';

export async function doSocialLogin(provider: string) {
  await signIn(provider, {
    redirectTo:
      '/auth/callback',
  });
}

export async function doLogout() {
  await signOut({
    redirect: false,
  });
}
