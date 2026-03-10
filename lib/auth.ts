import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { buildServiceUrl } from './restClient';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async signIn({ account }) {
      if (account?.provider === 'google' && account.id_token) {
        try {
          const res = await fetch(buildServiceUrl('/auth/google-login', 'system'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleIdToken: account.id_token }),
          });
          const payload = (await res.json().catch(() => null)) as {
            accessToken?: string;
            data?: { accessToken?: string };
            token?: string;
          } | null;
          const accessToken =
            payload?.accessToken || payload?.data?.accessToken || payload?.token || '';
          if (accessToken) {
            (account as any).beAccessToken = accessToken;
          } else {
            console.warn('BE login succeeded but no access token returned');
          }
        } catch (e) {
          console.error('BE login failed', e);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, account }) {
      if (account?.beAccessToken) {
        token.beAccessToken = account.beAccessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.beAccessToken as string;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
