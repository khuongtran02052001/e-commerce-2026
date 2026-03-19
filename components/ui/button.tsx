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
          'bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(139,76,114,0.18)] hover:bg-primary/92 hover:shadow-[0_16px_34px_rgba(139,76,114,0.22)]',
        destructive:
          'bg-[#cf6f93] text-white shadow-[0_12px_28px_rgba(207,111,147,0.18)] hover:bg-[#c66086] hover:shadow-[0_14px_30px_rgba(207,111,147,0.22)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-shop_light_green/25 bg-white/90 text-foreground shadow-xs hover:border-shop_light_green/40 hover:bg-shop_light_pink/70 hover:text-shop_dark_green dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-shop_light_pink/80 text-shop_dark_green shadow-[0_10px_24px_rgba(201,124,167,0.12)] hover:bg-shop_light_pink',
        ghost: 'hover:bg-shop_light_pink/70 hover:text-shop_dark_green dark:hover:bg-accent/50',
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
