'use client';

import { useUserData } from '@/contexts/UserDataContext';
import { fetchServiceJson } from '@/lib/restClient';
import { cn } from '@/lib/utils';
import type { ICategory, IProduct } from '@/mock-data';
import type { Product } from '@/types/common-type';
import { AlertTriangle, Heart, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import AddToCartButton from './AddToCartButton';
import Container from './Container';
import NoAccessToCart from './NoAccessToCart';
import PriceFormatter from './PriceFormatter';
import WishlistSkeleton from './WishlistSkeleton';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type WishlistResponse =
  | { data?: Array<Product | { product?: Product }> }
  | Array<Product | { product?: Product }>;

const normalizeWishlist = (payload: WishlistResponse | null | undefined) => {
  if (!payload) return [];
  const list = Array.isArray(payload) ? payload : payload.data || [];
  return list.map((item) =>
    item && typeof item === 'object' && 'product' in item ? (item.product ?? item) : item,
  );
};

const toIProduct = (product: Product): IProduct => {
  const images = (product.images || [])
    .map((img, idx) => ({
      id: img.id || `${product.id}-img-${idx}`,
      url: img.url || '',
      alt: img.alt || product.name || 'Product image',
    }))
    .filter((img) => img.url);

  const categories: ICategory[] = [];
  const rawCategories = (product as any).categories;
  if (Array.isArray(rawCategories)) {
    for (const category of rawCategories) {
      if (typeof category === 'string') {
        categories.push({ id: category, title: category, slug: category });
      } else if (category && typeof category === 'object') {
        categories.push({
          id: category.id || category.slug || category.title || '',
          title: category.title || category.name || '',
          slug: category.slug || '',
          description: category.description,
          range: category.range,
          featured: category.featured,
          imageUrl: category.imageUrl,
        });
      }
    }
  }

  return {
    id: product.id,
    name: product.name || '',
    slug: product.slug || '',
    images,
    description: product.description || undefined,
    price: product.price ?? 0,
    discount: product.discount ?? undefined,
    categories,
    stock: product.stock ?? undefined,
    isFeatured: product.isFeatured ?? undefined,
    averageRating: product.averageRating ?? undefined,
    totalReviews: product.totalReviews ?? undefined,
    ratingDistribution: product.ratingDistribution as any,
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
  };
};

const resolveImageUrl = (product: IProduct) => {
  if (product.images && product.images.length > 0) {
    const first = product.images[0];
    if (first?.url) return first.url;
  }
  return '/placeholder.jpg';
};

const WishlistProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authUser, authReady, isLoading: isAuthLoading, isAuthenticated } = useUserData();

  const loadWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!authUser?.id) {
        setWishlist([]);
        return;
      }
      const payload = await fetchServiceJson<WishlistResponse>(`/users/${authUser.id}/wishlist`);
      const products = normalizeWishlist(payload).filter(Boolean) as Product[];
      setWishlist(products.map(toIProduct));
    } catch {
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 8, wishlist.length));
  };

  const handleResetFavorite = () => {
    setShowDeleteModal(true);
  };

  const confirmResetFavorite = async () => {
    if (!authUser?.id) return;
    try {
      await Promise.all(
        wishlist.map((product) =>
          fetchServiceJson<void>(`/users/${authUser?.id}/wishlist/${product.id}`, {
            method: 'DELETE',
          }),
        ),
      );
      setWishlist([]);
      setShowDeleteModal(false);
      toast.success('All products removed from wishlist');
    } catch {
      toast.error('Failed to clear wishlist');
    }
  };

  const wishlistSlice = useMemo(
    () => wishlist.slice(0, visibleProducts),
    [wishlist, visibleProducts],
  );

  if (!authReady || isAuthLoading || isLoading) {
    return <WishlistSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <NoAccessToCart details="Log in to save and view your favorite products. Don't miss out on the items you love!" />
    );
  }

  return (
    <Container className="my-10">
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading wishlist...</div>
      ) : wishlist.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistSlice.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col gap-4 relative group hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={async () => {
                    if (!authUser?.id) return;
                    try {
                      await fetchServiceJson<void>(
                        `/users/${authUser?.id}/wishlist/${product.id}`,
                        {
                          method: 'DELETE',
                        },
                      );
                      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
                      toast.success('Product removed from wishlist');
                    } catch {
                      toast.error('Failed to remove from wishlist');
                    }
                  }}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-red-50 hover:text-red-600 transition-all duration-200 shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <X size={16} />
                </button>

                <Link
                  href={{
                    pathname: `/product/${product.slug}`,
                    query: { id: product.id },
                  }}
                  className="block rounded-lg overflow-hidden bg-gray-50"
                >
                  <Image
                    src={resolveImageUrl(product)}
                    alt={product.name || 'Product'}
                    width={200}
                    height={200}
                    className={cn(
                      'w-full h-48 object-contain group-hover:scale-105 transition-transform duration-200',
                      product.stock === 0 ? 'opacity-50' : '',
                    )}
                  />
                </Link>

                <div className="flex flex-col gap-2 flex-1">
                  <Link
                    href={{
                      pathname: `/product/${product.slug}`,
                      query: { id: product.id },
                    }}
                  >
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight hover:text-shop_dark_green transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {product.categories && product.categories.length > 0 && (
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {product.categories
                        .slice(0, 2)
                        .map((cat) => cat.title)
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        product.stock && product.stock > 0
                          ? 'text-green-700 bg-green-100'
                          : 'text-red-700 bg-red-100',
                      )}
                    >
                      {product.stock && product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-col">
                      <PriceFormatter
                        amount={product.price}
                        className="text-lg font-bold text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <AddToCartButton
                      product={product}
                      className="w-full h-10 text-sm font-semibold rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {visibleProducts < wishlist.length && (
            <div className="mt-8 text-center">
              <Button
                onClick={loadMore}
                variant="outline"
                className="hover:bg-shop_dark_green hover:text-white hover:border-shop_dark_green font-semibold px-8 py-2"
              >
                Load More Products
              </Button>
            </div>
          )}
          {visibleProducts > 8 && (
            <div className="mt-4 text-center">
              <Button
                onClick={() => setVisibleProducts(8)}
                variant="ghost"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Show Less
              </Button>
            </div>
          )}
          {wishlist.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={handleResetFavorite}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 font-semibold px-6 py-2"
              >
                Clear Wishlist
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-red-100" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-400" />
            <Heart className="h-16 w-16 text-muted-foreground/60" strokeWidth={1} />
          </div>
          <div className="space-y-3 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Your wishlist is empty
            </h2>
            <p className="text-lg text-muted-foreground">Save products you love for later</p>
            <p className="text-sm text-muted-foreground/80 leading-relaxed">
              Add items to your wishlist by clicking the heart icon on any product. You can easily
              move them to your cart when you're ready to purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mt-8">
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50">
              <Heart className="h-8 w-8 text-red-400" />
              <h3 className="font-semibold text-sm">Save Favorites</h3>
              <p className="text-xs text-muted-foreground text-center">
                Keep track of products you love
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">🛍️</span>
              </div>
              <h3 className="font-semibold text-sm">Easy Shopping</h3>
              <p className="text-xs text-muted-foreground text-center">
                Quick add to cart from wishlist
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">⚡</span>
              </div>
              <h3 className="font-semibold text-sm">Smart Alerts</h3>
              <p className="text-xs text-muted-foreground text-center">
                Get notified about price drops
              </p>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">Clear Wishlist?</DialogTitle>
            <DialogDescription className="text-gray-600">
              This will remove all products from your wishlist. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmResetFavorite} className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Wishlist
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default WishlistProducts;
