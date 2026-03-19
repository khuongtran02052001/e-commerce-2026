import Container from '@/components/Container';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import WishlistProducts from '@/components/WishlistProducts';
import { Heart } from 'lucide-react';

const WishListPage = async () => {
  return (
    <Container className="py-6">
      <DynamicBreadcrumb />

      <div className="mb-8 flex items-center gap-2">
        <Heart className="h-6 w-6 text-shop_dark_green" />
        <div>
          <h1 className="text-3xl font-bold text-dark-color">My Wishlist</h1>
          <p className="mt-1 text-dark-text">Save your favorite items for later</p>
        </div>
      </div>

      <WishlistProducts />
    </Container>
  );
};

export default WishListPage;
