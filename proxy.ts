import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

const protectedRoutes = ['/user', '/cart', '/wishlist', '/success', '/checkout', '/settings', '/employee'];
const adminRoutes = ['/user/admin', '/admin'];

function isRoute(req: NextRequest, patterns: string[]) {
  const pathname = req.nextUrl.pathname;
  return patterns.some((p) => pathname.startsWith(p));
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Never run app-level auth guards on Auth.js routes.
  // PKCE/state cookies are handled internally by Auth.js.
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const session = await auth();

  // 1) Protected routes require authentication
  if (isRoute(req, protectedRoutes) && !session?.user) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // 2) Admin routes require authentication
  if (isRoute(req, adminRoutes)) {
    if (!session?.user) {
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
