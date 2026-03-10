import HomeBanner from '@/components/HomeBanner';
import HomeCategories from '@/components/HomeCategories';
import LatestBlog from '@/components/LatestBlog';
import ProductGrid from '@/components/ProductGrid';
import ShopByBrands from '@/components/ShopByBrands';
import ShopFeatures from '@/components/ShopFeatures';
import { getAllProducts, getCategories } from '@/data/server';

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);
  const safeCategories = categories || [];
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
        <ProductGrid data={products!} />
        <HomeCategories categories={safeCategories} />
        <ShopFeatures />
        <ShopByBrands />
        <LatestBlog />
      </div>
    </div>
  );
}
