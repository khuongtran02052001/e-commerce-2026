/**
 * Legacy compatibility note:
 * `urlFor` is retained only to support old Sanity-shaped image objects.
 * Preferred image fields for REST mode are `imageUrl`, `mainImageUrl`, or plain URL strings.
 */
import { urlFor } from '@/lib/image';
import type { IProduct } from '@/mock-data';
import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const resolveImageUrl = (image: unknown, fallback: string = '/og-image.jpg') => {
  if (!image) return fallback;
  if (typeof image === 'string') return image;
  if (typeof image === 'object') {
    const imageObj = image as { url?: string; imageUrl?: string };
    if (imageObj.url) return imageObj.url;
    if (imageObj.imageUrl) return imageObj.imageUrl;
    try {
      return urlFor(imageObj as never).url();
    } catch {
      return fallback;
    }
  }
  return fallback;
};

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: any): Metadata {
  const title = product.name || 'Product';
  const description =
    product.description ||
    `Buy ${title} online at ShopCart. ${product.price ? `Price: $${product.price}` : ''}`;
  const imageUrl = resolveImageUrl(product.images?.[0]);
  const slug = typeof product.slug === 'string' ? product.slug : product.slug?.current;
  const url = `${BASE_URL}/product/${slug || ''}`;

  // Extract brand name if it's populated
  const brandName = typeof product.brand === 'object' ? product.brand?.name : '';

  return {
    title,
    description,
    keywords: [product.name || '', brandName || '', 'buy online', 'shop', 'e-commerce'].filter(
      Boolean,
    ),
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'ShopCart',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(category: any, productCount: number = 0): Metadata {
  const title = category.title || 'Category';
  const description =
    category.description ||
    `Browse ${productCount} products in ${title} category at ShopCart. Find the best deals and quality items.`;
  const imageUrl = resolveImageUrl(
    (category as { image?: unknown; imageUrl?: string }).image ||
      (category as { imageUrl?: string }).imageUrl,
  );
  const slug = typeof category.slug === 'string' ? category.slug : category.slug?.current;
  const url = `${BASE_URL}/category/${slug || ''}`;

  return {
    title,
    description,
    keywords: [
      category.title || '',
      'category',
      'shop',
      'buy online',
      'e-commerce',
      'products',
    ].filter(Boolean),
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'ShopCart',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate Product Schema (JSON-LD) for rich snippets
 */
export function generateProductSchema(product: any) {
  const imageUrl = resolveImageUrl(product.images?.[0], '');
  const slug = typeof product.slug === 'string' ? product.slug : product.slug?.current;

  // Extract brand name if it's populated
  const brandName = typeof product.brand === 'object' ? product.brand?.name : 'ShopCart';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${slug || ''}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0],
      availability:
        product.stock && product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.averageRating,
        reviewCount: product.totalReviews || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/**
 * Generate BreadcrumbList Schema (JSON-LD)
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Organization Schema (JSON-LD)
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ShopCart',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      'Your trusted online shopping destination for quality items and exceptional customer service.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'en',
    },
    sameAs: [
      'https://facebook.com/shopcart',
      'https://twitter.com/shopcart',
      'https://instagram.com/shopcart',
      'https://linkedin.com/company/shopcart',
    ],
  };
}

/**
 * Generate WebSite Schema (JSON-LD) with search action
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ShopCart',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate ItemList Schema for product listings
 */
export function generateItemListSchema(products: any[], listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${BASE_URL}/product/${typeof product.slug === 'string' ? product.slug : product.slug?.current}`,
      name: product.name,
    })),
  };
}

/**
 * Generate Review Schema for product reviews
 */
export function generateReviewSchema(reviews: any[], product: IProduct) {
  if (!reviews || reviews.length === 0) return null;

  const reviewSchemas = reviews.map((review) => ({
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: review.userName || 'Anonymous',
    },
    reviewBody: review.comment,
    datePublished: review._createdAt,
  }));

  return reviewSchemas;
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Helper to create canonical URL
 */
export function getCanonicalUrl(path: string): string {
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Generate metadata for homepage
 */
export function generateHomeMetadata(): Metadata {
  return {
    title: 'ShopCart - Your Trusted Online Shopping Destination',
    description:
      'Discover amazing products at ShopCart, your trusted online shopping destination for quality items and exceptional customer service. Shop electronics, fashion, home goods and more with fast delivery.',
    keywords: [
      'online shopping',
      'e-commerce',
      'buy online',
      'shop online',
      'best deals',
      'electronics',
      'fashion',
      'home goods',
    ],
    openGraph: {
      type: 'website',
      url: BASE_URL,
      title: 'ShopCart - Your Trusted Online Shopping Destination',
      description:
        'Discover amazing products at ShopCart. Shop electronics, fashion, home goods and more with fast delivery.',
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
        'Discover amazing products at ShopCart. Shop electronics, fashion, home goods and more.',
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}
