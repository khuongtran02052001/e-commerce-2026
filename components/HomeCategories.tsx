import { ICategory } from '@/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import Container from './Container';
import Title from './Title';

interface Props {
  categories: ICategory[];
}

const HomeCategories = ({ categories }: Props) => {
  return (
    <Container className="mt-16 lg:mt-24">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-shop_light_blue to-shop_dark_blue rounded-full"></div>
          <Title className="text-3xl lg:text-4xl font-bold text-dark-color">
            Shop by skincare needs
          </Title>
          <div className="h-1 w-12 bg-gradient-to-l from-shop_light_blue to-shop_dark_blue rounded-full"></div>
        </div>
        <p className="text-light-color text-lg max-w-2xl mx-auto">
          Khám phá các nhóm sản phẩm dễ chọn cho routine hằng ngày, từ làm sạch đến phục hồi và chống nắng.
        </p>
        <Link
          href={'/category'}
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-shop_light_pink text-shop_dark_green/80 font-semibold rounded-full hover:bg-shop_light_blue hover:text-shop_dark_green border-2 border-shop_light_blue hover:border-shop_dark_green hoverEffect"
        >
          Explore all skincare categories
          <svg
            className="w-4 h-4 hoverEffect group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="rounded-3xl border border-[#dffbf7]/70 bg-gradient-to-br from-white via-[#f8fcff] to-[#fff4fb] p-8 shadow-[0_24px_64px_rgba(127,95,209,0.10)] lg:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories?.map((category, index) => (
            <Link
              key={index}
              href={`/category/${category?.slug}`}
              className="group block cursor-pointer rounded-2xl border border-[#ebe4ff] bg-white/95 p-6 shadow-lg transform hover:-translate-y-2 hover:border-[#8bf4ee] hover:shadow-[0_22px_42px_rgba(127,95,209,0.14)] hoverEffect"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="flex justify-center mb-5">
                {category?.imageUrl && (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-shop_light_pink to-shop_light_bg p-3 group-hover:shadow-lg hoverEffect">
                    <Image
                      src={category?.imageUrl}
                      alt={`${category?.title} category`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-shop_light_blue/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-xl"></div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="text-center space-y-3">
                <h3 className="text-lg font-bold text-dark-color group-hover:text-shop_dark_blue hoverEffect line-clamp-1">
                  {category?.title}
                </h3>

                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-shop_light_blue rounded-full"></div>
                    <span className="text-sm font-semibold text-shop_dark_blue">Explore</span>
                  </div>
                  <span className="text-sm text-light-color">this category</span>
                </div>

                {/* Decorative Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-shop_light_blue to-shop_dark_blue h-2 rounded-full hoverEffect"
                    style={{ width: `${Math.random() * 60 + 40}%` }}
                  ></div>
                </div>

                {/* Shop Now Button */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#eefcff] via-[#f7f2ff] to-[#fff1f8] px-4 py-2 text-sm font-medium text-[#6f57a8] group-hover:from-[#8bf4ee] group-hover:to-[#ee45f9] group-hover:text-white hoverEffect">
                  Build my routine
                  <svg
                    className="w-3 h-3 hoverEffect group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-shop_light_blue/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-shop_dark_blue">{categories?.length}+</div>
            <div className="text-sm text-light-color">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-shop_dark_blue">1000+</div>
            <div className="text-sm text-light-color">Skincare picks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-shop_dark_blue">Daily</div>
            <div className="text-sm text-light-color">Routine inspiration</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-shop_light_pink to-shop_light_bg rounded-2xl border border-shop_light_blue/20">
            <div className="w-2 h-2 bg-shop_light_blue rounded-full animate-pulse"></div>
            <span className="text-dark-text font-medium">
              Find the right category for your skin goals
            </span>
            <div className="w-2 h-2 bg-shop_light_blue rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomeCategories;
