import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Props {
  className?: string;
  variant?: 'default' | 'sm';
}

const Logo = ({ className, variant = 'default' }: Props) => {
  // Small variant for footer
  if (variant === 'sm') {
    return (
      <Link href={'/'}>
        <div className={cn('flex items-center gap-1.5 group hoverEffect', className)}>
          <div className="relative rounded-full bg-gradient-to-br from-[#8bf4ee] via-[#d9f7ff] to-[#ee45f9] p-1.5 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>

          <div className="flex items-center">
            <h1 className="text-sm font-black tracking-[0.18em] font-sans uppercase">
              <span className="bg-gradient-to-r from-[#6f57a8] via-[#8f6bd9] to-[#ee45f9] bg-clip-text text-transparent">
                Lumière
              </span>
            </h1>

            {/* Decorative Elements (smaller) */}
            <div className="ml-0.5 flex flex-col gap-0.5">
              <div className="w-0.5 h-0.5 bg-shop_orange rounded-full group-hover:bg-shop_light_green hoverEffect"></div>
              <div className="w-0.5 h-0.5 bg-shop_light_green rounded-full group-hover:bg-shop_orange hoverEffect"></div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default full logo
  return (
    <Link href={'/'}>
      <div className={cn('flex items-center gap-2.5 group hoverEffect', className)}>
        <div className="rounded-full bg-gradient-to-br from-[#8bf4ee] via-[#d9f7ff] to-[#ee45f9] p-2 shadow-md shadow-[#cbbef5]/40">
          <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>

        <div className="flex items-center">
          <h1 className="bg-gradient-to-r from-[#6f57a8] via-[#8f6bd9] to-[#ee45f9] bg-clip-text text-2xl font-black uppercase tracking-[0.22em] text-transparent font-sans">
            Lumière
          </h1>
          <div className="ml-1.5 flex flex-col gap-1">
            <div className="h-1 w-1 rounded-full bg-[#ee45f9]"></div>
            <div className="h-1 w-1 rounded-full bg-[#8bf4ee]"></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
