import PremiumFloatingButton from '@/components/PremiumFloatingButton';
import { UserDataProvider } from '@/contexts/UserDataContext';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import localFont from 'next/font/local';
import Script from 'next/script';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

const poppins = localFont({
  src: './fonts/Poppins.woff2',
  variable: '--font-poppins',
  weight: '400',
  preload: false,
});
const raleway = localFont({
  src: './fonts/Raleway.woff2',
  variable: '--font-raleway',
  weight: '100 900',
});

const opensans = localFont({
  src: './fonts/Open Sans.woff2',
  variable: '--font-open-sans',
  weight: '100 800',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://e-commerce-2026-three.vercel.app/'),
    title: {
      template: '%s | ShopCart - Premium Online Shopping',
      default: 'ShopCart - Your Trusted Online Shopping Destination',
    },
    description:
      'Discover amazing products at ShopCart, your trusted online shopping destination for quality items and exceptional customer service. Shop electronics, fashion, home goods and more with fast delivery.',
    keywords: [
      'online shopping',
      'e-commerce',
      'buy online',
      'shop online',
      'electronics',
      'fashion',
      'home goods',
      'deals',
      'discounts',
      'ShopCart',
    ],
    authors: [{ name: 'ShopCart' }],
    creator: 'ShopCart',
    publisher: 'ShopCart',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://e-commerce-2026-three.vercel.app/',
      siteName: 'ShopCart',
      title: 'ShopCart - Your Trusted Online Shopping Destination',
      description:
        'Discover amazing products at ShopCart, your trusted online shopping destination for quality items and exceptional customer service.',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'ShopCart Online Store',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'ShopCart - Your Trusted Online Shopping Destination',
      description:
        'Discover amazing products at ShopCart, your trusted online shopping destination for quality items and exceptional customer service.',
      images: ['/og-image.jpg'],
      creator: '@shopcart',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: `${process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}`,
    },
    alternates: {
      canonical: 'https://e-commerce-2026-three.vercel.app/',
    },
    other: {
      'google-adsense-account': `${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`,
    },
  };
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${raleway.variable} ${opensans.variable} antialiased`}>
        <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={0}>
          <UserDataProvider>
            {children}
            <PremiumFloatingButton />
          </UserDataProvider>
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              },
              className: 'sonner-toast',
            }}
          />

          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID}`}
            strategy="beforeInteractive"
          />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
