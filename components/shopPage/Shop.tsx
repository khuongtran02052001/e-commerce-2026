'use client';
// import { client } from "@/sanity/lib/client";
import { axiosPublic } from '@/lib/axios/axiosPublic';
import { IBrand, ICategory, IProduct } from '@/mock-data';
import type { PaginatedResult } from '@/types/common-type';
import { Filter, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Container from '../Container';
import ProductCard from '../ProductCard';
import Title from '../Title';
import NoProductAvailable from '../product/NoProductAvailable';
import BrandList from './BrandList';
import CategoryList from './CategoryList';
import PriceList from './PriceList';

interface Props {
  categories: ICategory[];
  brands: IBrand[];
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get('brand');
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(brandParams || null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters = !!(selectedCategory || selectedBrand || selectedPrice);
  const activeFilterCount = useMemo(
    () => [selectedCategory, selectedBrand, selectedPrice].filter(Boolean).length,
    [selectedCategory, selectedBrand, selectedPrice],
  );

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      let minPrice = 0;
      let maxPrice = 1000000000;

      if (selectedPrice) {
        const [min, max] = selectedPrice.split('-').map(Number);
        minPrice = min;
        maxPrice = max;
      }

      const params: Record<string, any> = {
        minPrice,
        maxPrice,
        sort: 'name',
        order: 'asc',
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (selectedBrand) {
        params.brand = selectedBrand;
      }
      const res = await axiosPublic.get<PaginatedResult<IProduct>>('/products', { params });
      setProducts(res.data);
    } catch (error) {
      console.error('Shop product fetching error', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedBrand, selectedPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeFilterLabels = useMemo(() => {
    return {
      category: selectedCategory
        ? categories?.find((cat) => cat?.slug === selectedCategory)?.title
        : null,
      brand: selectedBrand ? brands?.find((brand) => brand?.slug === selectedBrand)?.name : null,
      price: selectedPrice ? `$${selectedPrice.replace('-', ' - $')}` : null,
    };
  }, [brands, categories, selectedBrand, selectedCategory, selectedPrice]);

  const FilterLists = (
    <>
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <BrandList
        brands={brands}
        setSelectedBrand={setSelectedBrand}
        selectedBrand={selectedBrand}
      />
      <PriceList setSelectedPrice={setSelectedPrice} selectedPrice={selectedPrice} />
    </>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Container className="py-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <Title className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Shop Products
              </Title>
              <p className="text-gray-600 text-sm">
                Discover amazing products tailored to your needs
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
                {activeFilterLabels.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Category: {activeFilterLabels.category}
                  </span>
                )}
                {activeFilterLabels.brand && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Brand: {activeFilterLabels.brand}
                  </span>
                )}
                {activeFilterLabels.price && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Price: {activeFilterLabels.price}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shop_dark_green transition-colors duration-200"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && (
              <span className="ml-2 bg-shop_dark_green text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* <div className="flex flex-col lg:flex-row gap-6" /> */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl max-h-[80vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="divide-y divide-gray-100">{FilterLists}</div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-shop_dark_green text-white py-3 px-4 rounded-lg font-medium hover:bg-shop_dark_green/90 transition-colors duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                </div>
                <div className="divide-y divide-gray-100">{FilterLists}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                      >
                        <div className="aspect-square bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products?.length > 0 ? (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                        {products.length} Product
                        {products.length !== 1 ? 's' : ''} Found
                      </h2>
                      <div className="text-sm text-gray-600">Showing all available products</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                      {products?.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-12">
                    <NoProductAvailable className="bg-transparent" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
