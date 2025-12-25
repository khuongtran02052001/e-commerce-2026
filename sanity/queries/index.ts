import { IProductMock } from '@/mock-data';
import { unstable_cache } from 'next/cache';

/**
 * Helper wrapper for axios get
 */
/**
 * Always return an object with a `data` field so callers can safely access `.data`.
 * If the upstream already returns `{ data: ... }` we forward it, otherwise we wrap the JSON.
 */
async function fetchApi<T>(url: string, params?: any): Promise<{ data: T | null }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();

    // If API already returns { data: ... }
    if (json && typeof json === 'object' && 'data' in json) {
      return { data: (json as any).data as T };
    }

    // Otherwise wrap the entire payload as data
    return { data: (json as T) ?? null };
  } catch {
    return { data: null };
  }
}

/* ============================================================
    BANNERS (Cached 5 min)
============================================================ */
export const getBanner = unstable_cache(
  async () => {
    const res = await fetchApi('/banners');
    return res.data;
  },
  ['banner'],
  {
    revalidate: 300,
  },
);

/* ============================================================
    FEATURED CATEGORIES (Cached 15 min)
============================================================ */
export const getFeaturedCategory = unstable_cache(
  async (quantity: number) => {
    const res = await fetchApi('/categories/featured', { quantity });
    return res.data;
  },
  ['featured-categories'],
  { revalidate: 900 },
);

/* ============================================================
    ALL PRODUCTS (Cached 10 min)
============================================================ */
export const getAllProducts = unstable_cache(
  async () => {
    const res = await fetchApi<IProductMock[]>('/products');
    return res.data;
  },
  ['all-products'],
  { revalidate: 600 },
);

/* ============================================================
    DEAL PRODUCTS (Cached 5 min)
============================================================ */
export const getDealProducts = unstable_cache(
  async () => {
    const res = await fetchApi('/products/deals');
    return res.data;
  },
  ['deal-products'],
  { revalidate: 300 },
);

/* ============================================================
    FEATURED PRODUCTS (Cached 10 min)
============================================================ */
export const getFeaturedProducts = unstable_cache(
  async () => {
    const res = await fetchApi('/products/featured');
    return res.data;
  },
  ['featured-products'],
  { revalidate: 600 },
);

/* ============================================================
    ALL BRANDS (Cached 1 hour)
============================================================ */
export const getAllBrands = unstable_cache(
  async () => {
    const res = await fetchApi('/brands');
    return res.data;
  },
  ['all-brands'],
  { revalidate: 3600 },
);

/* ============================================================
    LATEST BLOGS (Cached 5 min)
============================================================ */
export const getLatestBlogs = unstable_cache(
  async () => {
    const res = await fetchApi('/blogs/latest');
    return res.data;
  },
  ['latest-blogs'],
  { revalidate: 300 },
);

/* ============================================================
    ALL BLOGS (Cached 10 min)
============================================================ */
export const getAllBlogs = unstable_cache(
  async (quantity: number) => {
    const res = await fetchApi('/blogs', { quantity });
    return res.data;
  },
  ['all-blogs'],
  { revalidate: 600 },
);

/* ============================================================
    SINGLE BLOG (Cached 30 min)
============================================================ */
export const getSingleBlog = unstable_cache(
  async (slug: string) => {
    const res = await fetchApi(`/blogs/${slug}`);
    return res.data;
  },
  ['single-blog'],
  { revalidate: 1800 },
);

/* ============================================================
    BLOG CATEGORIES (Cached 1 hour)
============================================================ */
export const getBlogCategories = unstable_cache(
  async () => {
    const res = await fetchApi('/blog-categories');
    return res.data;
  },
  ['blog-categories'],
  { revalidate: 3600 },
);

/* ============================================================
    OTHER BLOGS (Cached 10 min)
============================================================ */
export const getOthersBlog = unstable_cache(
  async (slug: string, quantity: number) => {
    const res = await fetchApi('/blogs/others', { slug, quantity });
    return res.data;
  },
  ['others-blog'],
  { revalidate: 600 },
);

/* ============================================================
    ADDRESSES (No Cache — User Data)
============================================================ */
export const getAddresses = async (userId: string) => {
  const res = await fetchApi(`/users/${userId}/addresses`);
  return res.data;
};

/* ============================================================
    CATEGORIES WITH PRODUCT COUNT (Cached 15 min)
============================================================ */
export const getCategories = unstable_cache(
  async (quantity?: number) => {
    const res = await fetchApi('/categories', { quantity });
    return res.data;
  },
  ['categories-list'],
  { revalidate: 900 },
);

/* ============================================================
    ADMIN CATEGORIES (No Cache)
============================================================ */
export const getAdminCategories = async () => {
  const res = await fetchApi('/admin/categories');
  return res.data;
};

/* ============================================================
    PRODUCT BY SLUG (Cached 30 min)
============================================================ */
export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const res = await fetchApi(`/products/${slug}`);
    return res.data;
  },
  ['product-by-slug'],
  { revalidate: 1800 },
);

/* ============================================================
    BRAND BY SLUG (Cached 30 min)
============================================================ */
export const getBrand = unstable_cache(
  async (slug: string) => {
    const res = await fetchApi(`/brands/${slug}`);
    return res.data;
  },
  ['brand-by-slug'],
  { revalidate: 1800 },
);

/* ============================================================
    RELATED PRODUCTS (Cached 15 min)
============================================================ */
export const getRelatedProducts = unstable_cache(
  async (categoryIds: string[], currentSlug: string, limit: number = 4) => {
    const res = await fetchApi('/products/related', {
      categoryIds: JSON.stringify(categoryIds),
      currentSlug,
      limit,
    });
    return res.data;
  },
  ['related-products'],
  { revalidate: 900 },
);

/* ============================================================
    SINGLE ORDER (UNCACHED - from userQueries)
============================================================ */
export const getOrderById = async (orderId: string) => {
  const res = await fetchApi(`/orders/${orderId}`);
  return res.data;
};
