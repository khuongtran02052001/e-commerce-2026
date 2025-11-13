/**
 * React Query hooks using the fetchers above.
 * Client Components should import these hooks.
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getBanner,
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  getAllCategories,
  getBrands,
  getAllBlogs,
  getBlogBySlug,
  getAddress,
  getOrderById,
} from './queries' // adjust path when moving into project

export const useBanners = () =>
  useQuery({ queryKey: ['banners'], queryFn: getBanner, staleTime: 5 * 60 * 1000 })

export const useProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: getAllProducts, staleTime: 60 * 1000 })

export const useProductBySlug = (slug?: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => (slug ? getProductBySlug(slug) : Promise.reject('Missing slug')),
    enabled: !!slug,
    staleTime: 60 * 1000,
  })

export const useRelatedProducts = (productId?: string) =>
  useQuery({
    queryKey: ['relatedProducts', productId],
    queryFn: () => (productId ? getRelatedProducts(productId) : Promise.resolve([])),
    enabled: !!productId,
  })

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: getAllCategories, staleTime: 5 * 60 * 1000 })

export const useBrands = () =>
  useQuery({ queryKey: ['brands'], queryFn: getBrands, staleTime: 5 * 60 * 1000 })

export const useBlogs = () =>
  useQuery({ queryKey: ['blogs'], queryFn: getAllBlogs, staleTime: 5 * 60 * 1000 })

export const useBlogBySlug = (slug?: string) =>
  useQuery({
    queryKey: ['blog', slug],
    queryFn: () => (slug ? getBlogBySlug(slug) : Promise.reject('Missing slug')),
    enabled: !!slug,
  })

export const useAddress = () =>
  useQuery({ queryKey: ['address'], queryFn: getAddress, staleTime: 10 * 60 * 1000 })

export const useOrderById = (orderId?: string) =>
  useQuery({
    queryKey: ['order', orderId],
    queryFn: () => (orderId ? getOrderById(orderId) : Promise.reject('Missing orderId')),
    enabled: !!orderId,
  })
