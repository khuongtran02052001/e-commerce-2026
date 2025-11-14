import Container from '@/components/Container';
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb';
import NoAccessToCart from '@/components/NoAccessToCart';
import WishlistProducts from '@/components/WishlistProducts';
import { currentUser } from '@clerk/nextjs/server';
import { Heart } from 'lucide-react';

const WishListPage = async () => {
  const user = await currentUser();

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <DynamicBreadcrumb />

      {/* Page Header */}
      <div className="flex items-center gap-2 mb-8">
        <Heart className="w-6 h-6 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">Save your favorite items for later</p>
        </div>
      </div>

      {/* Content */}
      {user ? (
        <WishlistProducts />
      ) : (
        <NoAccessToCart details="Log in to save and view your favorite products. Don't miss out on the items you love!" />
      )}
    </Container>
  );
};

export default WishListPage;
