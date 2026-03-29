import { IProduct } from '@/mock-data';
import { StarIcon } from '@sanity/icons';
import { Flame, Star } from 'lucide-react';
import Link from 'next/link';
import { JSX, memo } from 'react';
import AddToCartButton from './AddToCartButton';
import PriceView from './PriceView';
import ProductImage from './ProductImage';
import ProductSideMenu from './ProductSideMenu';
import Title from './Title';

const ProductCard = memo(({ product }: { product: IProduct }) => {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#e7dcff] bg-white/95 text-sm shadow-[0_16px_40px_rgba(127,95,209,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(127,95,209,0.16)]">
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#f5fbff] to-[#fff1f8]">
        {product?.images && (
          <Link href={`/product/${product?.slug}`}>
            <ProductImage
              src={product.images?.[0]?.url}
              alt={product.name}
              className={`
    w-full h-64
    object-cover
    bg-shop_light_bg
    transition-transform duration-500
    ${product.stock !== 0 ? 'group-hover:scale-105' : 'opacity-50'}
  `}
            />

            {/* <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            /> */}
          </Link>
        )}
        <ProductSideMenu product={product} />
        <ProductStatusBadge status={product.status} slug={product.slug} />
      </div>
      <div className="p-3 flex flex-col gap-2">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-light-text">
            {product.categories.map((cat) => cat.title).join(', ')}
          </p>
        )}
        <Title className="line-clamp-2 min-h-10 text-sm leading-5 text-[#332d4a] transition-colors duration-300 group-hover:text-[#7f5fd1]">
          {product?.name}
        </Title>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={
                  index < Math.round(product?.averageRating || 0)
                    ? 'text-[#ee45f9]'
                    : ' text-light-text'
                }
                fill={index < Math.round(product?.averageRating || 0) ? '#ee45f9' : '#d6cfe5'}
              />
            ))}
          </div>
          <p className="text-light-text text-xs tracking-wide">
            {product?.totalReviews
              ? `${product.totalReviews} ${product.totalReviews === 1 ? 'Review' : 'Reviews'}`
              : 'No Reviews'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <p className="font-medium text-[#6f6a86]">In Stock</p>
          <p
            className={`${
              product?.stock === 0 ? 'text-rose-500' : 'font-semibold text-[#6f57a8]'
            }`}
          >
            {(product?.stock as number) > 0 ? product?.stock : 'unavailable'}
          </p>
        </div>

        <PriceView price={product?.price} discount={product?.discount} className="text-sm" />
        <AddToCartButton product={product} className="w-36 rounded-full" />
      </div>
    </div>
  );
});

type ProductStatus =
  | 'SALE'
  | 'NEW'
  | 'HOT'
  | 'FEATURED'
  | 'PREORDER'
  | 'OUT_OF_STOCK'
  | 'DISCONTINUED';

const STATUS_UI: Record<
  ProductStatus,
  | { kind: 'label'; text: string; className: string }
  | { kind: 'iconLink'; ariaLabel: string; className: string; icon: JSX.Element }
> = {
  SALE: {
    kind: 'label',
    text: 'Sale!',
    className:
      'rounded-full border border-[#f7b9d8]/70 bg-white/90 px-2 py-0.5 text-xs text-[#8d4ea2] ' +
      'group-hover:border-[#ee45f9]/40 group-hover:text-[#6f57a8] hoverEffect',
  },

  NEW: {
    kind: 'label',
    text: 'New',
    className:
      'text-xs border border-emerald-500/40 text-emerald-600 px-2 py-0.5 rounded-full ' +
      'group-hover:border-emerald-500 group-hover:text-emerald-700 hoverEffect',
  },

  HOT: {
    kind: 'iconLink',
    ariaLabel: 'Hot deal',
    className:
      'absolute top-2 left-2 z-10 rounded-full border border-[#ffd7eb] bg-white/90 p-1 shadow-sm group-hover:border-[#ee45f9]/40 hoverEffect',
    icon: (
      <Flame size={18} fill="#ee45f9" className="text-[#ee45f9] hoverEffect" />
    ),
  },

  FEATURED: {
    kind: 'iconLink',
    ariaLabel: 'Featured',
    className:
      'absolute top-2 left-2 z-10 border border-indigo-500/40 p-1 rounded-full ' +
      'group-hover:border-indigo-500 hoverEffect',
    icon: (
      <Star
        size={18}
        className="text-indigo-500/70 group-hover:text-indigo-500 hoverEffect"
        fill="currentColor"
      />
    ),
  },

  PREORDER: {
    kind: 'label',
    text: 'Pre-order',
    className:
      'text-xs border border-sky-500/40 text-sky-600 px-2 py-0.5 rounded-full ' +
      'group-hover:border-sky-500 group-hover:text-sky-700 hoverEffect',
  },

  OUT_OF_STOCK: {
    kind: 'label',
    text: 'Out of stock',
    className:
      'text-xs border border-gray-400/50 text-gray-500 px-2 py-0.5 rounded-full ' +
      'opacity-90 group-hover:border-gray-400 hoverEffect',
  },

  DISCONTINUED: {
    kind: 'label',
    text: 'Discontinued',
    className:
      'text-xs border border-rose-500/40 text-rose-600 px-2 py-0.5 rounded-full ' +
      'group-hover:border-rose-500 group-hover:text-rose-700 hoverEffect',
  },
};

export function ProductStatusBadge({ slug, status }: { slug: string; status?: string }) {
  const s = status as ProductStatus | undefined;
  if (!s || !(s in STATUS_UI)) return null;

  const ui = STATUS_UI[s];
  return (
    <div className="absolute top-2 left-2 z-10">
      {ui.kind === 'label' ? (
        <Link href={`/product/${slug}`}>
          <p className={ui.className}>{ui.text}</p>
        </Link>
      ) : (
        <Link
          href={s === 'HOT' ? `/deal` : `/product/${slug}`}
          aria-label={ui.ariaLabel}
          className={ui.className}
        >
          {ui.icon}
        </Link>
      )}
    </div>
  );
}

ProductCard.displayName = 'ProductCard';

export default ProductCard;
