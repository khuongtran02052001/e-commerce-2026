'use client';

import QuantityButtons from '@/components/QuantityButtons';
import { Button } from '@/components/ui/button';
import { IProductMock } from '@/mock-data';
import useCartStore from '@/store';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CartItemControlsProps {
  product: IProductMock;
}

export function CartItemControls({ product }: CartItemControlsProps) {
  const { deleteCartProduct } = useCartStore();

  const handleRemove = () => {
    deleteCartProduct(product.id);
    toast.success('Item removed from cart');
  };

  return (
    <div className="flex items-center gap-4">
      <QuantityButtons product={product} />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
