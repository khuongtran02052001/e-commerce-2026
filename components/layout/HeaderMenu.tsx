'use client';
import { headerData } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden w-full items-center justify-center gap-1.5 text-sm font-semibold capitalize text-light-color lg:inline-flex xl:gap-3">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`relative rounded-full px-3 py-2 text-[15px] tracking-[0.01em] transition-all duration-200 hover:bg-shop_light_pink/70 hover:text-shop_dark_green xl:px-4 ${
            pathname === item?.href
              ? 'bg-shop_light_pink/85 text-shop_dark_green shadow-[0_10px_24px_rgba(201,124,167,0.16)]'
              : 'text-light-color'
          }`}
        >
          {item?.title}
          <span
            className={`absolute bottom-1 left-1/2 h-px -translate-x-1/2 bg-shop_light_green/80 transition-all duration-200 ${
              pathname === item?.href ? 'w-8' : 'w-0'
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
