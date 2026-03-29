'use client';
import { headerData } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div
      data-tour="header-navigation"
      className="hidden w-full items-center justify-center gap-1.5 text-sm font-semibold capitalize text-light-color lg:inline-flex xl:gap-3"
    >
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`relative rounded-full px-3 py-2 text-[15px] tracking-[0.01em] transition-all duration-200 hover:bg-[#f6f2ff] hover:text-[#6f57a8] xl:px-4 ${
            pathname === item?.href
              ? 'bg-gradient-to-r from-[#e9fffc] via-[#f7f2ff] to-[#ffeef7] text-[#6f57a8] shadow-[0_10px_24px_rgba(127,95,209,0.14)]'
              : 'text-light-color'
          }`}
        >
          {item?.title}
          <span
            className={`absolute bottom-1 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-[#8bf4ee] to-[#ee45f9] transition-all duration-200 ${
              pathname === item?.href ? 'w-8' : 'w-0'
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
