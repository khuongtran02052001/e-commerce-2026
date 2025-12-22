import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axiosClient from './axiosClient';

export const { handlers, auth, signIn, signOut } = NextAuth({
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
          const res = await axiosClient.post('/auth/google-login', {
            googleIdToken: account.id_token,
          });
          // gắn tạm vào account để jwt callback lấy
          (account as any).beAccessToken = res.data.accessToken;
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
