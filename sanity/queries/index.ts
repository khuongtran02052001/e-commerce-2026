import axiosClient from '@/lib/axiosClient';
import { unstable_cache } from 'next/cache';

/**
 * Helper wrapper for axios get
 */
async function fetchApi<T>(url: string, params: any = {}): Promise<T | null> {
  try {
    const { data } = await axiosClient.get(url, { params });
    return data ?? null;
  } catch (error) {
    console.error(`API ERROR (${url}):`, error);
    return null;
  }
}

/* ============================================================
    BANNERS (Cached 5 min)
============================================================ */
export const getBanner = unstable_cache(async () => await fetchApi('/banners'), ['banner'], {
  revalidate: 300,
});

/* ============================================================
    FEATURED CATEGORIES (Cached 15 min)
============================================================ */
export const getFeaturedCategory = unstable_cache(
  async (quantity: number) => await fetchApi('/categories/featured', { quantity }),
  ['featured-categories'],
  { revalidate: 900 },
);

/* ============================================================
    ALL PRODUCTS (Cached 10 min)
============================================================ */
export const getAllProducts = unstable_cache(
  async () => await fetchApi('/products'),
  ['all-products'],
  { revalidate: 600 },
);

/* ============================================================
    DEAL PRODUCTS (Cached 5 min)
============================================================ */
export const getDealProducts = unstable_cache(
  async () => await fetchApi('/products/deals'),
  ['deal-products'],
  { revalidate: 300 },
);

/* ============================================================
    FEATURED PRODUCTS (Cached 10 min)
============================================================ */
export const getFeaturedProducts = unstable_cache(
  async () => await fetchApi('/products/featured'),
  ['featured-products'],
  { revalidate: 600 },
);

/* ============================================================
    ALL BRANDS (Cached 1 hour)
============================================================ */
export const getAllBrands = unstable_cache(async () => await fetchApi('/brands'), ['all-brands'], {
  revalidate: 3600,
});

/* ============================================================
    LATEST BLOGS (Cached 5 min)
============================================================ */
export const getLatestBlogs = unstable_cache(
  async () => await fetchApi('/blogs/latest'),
  ['latest-blogs'],
  { revalidate: 300 },
);

/* ============================================================
    ALL BLOGS (Cached 10 min)
============================================================ */
export const getAllBlogs = unstable_cache(
  async (quantity: number) => await fetchApi('/blogs', { quantity }),
  ['all-blogs'],
  { revalidate: 600 },
);

/* ============================================================
    SINGLE BLOG (Cached 30 min)
============================================================ */
export const getSingleBlog = unstable_cache(
  async (slug: string) => await fetchApi(`/blogs/${slug}`),
  ['single-blog'],
  { revalidate: 1800 },
);

/* ============================================================
    BLOG CATEGORIES (Cached 1 hour)
============================================================ */
export const getBlogCategories = unstable_cache(
  async () => await fetchApi('/blog-categories'),
  ['blog-categories'],
  { revalidate: 3600 },
);

/* ============================================================
    OTHER BLOGS (Cached 10 min)
============================================================ */
export const getOthersBlog = unstable_cache(
  async (slug: string, quantity: number) => await fetchApi('/blogs/others', { slug, quantity }),
  ['others-blog'],
  { revalidate: 600 },
);

/* ============================================================
    ADDRESSES (No Cache — User Data)
============================================================ */
export const getAddresses = async (userId: string) => await fetchApi(`/users/${userId}/addresses`);

/* ============================================================
    CATEGORIES WITH PRODUCT COUNT (Cached 15 min)
============================================================ */
export const getCategories = unstable_cache(
  async (quantity?: number) => await fetchApi('/categories', { quantity }),
  ['categories-list'],
  { revalidate: 900 },
);

/* ============================================================
    ADMIN CATEGORIES (No Cache)
============================================================ */
export const getAdminCategories = async () => await fetchApi('/admin/categories');

/* ============================================================
    PRODUCT BY SLUG (Cached 30 min)
============================================================ */
export const getProductBySlug = unstable_cache(
  async (slug: string) => await fetchApi(`/products/${slug}`),
  ['product-by-slug'],
  { revalidate: 1800 },
);

/* ============================================================
    BRAND BY SLUG (Cached 30 min)
============================================================ */
export const getBrand = unstable_cache(
  async (slug: string) => await fetchApi(`/brands/${slug}`),
  ['brand-by-slug'],
  { revalidate: 1800 },
);

/* ============================================================
    RELATED PRODUCTS (Cached 15 min)
============================================================ */
export const getRelatedProducts = unstable_cache(
  async (categoryIds: string[], currentSlug: string, limit: number = 4) =>
    await fetchApi('/products/related', {
      categoryIds: JSON.stringify(categoryIds),
      currentSlug,
      limit,
    }),
  ['related-products'],
  { revalidate: 900 },
);

/* ============================================================
    SINGLE ORDER (UNCACHED - from userQueries)
============================================================ */
export const getOrderById = async (orderId: string) => await fetchApi(`/orders/${orderId}`);
