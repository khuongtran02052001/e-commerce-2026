import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

const protectedRoutes = [
  '/user',
  '/cart',
  '/wishlist',
  '/success',
  '/checkout',
  '/settings',
  '/admin',
];

const adminRoutes = ['/admin'];

function isRoute(req: NextRequest, patterns: string[]) {
  const pathname = req.nextUrl.pathname;
  return patterns.some((p) => pathname.startsWith(p));
}

function isUserAdmin(email?: string | null) {
  if (!email) return false;

  const env = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!env) return false;

  const adminEmails = env
    .replace(/[\[\]]/g, '')
    .split(',')
    .map((i) => i.trim().toLowerCase());

  return adminEmails.includes(email.toLowerCase());
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Same as Clerk's `await auth.protect()`
  const session = await auth();

  // 1️⃣ PROTECTED ROUTES (same as Clerk)
  if (isRoute(req, protectedRoutes)) {
    if (!session?.user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // 2️⃣ ADMIN ROUTES — must login + must be admin
  if (isRoute(req, adminRoutes)) {
    // Clerk: if (!userId) redirect
    if (!session?.user) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Clerk FE admin email check → NextAuth middleware does it directly
    const email = session.user.email;
    if (!isUserAdmin(email)) {
      url.pathname = '/403';
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
