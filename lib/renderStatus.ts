type StatusDisplay = {
  style: string;
  text: string;
};

const DEFAULT_STATUS_STYLE =
  'border border-shop_light_green/20 bg-white text-dark-color shadow-sm';

const STATUS_DISPLAY_MAP: Record<string, StatusDisplay> = {
  completed: {
    style: 'border border-shop_light_green/25 bg-shop_light_pink/80 text-shop_dark_green',
    text: 'Completed',
  },
  delivered: {
    style: 'border border-shop_light_green/25 bg-shop_light_pink/80 text-shop_dark_green',
    text: 'Delivered',
  },
  out_for_delivery: {
    style: 'border border-shop_dark_blue/15 bg-shop_light_blue/55 text-shop_dark_blue',
    text: 'Out for Delivery',
  },
  ready_for_delivery: {
    style: 'border border-shop_dark_blue/12 bg-[#f5edfb] text-[#7d6698]',
    text: 'Ready for Delivery',
  },
  packed: {
    style: 'border border-shop_light_green/18 bg-[#faedf4] text-[#92527a]',
    text: 'Packed',
  },
  order_confirmed: {
    style: 'border border-shop_light_green/18 bg-[#fdeaf4] text-[#9b3864]',
    text: 'Order Confirmed',
  },
  address_confirmed: {
    style: 'border border-[#efc9dc] bg-[#fff2f8] text-[#b1648b]',
    text: 'Address Confirmed',
  },
  pending: {
    style: 'border border-[#f1d8e5] bg-[#fff7fb] text-[#ae6d95]',
    text: 'Pending',
  },
  processing: {
    style: 'border border-shop_light_blue/40 bg-shop_light_blue/45 text-shop_dark_blue',
    text: 'Processing',
  },
  shipped: {
    style: 'border border-shop_light_blue/40 bg-shop_light_blue/50 text-shop_dark_blue',
    text: 'Shipped',
  },
  cancelled: {
    style: 'border border-[#edc5d4] bg-[#fdeef4] text-[#b35c78]',
    text: 'Cancelled',
  },
  refunded: {
    style: 'border border-[#ead7f3] bg-[#f7effb] text-[#8d5da7]',
    text: 'Refunded',
  },
  failed: {
    style: 'border border-[#edc5d4] bg-[#fdeef4] text-[#b35c78]',
    text: 'Failed',
  },
  failed_delivery: {
    style: 'border border-[#edc5d4] bg-[#fdeef4] text-[#b35c78]',
    text: 'Failed Delivery',
  },
  rescheduled: {
    style: 'border border-[#f0d7e5] bg-[#fff3f9] text-[#b16f91]',
    text: 'Rescheduled',
  },
};

export const formatStatusText = (status: string) =>
  (status || 'Unknown')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const getStatusBadgeClass = (status: string) =>
  STATUS_DISPLAY_MAP[(status || '').toLowerCase()]?.style || DEFAULT_STATUS_STYLE;

export const getStatusColor = (status: string): StatusDisplay => {
  const normalized = (status || '').toLowerCase();
  const statusDisplay = STATUS_DISPLAY_MAP[normalized];

  return (
    statusDisplay || {
      style: DEFAULT_STATUS_STYLE,
      text: formatStatusText(status),
    }
  );
};
