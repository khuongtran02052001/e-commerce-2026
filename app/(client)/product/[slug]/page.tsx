import ProductContent from '@/components/ProductContent';
import { getBrand, getProductBySlug, getRelatedProducts } from '@/data/server';
import {
  generateBreadcrumbSchema,
  generateProductMetadata,
  generateProductSchema,
} from '@/lib/seo';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: "The product you're looking for could not be found.",
    };
  }

  // Fetch brand data if needed
  const brand = await getBrand(slug);
  const productWithBrand = { ...product, brand };

  return generateProductMetadata(productWithBrand);
}

const ProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <div>
      <ProductPageContent slug={slug} />
    </div>
  );
};

const ProductPageContent = async ({ slug }: { slug: string }) => {
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  // Fetch related data on the server side
  const categoryIds =
    product?.categories
      ?.map((cat: { id?: string; slug?: string; _ref?: string }) => cat.id || cat.slug || cat._ref)
      .filter((value): value is string => Boolean(value)) || [];

  const [relatedProducts] = await Promise.all([
    getRelatedProducts(categoryIds, product.brand?.slug!, 4),
  ]);

  // Convert null values to undefined for TypeScript compatibility
  const productWithReviews = {
    ...product,
    averageRating: product.averageRating ?? undefined,
    totalReviews: product.totalReviews ?? undefined,
  };

  const productWithBrand = { ...productWithReviews, brand: product.brand };
  // Generate structured data
  const productSchema = generateProductSchema(productWithBrand);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: productWithReviews.name || 'Product', url: `/product/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <ProductContent
        product={productWithReviews}
        relatedProducts={relatedProducts || []}
        brand={product.brand ? product.brand : null}
      />
    </>
  );
};

export default ProductPage;
