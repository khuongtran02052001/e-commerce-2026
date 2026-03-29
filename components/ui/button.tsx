import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#8bf4ee] via-[#c5b7ff] to-[#ee45f9] text-white shadow-[0_16px_36px_rgba(127,95,209,0.22)] hover:brightness-[1.03] hover:shadow-[0_18px_40px_rgba(127,95,209,0.28)]',
        destructive:
          'bg-[#ff5b93] text-white shadow-[0_12px_28px_rgba(255,91,147,0.18)] hover:bg-[#f24f89] hover:shadow-[0_14px_30px_rgba(255,91,147,0.22)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-[#d8ccff] bg-white/90 text-foreground shadow-xs hover:border-[#8bf4ee] hover:bg-[#f7f3ff] hover:text-[#6f57a8] dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-[#f4efff] text-[#6f57a8] shadow-[0_10px_24px_rgba(139,116,213,0.12)] hover:bg-[#ece4ff]',
        ghost: 'hover:bg-[#f6f2ff] hover:text-[#6f57a8] dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
