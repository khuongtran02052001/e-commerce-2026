import type { DefaultSession } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    provider?: string;
    error?: string;
    googleIdToken?: string;
    beAccessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      avatar?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    provider?: string;
    error?: string;
    user?: User | AdapterUser;
  }
}
