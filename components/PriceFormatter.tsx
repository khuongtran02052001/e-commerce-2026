import { formatCompactUSD } from '@/lib/formatCurrency';
import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  amount?: number;
  className?: string;
  compact?: boolean; // grid
  showDecimals?: boolean; // checkout
}

const PriceFormatter = memo(
  ({ amount = 0, className, compact = false, showDecimals = false }: Props) => {
    const value = Number(amount) || 0;

    const full = value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });

    const compactValue = formatCompactUSD(value);

    return (
      <p title={full} className={twMerge('text-sm font-semibold text-dark-color', className)}>
        {compact ? compactValue : full}
      </p>
    );
  },
);

PriceFormatter.displayName = 'PriceFormatter';

export default PriceFormatter;
