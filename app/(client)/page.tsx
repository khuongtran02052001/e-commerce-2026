import HomeBanner from '@/components/HomeBanner';
import HomeCategories from '@/components/HomeCategories';
import LatestBlog from '@/components/LatestBlog';
import ProductGrid from '@/components/ProductGrid';
import ShopByBrands from '@/components/ShopByBrands';
import ShopFeatures from '@/components/ShopFeatures';
import { getAllCategories } from '@/repository/categoryApi';
import { getAllProducts } from '@/sanity/queries';

export default async function Home() {
  const categoriesResult = await getAllCategories();
  const categories = categoriesResult.data;
  const productsHydrat = await getAllProducts();
  console.log(categories)
  // Generate structured data
  // const organizationSchema = generateOrganizationSchema();
  // const websiteSchema = generateWebsiteSchema();
  return (
    <div>
      {/* JSON-LD Structured Data */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      /> */}

      <HomeBanner />
      <div className="py-10">
        <ProductGrid data={productsHydrat!} />
        <HomeCategories categories={categories} />
        <ShopFeatures />
        <ShopByBrands />
        <LatestBlog />
      </div>
    </div>
  );
}
