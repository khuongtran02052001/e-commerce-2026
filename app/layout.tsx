import WebsiteAssistant from '@/components/assistant/WebsiteAssistant';
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
      template: '%s | Lumière Skin',
      default: 'Lumière Skin - Skincare & Beauty Picks For Healthy-Looking Skin',
    },
    description:
      'Khám phá skincare routine, serum, kem chống nắng và các sản phẩm chăm sóc da được tuyển chọn cho da dầu mụn, da nhạy cảm và da thiếu nước. Mua sắm skincare dễ hiểu, dễ chọn và hợp routine hằng ngày.',
    keywords: [
      'skincare',
      'chăm sóc da',
      'serum',
      'kem chống nắng',
      'sữa rửa mặt',
      'da dầu mụn',
      'da nhạy cảm',
      'beauty store',
      'routine skincare',
      'Lumière Skin',
    ],
    authors: [{ name: 'Lumière Skin' }],
    creator: 'Lumière Skin',
    publisher: 'Lumière Skin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: 'https://e-commerce-2026-three.vercel.app/',
      siteName: 'Lumière Skin',
      title: 'Lumière Skin - Skincare & Beauty Picks For Healthy-Looking Skin',
      description:
        'Skincare dễ chọn cho routine hằng ngày: sữa rửa mặt, serum, kem dưỡng, kem chống nắng và bài viết chăm sóc da dễ áp dụng.',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Lumière Skin skincare store',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lumière Skin - Skincare & Beauty Picks For Healthy-Looking Skin',
      description:
        'Skincare dễ chọn cho routine hằng ngày: serum, kem dưỡng, kem chống nắng và sản phẩm cho nhiều loại da.',
      images: ['/og-image.jpg'],
      creator: '@lumiereskin',
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
      google: `3kYzG52_FPmJmGNDQfhOXmHVxDdxDIU48qVTitPizZo`,
    },
    alternates: {
      canonical: 'https://e-commerce-2026-three.vercel.app/',
    },
    other: {
      'google-adsense-account': `ca-pub-3215998461819174`,
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
            <WebsiteAssistant />
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
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3215998461819174`}
            strategy="beforeInteractive"
          />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
