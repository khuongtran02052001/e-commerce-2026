import Container from '@/components/Container';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import WishlistProducts from '@/components/WishlistProducts';
import { Heart } from 'lucide-react';

const WishListPage = async () => {
  return (
    <Container className="py-6">
      <DynamicBreadcrumb />

      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-6 h-6 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">Save your favorite items for later</p>
        </div>
      </div>

      <WishlistProducts />
    </Container>
  );
};

export default WishListPage;
