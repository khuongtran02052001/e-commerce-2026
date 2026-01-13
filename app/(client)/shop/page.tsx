import Shop from '@/components/shopPage/Shop';
import { getAllBrands, getCategories } from '@/sanity/queries';
// import { getAllBrands, getCategories } from "@/sanity/queries";
import { Suspense } from 'react';

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();

  if (!categories || !brands) {
    return <div>Failed to load data</div>;
  }


  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<div className="min-h-96 bg-gray-50 animate-pulse rounded-lg" />}>
        <Shop categories={categories} brands={brands} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
