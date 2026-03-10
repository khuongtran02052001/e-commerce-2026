import Shop from '@/components/shopPage/Shop';
import { getAllBrands, getCategories } from '@/data/server';
// import { getAllBrands, getCategories } from "@/sanity/queries";

const ShopPage = async () => {
  const [categories, brands] = await Promise.all([getCategories(), getAllBrands()]);
  if (!categories || !brands) {
    return <div>Failed to load data</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <Shop categories={categories} brands={brands} />
    </div>
  );
};

export default ShopPage;
