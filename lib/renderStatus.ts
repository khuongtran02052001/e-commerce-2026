export const getStatusColor = (status: string): { style: string; text: string } => {
  switch ((status || '').toLowerCase()) {
    case 'completed':
      return { style: 'bg-green-100 text-green-800', text: 'Completed' };
    case 'delivered':
      return { style: 'bg-green-100 text-green-800', text: 'Delivered' };
    case 'out_for_delivery':
      return { style: 'bg-blue-100 text-blue-800', text: 'Out for Delivery' };
    case 'ready_for_delivery':
      return { style: 'bg-cyan-100 text-cyan-800', text: 'Ready for Delivery' };
    case 'packed':
      return { style: 'bg-purple-100 text-purple-800', text: 'Packed' };
    case 'order_confirmed':
      return { style: 'bg-emerald-100 text-emerald-800', text: 'Order Confirmed' };
    case 'address_confirmed':
      return { style: 'bg-yellow-100 text-yellow-800', text: 'Address Confirmed' };
    case 'pending':
      return { style: 'bg-orange-100 text-orange-800', text: 'Pending' };
    case 'processing':
      return { style: 'bg-cyan-100 text-cyan-800', text: 'Processing' };
    case 'shipped':
      return { style: 'bg-indigo-100 text-indigo-800', text: 'Shipped' };
    case 'cancelled':
      return { style: 'bg-red-100 text-red-800', text: 'Cancelled' };
    case 'refunded':
      return { style: 'bg-purple-100 text-purple-800', text: 'Refunded' };
    case 'failed':
      return { style: 'bg-rose-100 text-rose-800', text: 'Failed' };
    case 'failed_delivery':
      return { style: 'bg-red-100 text-red-800', text: 'Failed Delivery' };
    case 'rescheduled':
      return { style: 'bg-amber-100 text-amber-800', text: 'Rescheduled' };
    default:
      return {
        style: 'bg-gray-100 text-gray-800',
        text: (status || 'Unknown')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (char) => char.toUpperCase()),
      };
  }
};

