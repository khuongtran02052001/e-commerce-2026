import type { AssistantTopic } from '@/stores/assistantStore';

export type AssistantChatTopic = {
  id: AssistantTopic;
  label: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const STOREFRONT_TOPICS: AssistantChatTopic[] = [
  {
    id: 'purchase_flow',
    label: 'Flow mua hàng',
    title: 'Flow mua hàng đầy đủ',
    paragraphs: [
      'Người mua sẽ chọn sản phẩm, thêm vào giỏ, vào checkout, nhập địa chỉ giao hàng và chọn phương thức thanh toán để tạo đơn.',
      'Sau khi đơn được tạo, người mua chủ yếu theo dõi ở trang order detail. Hệ thống nhân sự phía sau sẽ xử lý xác nhận và giao hàng.',
    ],
    bullets: [
      'Add to cart -> Checkout -> Place order',
      'Call center hoặc in-charge confirm address',
      'Call center hoặc in-charge confirm order',
      'Packer hoặc WARE_HOUSE đóng gói',
      'Assign deliveryman -> start delivery -> delivered',
      'Nếu COD thì accounts hoặc in-charge xác nhận thu tiền để đơn completed',
    ],
  },
  {
    id: 'after_checkout',
    label: 'Sau khi đặt đơn',
    title: 'Sau khi checkout xong thì chờ gì',
    paragraphs: [
      'Khi người mua vừa đặt đơn, trạng thái ban đầu là pending. Đây chưa phải lỗi, mà là đang chờ nhân sự xác nhận.',
      'Người mua không cần bấm thêm gì, chỉ cần vào trang chi tiết đơn để theo dõi timeline.',
    ],
    bullets: [
      'Pending: chờ xác nhận địa chỉ',
      'Address confirmed: địa chỉ đã được duyệt',
      'Order confirmed: đơn đã được xác nhận',
      'Packed / ready for delivery / out for delivery: đang xử lý giao',
      'Delivered: đã giao xong',
      'Completed: đã hoàn tất cả giao hàng và thanh toán',
    ],
  },
  {
    id: 'payment_cod',
    label: 'COD / thanh toán',
    title: 'Flow cho Cash on Delivery',
    paragraphs: [
      'Nếu người mua chọn cash on delivery thì deliveryman chỉ mới hoàn tất phần giao hàng khi đơn chuyển delivered.',
      'Để đơn thành completed, accounts hoặc in-charge còn phải xác nhận đã nhận tiền.',
    ],
    bullets: [
      'Delivered chưa chắc là completed',
      'COD cần nhập cash collected amount khi mark delivered',
      'Accounts / in-charge bấm Receive Payment',
      'Sau bước đó paymentStatus = paid và status = completed',
    ],
  },
  {
    id: 'who_confirms',
    label: 'Ai xác nhận',
    title: 'Vai trò nào xử lý bước nào',
    paragraphs: [
      'Flow nhân sự đang chia theo role. Người mua chỉ theo dõi timeline, còn việc xử lý ở backend sẽ do từng role phụ trách.',
    ],
    bullets: [
      'CALL_CENTER / INCHARGE: confirm address, confirm order',
      'PACKER hoặc WARE_HOUSE hiện tại: pack và assign deliveryman',
      'DELIVERY_MAN / INCHARGE: start delivery, mark delivered, reschedule, failed delivery',
      'ACCOUNTS / INCHARGE: receive payment',
    ],
  },
];

const ADMIN_TOPICS: AssistantChatTopic[] = [
  {
    id: 'admin_flow',
    label: 'Flow điều hành',
    title: 'Admin điều hành đơn như thế nào',
    paragraphs: [
      'Ở admin, bạn nên xem order theo đúng workflow thay vì sửa status thủ công. Cách an toàn nhất là đi theo từng action nghiệp vụ.',
      'Nếu người mua hỏi tại sao đơn chưa giao, hãy kiểm tra đơn đang dừng ở role nào: call center, packer, delivery hay accounts.',
    ],
    bullets: [
      'Pending -> confirm address',
      'Address confirmed -> confirm order',
      'Order confirmed -> pack',
      'Packed -> assign deliveryman',
      'Ready for delivery -> start delivery',
      'Out for delivery -> mark delivered',
      'Delivered + COD -> receive payment',
    ],
  },
  ...STOREFRONT_TOPICS.filter((topic) => topic.id !== 'purchase_flow'),
];

export const getAssistantTopics = (pathname: string) =>
  pathname.startsWith('/admin') ? ADMIN_TOPICS : STOREFRONT_TOPICS;
