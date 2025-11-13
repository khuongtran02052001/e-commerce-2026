/**
 * Converted from sanity/queries/index.ts
 * Converted to use fetch against http://localhost:8080 and ready for React Query SSR hydration.
 *
 * NOTE: Adjust endpoint paths as your backend API exposes them.
 */

// -----------------------------
// API fetch helpers
// -----------------------------
const BASE = 'https://fakestoreapi.com'

async function safeFetch(url: string, opts: RequestInit = {}) {
  try {
    const res = await fetch(url, opts)
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Fetch error ${res.status}: ${text}`)
    }
    return await res.json()
  } catch (err) {
    console.error('safeFetch error:', err)
    throw err
  }
}

// -----------------------------
// Data fetchers (server-friendly)
// -----------------------------

export async function getBanner() {
  return safeFetch(`${BASE}/products`)
}

export async function getAllProducts() {
  return safeFetch(`${BASE}/products`)
}

export async function getProductBySlug(slug: string) {
  return safeFetch(`${BASE}/products/slug/${encodeURIComponent(slug)}`)
}

export async function getRelatedProducts(productId: string) {
  return safeFetch(`${BASE}/products/${encodeURIComponent(productId)}/related`)
}

export async function getAllCategories() {
  return safeFetch(`${BASE}/categories`)
}

export async function getAdminCategories() {
  return safeFetch(`${BASE}/admin/categories`)
}

export async function getFeaturedCategory() {
  return safeFetch(`${BASE}/categories/featured`)
}

export async function getDealProducts() {
  return safeFetch(`${BASE}/products/deals`)
}

export async function getFeatureProducts() {
  return safeFetch(`${BASE}/products/featured`)
}

export async function getBrands() {
  return safeFetch(`${BASE}/brands`)
}

export async function getBrandBySlug(slug: string) {
  return safeFetch(`${BASE}/brands/slug/${encodeURIComponent(slug)}`)
}

// Blogs
export async function getAllBlogs() {
  return safeFetch(`${BASE}/blogs`)
}

export async function getLatestBlogs() {
  return safeFetch(`${BASE}/blogs/latest`)
}

export async function getBlogBySlug(slug: string) {
  return safeFetch(`${BASE}/blogs/slug/${encodeURIComponent(slug)}`)
}

export async function getOtherBlogs() {
  return safeFetch(`${BASE}/blogs/others`)
}

export async function getBlogCategories() {
  return safeFetch(`${BASE}/blog-categories`)
}

// Address / user queries
export async function getAddress() {
  return safeFetch(`${BASE}/address`)
}

export async function getOrderById(orderId: string) {
  return safeFetch(`${BASE}/orders/${encodeURIComponent(orderId)}`)
}

// -----------------------------
// Export list for convenience
// -----------------------------
export default {
  getBanner,
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  getAllCategories,
  getAdminCategories,
  getFeaturedCategory,
  getDealProducts,
  getFeatureProducts,
  getBrands,
  getBrandBySlug,
  getAllBlogs,
  getLatestBlogs,
  getBlogBySlug,
  getOtherBlogs,
  getBlogCategories,
  getAddress,
  getOrderById,
}
