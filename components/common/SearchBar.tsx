'use client';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { trackSearchPerformed } from '@/lib/analytics';
import { fetchServiceJson } from '@/lib/restClient';
import type { IProduct } from '@/mock-data';
import { getSearchProducts } from '@/data/client/product';
import type { PaginatedResult } from '@/types/common-type';
import { Clock, Loader2, Search, Star, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import AddToCartButton from '../AddToCartButton';
import PriceView from '../PriceView';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Logo from './Logo';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState<IProduct[]>([]);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useOutsideClick<HTMLDivElement>(() => setShowSearch(false));

  // Detect if user is on Mac
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await fetchServiceJson<PaginatedResult<IProduct>>('/products/featured');
      setFeaturedProduct(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  }, []);

  useEffect(() => {
    if (showSearch === true) {
      fetchFeaturedProducts();
      // Focus input when modal opens
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timeoutId); // Cleanup timeout
    }
  }, [showSearch, fetchFeaturedProducts]);

  // Handle escape key to close modal and Ctrl+K to open modal
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Handle Escape key to close modal
      if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
        return;
      }

      // Handle Ctrl+K (or Cmd+K on Mac) to open search modal
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault(); // Prevent browser's default search behavior
        setShowSearch(true);
        return;
      }
    };

    // Always listen for global keyboard shortcuts
    document.addEventListener('keydown', handleKeydown);

    // Handle body scroll lock only when modal is open
    if (showSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'unset';
    };
  }, [showSearch]);

  // Fetch products from Sanity based on search input
  const fetchProducts = useCallback(async () => {
    if (!search) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getSearchProducts(search);
      setProducts(response.data);
      trackSearchPerformed({
        searchTerm: search,
        resultCount: response.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Debounce input changes to reduce API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300); // Delay of 300ms

    return () => clearTimeout(debounceTimer); // Cleanup the timer
  }, [fetchProducts]);
  return (
    <>
      {/* Search Trigger Button - Modern Input Style */}
      <TooltipProvider delayDuration={120}>
        <div className="flex">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowSearch(true)}
                className="group relative flex h-9 w-9 items-center justify-center rounded-full text-shop_dark_green/80 transition-colors duration-200 hover:bg-shop_light_pink/55 hover:text-shop_dark_green"
                aria-label={`Open search (${isMac ? 'Cmd' : 'Ctrl'}+K)`}
              >
                <Search className="h-4 w-4 text-shop_dark_green/80 transition-colors duration-200 group-hover:text-shop_dark_green" />
                <span className="pointer-events-none absolute -right-1 -top-1 hidden rounded-full bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-dark-text ring-1 ring-shop_light_green/15 md:inline-flex">
                  K
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="border border-shop_light_green/18 bg-white/95 text-dark-color shadow-[0_14px_34px_rgba(139,76,114,0.12)]"
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <span>Search products</span>
                <span className="rounded border border-shop_light_green/18 bg-shop_light_bg px-1.5 py-0.5 font-mono text-[10px] text-dark-text">
                  {isMac ? 'Cmd' : 'Ctrl'} + K
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Search Modal Overlay */}
      {showSearch && (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 search-modal-overlay ${
            showSearch ? 'animate-fadeIn' : 'animate-fadeOut'
          }`}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 h-screen w-full bg-shop_dark_green/16 backdrop-blur-[3px]" />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className={`relative w-full max-w-4xl overflow-hidden rounded-2xl border border-shop_light_green/15 bg-white shadow-[0_28px_70px_rgba(139,76,114,0.16)] search-modal-content ${
              showSearch ? 'animate-scaleIn' : 'animate-scaleOut'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-shop_dark_green via-[#9b5f88] to-shop_light_green p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">Search Products</h2>
                    <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md border border-white/20">
                      <span className="text-xs font-mono">{isMac ? 'Cmd' : 'Ctrl'}</span>
                      <span className="text-xs">+</span>
                      <span className="text-xs font-mono">K</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  aria-label="Close search (Escape)"
                  title="Close (Escape)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Input */}
              <form className="relative" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Input
                    ref={inputRef}
                    placeholder="Search your favorite products..."
                    className="w-full pl-12 pr-16 py-4 text-lg bg-white/10 border-white/20 placeholder:text-white/70 text-white focus:bg-white/20 focus:border-white/40 rounded-xl"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                    >
                      <X className="w-4 h-4 text-white/70 hover:text-white" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2.5 rounded-lg transition-all duration-200"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </div>
              </form>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] min-h-[50vh] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-shop_dark_green">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" />
                  <p className="text-lg font-semibold">Searching products...</p>
                  <p className="text-sm text-dark-text">Please wait a moment</p>
                </div>
              ) : products?.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={() => setShowSearch(false)}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-shop_light_green/18 transition-colors duration-200 group-hover:border-shop_light_green sm:h-20 sm:w-20"
                        >
                          {product?.images && (
                            <Image
                              width={80}
                              height={80}
                              src={product?.images[0]?.url || '/images/placeholder.webp'}
                              alt={product.name || 'Product'}
                              className={`object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ${
                                product?.stock === 0 ? 'opacity-50 grayscale' : ''
                              }`}
                            />
                          )}
                          {product?.discount && product.discount > 0 && (
                            <div className="absolute -top-1 -right-1 rounded-full bg-[#c56a8f] px-1.5 py-0.5 text-xs font-semibold text-white">
                              -{product.discount}%
                            </div>
                          )}
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={() => setShowSearch(false)}
                            className="block group-hover:text-shop_dark_green transition-colors duration-200"
                          >
                            <h3 className="font-semibold text-base sm:text-lg line-clamp-1 mb-1">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center justify-between">
                            <PriceView
                              price={product?.price}
                              discount={product?.discount}
                              className="text-sm sm:text-base"
                            />

                            <div className="flex items-center gap-2">
                              {product?.stock === 0 ? (
                                <span className="text-sm font-medium text-[#c56a8f]">
                                  Out of Stock
                                </span>
                              ) : (
                                <AddToCartButton
                                  product={product}
                                  className="px-3 py-1.5 text-sm"
                                />
                              )}
                            </div>
                          </div>

                          {/* Product Status Badges */}
                          <div className="flex items-center gap-2 mt-2">
                            {product?.status === 'HOT' && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-[#efc6d7] bg-[#fdeef4] px-2 py-1 text-xs font-medium text-[#b35c78]">
                                <TrendingUp className="w-3 h-3" />
                                Hot Deal
                              </span>
                            )}
                            {product?.status === 'NEW' && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-shop_light_blue/35 bg-shop_light_blue/35 px-2 py-1 text-xs font-medium text-shop_dark_blue">
                                <Clock className="w-3 h-3" />
                                New Arrival
                              </span>
                            )}
                            {product?.isFeatured && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-shop_light_green/18 bg-shop_light_pink/55 px-2 py-1 text-xs font-medium text-shop_dark_green">
                                <Star className="w-3 h-3" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12">
                  {search === '' ? (
                    <div className="px-6 text-center">
                      <div className="mx-auto rounded-2xl border border-shop_light_green/12 bg-linear-to-br from-shop_light_bg/80 via-white to-shop_light_pink/35 p-8">
                        <div className="flex items-center justify-center mb-4">
                          <div className="rounded-full bg-shop_light_pink/70 p-4">
                            <Search className="w-8 h-8 text-shop_dark_green" />
                          </div>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-dark-color">
                          Discover Amazing Products
                        </h3>
                        <p className="mx-auto mb-3 max-w-xl text-dark-text">
                          Search and explore thousands of products from curated collections,
                          trending items, and featured products.
                        </p>
                        <div className="mb-6 flex justify-center">
                          <Logo className="text-shop_dark_green" />
                        </div>

                        {/* Featured Products Suggestions */}
                        {featuredProduct?.length > 0 && (
                          <div>
                            <h4 className="mb-3 text-left text-sm font-semibold text-dark-color">
                              Popular Searches:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {featuredProduct.slice(0, 6).map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => setSearch(item.name)}
                                  className="inline-flex items-center gap-2 rounded-full border border-shop_light_green/18 bg-white px-3 py-2 text-sm font-medium text-dark-text transition-all duration-200 hover:border-shop_light_green/35 hover:bg-shop_light_pink/45 hover:text-shop_dark_green"
                                >
                                  <Search className="w-3 h-3" />
                                  <span className="line-clamp-1">{item?.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-6 rounded-2xl border border-[#efc6d7] bg-[#fdf1f6] p-8">
                        <div className="flex items-center justify-center mb-4">
                          <div className="rounded-full bg-[#f8dce8] p-3">
                            <X className="w-8 h-8 text-[#c56a8f]" />
                          </div>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-dark-color">
                          No Results Found
                        </h3>
                        <p className="mb-4 text-dark-text">
                          Sorry, we couldn&apos;t find any products matching{' '}
                          <span className="font-semibold text-shop_dark_green">&quot;{search}&quot;</span>
                        </p>
                        <button
                          onClick={() => setSearch('')}
                          className="rounded-full bg-shop_dark_green px-6 py-2 font-medium text-white transition-colors duration-200 hover:bg-shop_btn_dark_green"
                        >
                          Clear Search
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
