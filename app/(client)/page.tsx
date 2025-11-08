import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import ShopFeatures from "@/components/ShopFeatures";
// import { getCategories } from "@/sanity/queries";
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import { mockCategories } from "@/mock-data";

export default async function Home() {
  // const categories = await mockCategories(8);
  const categories = mockCategories;

  // Generate structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <div>
      {/* JSON-LD Structured Data */}
      <script
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
      />

      <HomeBanner />
      <div className="py-10">
        <ProductGrid />
        <HomeCategories categories={categories} />
        <ShopFeatures />
        <ShopByBrands />
        <LatestBlog />
      </div>
    </div>
  );
}
