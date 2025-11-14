'use client';
import { cn } from '@/lib/utils';
import { IProductMock } from '@/mock-data';
import useCartStore from '@/store';
import _ from 'lodash';
import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const ProductSideMenu = ({ product, className }: { product: IProductMock; className?: string }) => {
  const { favoriteProduct, addToFavorite } = useCartStore();
  const [existingProduct, setExistingProduct] = useState<IProductMock | null>(null);

  useEffect(() => {
    const availableItem = _.find(favoriteProduct, (item) => item?.id === product?.id);
    setExistingProduct(availableItem || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?.id) {
      addToFavorite(product).then(() => {
        toast.success(existingProduct ? 'Removed from wishlist' : 'Added to wishlist', {
          description: existingProduct
            ? 'Product removed successfully!'
            : 'Product added successfully!',
          duration: 3000,
        });
      });
    }
  };
  return (
    <div className={cn('absolute top-2 right-2', className)}>
      <div
        onClick={handleFavorite}
        className={`p-2.5 rounded-full hover:bg-shop_dark_green/80 hover:text-white hoverEffect ${existingProduct ? 'bg-shop_dark_green/80 text-white' : 'bg-product-bg'}`}
      >
        <Heart size={15} />
      </div>
    </div>
  );
};

export default ProductSideMenu;
