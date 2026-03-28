import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'image.hsv-tech.io',
      },
      {
        protocol: 'https',
        hostname: 'file.hstatic.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.nhathuoclongchau.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'static.hasaki.vn',
      },
      {
        protocol: 'https',
        hostname: 'ordinary.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'pinterest.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cosmetics.vn',
      },
      {
        protocol: 'https',
        hostname: 'www.pinterest.com',
      },
      {
        protocol: 'https',
        hostname: 'media.hcdn.vn',
      },
    ],
  },

  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
