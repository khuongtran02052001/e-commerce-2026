import Shop from '@/components/shopPage/Shop';
import { mockBrands, mockCategories } from '@/mock-data';
// import { getAllBrands, getCategories } from "@/sanity/queries";
import { Suspense } from 'react';

const ShopPage = async () => {
  // const categories = await getCategories();
  // const brands = await getAllBrands();
  const categories = mockCategories;
  const brands = mockBrands;
  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<div className="min-h-96 bg-gray-50 animate-pulse rounded-lg" />}>
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
