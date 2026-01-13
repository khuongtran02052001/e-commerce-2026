const USD_LOCALE = 'en-US';

const currencyFormatter = new Intl.NumberFormat(USD_LOCALE, {
  style: 'currency',
  currency: 'USD',
});

const compactNumberFormatter = new Intl.NumberFormat(USD_LOCALE, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount);
};

export const formatCompactUSD = (value: number): string => {
  const abs = Math.abs(value);

  if (abs < 1_000) {
    return formatCurrency(value);
  }

  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}$${compactNumberFormatter.format(abs / 1_000_000_000)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${compactNumberFormatter.format(abs / 1_000_000)}M`;
  }

  return `${sign}$${compactNumberFormatter.format(abs / 1_000)}K`;
};
