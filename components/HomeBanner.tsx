import { banner_1 } from '@/images';
import { ShoppingBag, Star, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Container from './Container';
import Title from './Title';

const HomeBanner = async () => {
  return (
    <div className="overflow-hidden">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#dffff8] via-[#fff7fb] to-[#f4e8ff] py-8 shadow-[0_24px_80px_rgba(127,95,209,0.18)] md:py-12">
        <Container>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-shop_light_green/20 to-transparent rounded-full animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-shop_dark_green/10 to-transparent rounded-full animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-shop_light_green/30 rounded-full animate-ping delay-500"></div>
            <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-orange-300/40 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm animate-fadeInUp">
                  <Zap className="h-4 w-4 animate-pulse text-[#ee45f9]" />
                  <span className="text-sm font-semibold text-[#6f57a8]">Skincare picks for every routine</span>
                  <div className="h-2 w-2 rounded-full bg-[#8bf4ee] animate-ping"></div>
                </div>
              </div>

              {/* Main Title */}
              <div className="space-y-4">
                <Title className="animate-fadeInUp delay-200 text-4xl font-bold leading-tight text-[#332d4a] sm:text-5xl">
                  <span className="block">Healthy-looking skin</span>
                  <span className="block bg-gradient-to-r from-[#8bf4ee] via-[#8f6bd9] to-[#ee45f9] bg-clip-text text-transparent animate-shimmer">
                    starts with a calmer routine
                  </span>
                  <span className="block text-2xl font-medium text-[#6f6a86]">
                    serum, sunscreen and daily care chosen for real skin needs
                  </span>
                </Title>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 animate-fadeInUp delay-400">
                {[
                  {
                    icon: Star,
                    text: 'Routine-friendly picks',
                    color: 'text-[#ee45f9]',
                  },
                  {
                    icon: TrendingUp,
                    text: 'Best sellers for skincare lovers',
                    color: 'text-[#7f5fd1]',
                  },
                  {
                    icon: ShoppingBag,
                    text: 'Gentle care, everyday essentials',
                    color: 'text-[#42cfc8]',
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-white/20 hover:bg-white/90 transition-all duration-300 hover:scale-105"
                  >
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fadeInUp delay-600">
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#8bf4ee] via-[#c5b7ff] to-[#ee45f9] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ee45f9] via-[#c5b7ff] to-[#8bf4ee] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <span className="relative z-10 flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 group-hover:animate-bounce" />
                    Shop skincare now
                  </span>
                  <div className="absolute inset-0 -top-40 -left-10 h-40 w-6 rotate-12 bg-white/20 transition-all duration-700 group-hover:left-full"></div>
                </Link>

                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-3 rounded-xl border-2 border-[#d8ccff] bg-white/80 px-8 py-4 text-base font-semibold text-[#6f57a8] shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#8bf4ee] hover:shadow-lg"
                >
                  <Zap className="h-5 w-5 text-[#ee45f9] group-hover:animate-pulse" />
                  Read skincare tips
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 animate-fadeInUp delay-800">
                {[
                  { value: '10K+', label: 'Skincare lovers' },
                  { value: '4.9★', label: 'Routine favorites' },
                  { value: 'Daily', label: 'Beauty journal updates' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-shop_dark_green">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-shrink-0 relative">
              <div className="relative animate-float">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-shop_light_green/20 to-orange-300/20 rounded-full blur-3xl scale-110 animate-pulse"></div>

                {/* Main Image */}
                <Image
                  src={banner_1}
                  alt="Skincare hero banner"
                  className="relative z-10 w-80 sm:w-96 h-fit lg:w-[400px] xl:w-[480px] drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  priority
                />

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm animate-bounce delay-300">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#6f57a8]">
                    <Star className="h-4 w-4 text-[#ee45f9]" />
                    Editor&apos;s pick
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 rounded-2xl bg-gradient-to-br from-[#8bf4ee] to-[#8f6bd9] px-4 py-3 shadow-lg animate-bounce delay-1000">
                  <div className="text-center text-white">
                    <p className="text-xs uppercase tracking-[0.18em] opacity-90">Daily SPF</p>
                    <p className="text-sm font-bold">Routine staple</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HomeBanner;
