'use client';

import {
  Award,
  Clock,
  CreditCard,
  Headphones,
  Heart,
  LucideIcon,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import Container from './Container';
import FeatureModal from './FeatureModal';
import Title from './Title';

interface FeatureType {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  iconColor: string;
  details: string[];
  benefits: string[];
}

const ShopFeatures = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features: FeatureType[] = [
    {
      icon: ShieldCheck,
      title: 'Routine-first shopping',
      description: 'Browse products by real skin needs, not noisy clutter',
      color: 'from-cyan-400 to-violet-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      details: [
        'Danh mục được trình bày theo nhu cầu da thực tế như làm sạch, phục hồi, cấp ẩm hay chống nắng để việc chọn sản phẩm đỡ mỏi hơn.',
        'Người dùng có thể nhìn nhanh tên, nhóm công dụng và cảm giác sản phẩm mà không bị chìm trong quá nhiều yếu tố bán hàng.',
        'Layout được làm dịu đi để mắt tập trung vào routine và sản phẩm quan trọng thay vì quá nhiều tín hiệu gây xao nhãng.',
        'Màu sắc pastel và khoảng thở rộng hơn giúp trải nghiệm lướt web hợp ngành skincare hơn các template ecommerce nặng nề.',
        'Toàn bộ hướng hiển thị ưu tiên cảm giác chăm sóc bản thân hơn là đẩy mua thật nhanh.',
      ],
      benefits: [
        'Dễ bắt đầu routine',
        'Ít nhiễu thị giác',
        'Tập trung vào nhu cầu da',
        'Khám phá sản phẩm nhẹ nhàng hơn',
        'Giao diện mềm mắt',
        'Trải nghiệm hợp skincare hơn',
      ],
    },
    {
      icon: Truck,
      title: 'Texture & skin-type friendly',
      description: 'Descriptions written to help you choose faster',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      details: [
        'Mỗi sản phẩm nên được mô tả theo texture, cảm giác trên da và loại da phù hợp để người dùng quyết nhanh hơn.',
        'Thay vì chỉ nhấn mạnh khuyến mãi, phần thông tin đi theo hướng giải thích ngắn gọn vì sao món đó hợp với routine nào.',
        'Người mới bắt đầu có thể dựa vào mô tả để biết nên ưu tiên serum, kem dưỡng hay SPF trước.',
        'Các sản phẩm dành cho da dầu mụn, da nhạy cảm hay da thiếu nước được trình bày dễ đọc hơn nếu copy đi theo cùng một cấu trúc.',
        'Điều này giúp web giống beauty editorial hơn là một kho hàng chỉ liệt kê sản phẩm.',
      ],
      benefits: [
        'Dễ hiểu texture',
        'Chọn nhanh theo loại da',
        'Mô tả bớt lan man',
        'Phù hợp người mới',
        'Giảm cảm giác quá tải',
        'Nội dung có ích hơn',
      ],
    },
    {
      icon: CreditCard,
      title: 'Easy routine building',
      description: 'Mix cleansers, serums and SPF more naturally',
      color: 'from-violet-400 to-fuchsia-500',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      details: [
        'UI nên giúp người dùng hình dung một routine hoàn chỉnh thay vì chỉ thấy từng món rời rạc.',
        'Một người có thể bắt đầu từ sữa rửa mặt, serum, kem dưỡng và chống nắng mà không cần đọc quá nhiều phần kỹ thuật rối rắm.',
        'Các CTA như Build my routine hay Shop skincare now khiến hướng đi rõ ràng hơn cho người đang chưa biết bắt đầu từ đâu.',
        'Khi ngôn ngữ trên web đồng bộ, người dùng dễ liên kết giữa blog, category và product card hơn.',
        'Đó là điểm làm một web skincare trông có gu và có chủ đích hơn hẳn template bán đủ thứ.',
      ],
      benefits: [
        'Dễ ghép routine',
        'CTA có định hướng',
        'Liên kết content tốt hơn',
        'Giảm cảm giác lạc hướng',
        'Phù hợp hành vi mua skincare',
        'Nhất quán từ blog đến sản phẩm',
      ],
    },
    {
      icon: Headphones,
      title: 'Helpful skincare content',
      description: 'Tips and blog content to guide everyday use',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      details: [
        'Blog và help content giúp web không chỉ là nơi bán hàng mà còn là nơi giải thích routine một cách dễ tiếp cận.',
        'Người dùng skincare thường cần câu trả lời cho các câu hỏi nhỏ như dùng serum nào trước, da nhạy cảm nên tránh gì hay SPF nào hợp hằng ngày.',
        'Nếu nội dung được viết đúng tone, web sẽ có cảm giác đáng tin và có chiều sâu hơn.',
        'Đây cũng là phần kéo brand Lumière gần hơn với một beauty journal thay vì chỉ là một storefront.',
        'Copy càng rõ và dịu thì cảm giác brand càng premium một cách tự nhiên.',
      ],
      benefits: [
        'Tăng độ tin cậy',
        'Hỗ trợ người mới',
        'Giữ chân người đọc',
        'Hợp mô hình skincare journal',
        'Tăng cảm giác premium',
        'Giúp sản phẩm bớt khô khan',
      ],
    },
    {
      icon: RefreshCw,
      title: 'Cleaner browsing',
      description: 'Less visual noise, more focus on what matters',
      color: 'from-fuchsia-400 to-pink-500',
      bgColor: 'bg-fuchsia-50',
      iconColor: 'text-fuchsia-600',
      details: [
        'Một giao diện skincare đẹp không cần quá nhiều hiệu ứng sale nhảy múa để thu hút người dùng.',
        'Việc giảm bớt các tín hiệu kiểu flash sale, icon nặng retail hay text quá thương mại làm tổng thể trông thanh hơn rất nhiều.',
        'Khoảng trắng, bo góc mềm và bảng màu nhẹ đang giúp trang dễ thở hơn khi lướt trên mobile lẫn desktop.',
        'Khi card, banner và section cùng nói chung một ngôn ngữ thiết kế, toàn bộ web bớt cảm giác chắp vá.',
        'Cleaner browsing cũng khiến sản phẩm đẹp hơn mà không cần cố quá nhiều.',
      ],
      benefits: [
        'Ít mùi template',
        'Nhìn sang hơn',
        'Dễ lướt trên mobile',
        'Tập trung vào sản phẩm',
        'Cảm giác editorial hơn',
        'Tổng thể gọn gàng hơn',
      ],
    },
    {
      icon: Award,
      title: 'Curated formulas',
      description: 'Selections that feel more relevant for skincare routines',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      details: [
        'Web skincare hợp hơn khi sản phẩm được nhìn như những lựa chọn có chủ đích chứ không phải một kho hàng ngẫu nhiên.',
        'Brand section, category section và product card hiện tại đã bắt đầu tạo được cảm giác curated hơn trước.',
        'Khi mô tả sản phẩm, blog và title cùng xoay quanh nhu cầu da, sự tuyển chọn này trở nên rõ ràng hơn.',
        'Người dùng sẽ cảm thấy họ đang đi vào một nơi có gu và có tiêu chí, không chỉ là nơi bán thật nhiều thứ.',
        'Đó là nền tốt để Lumière trông chuyên skincare hơn về lâu dài.',
      ],
      benefits: [
        'Tạo cảm giác có gu',
        'Bớt hỗn tạp',
        'Brand rõ định hướng hơn',
        'Hợp user skincare',
        'Tăng cảm giác chọn lọc',
        'Nâng perception của web',
      ],
    },
    {
      icon: Clock,
      title: 'Beauty editorial feel',
      description: 'A softer UI built around a skincare-first palette',
      color: 'from-indigo-400 to-violet-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      details: [
        'Palette mint, pink và violet đang đưa web đi gần hơn với một beauty editorial store thay vì giao diện bán hàng phổ thông.',
        'Header, hero, card và footer đã bắt đầu cùng một ngôn ngữ thị giác nên cảm giác brand liền mạch hơn.',
        'Những section quan trọng hiện sáng, mềm và nữ tính hơn nhưng vẫn chưa bị quá sến.',
        'Nếu tiếp tục tinh chỉnh logo, hero element và legal/public copy, Lumière sẽ ra chất hơn nữa.',
        'Đây là hướng đúng nếu mục tiêu là một storefront skincare hiện đại, dịu và có chiều sâu thẩm mỹ.',
      ],
      benefits: [
        'Palette hợp skincare',
        'Brand feel mềm hơn',
        'UI sáng và dễ chịu',
        'Bớt generic ecommerce',
        'Tăng cảm giác beauty store',
        'Có nền để phát triển tiếp',
      ],
    },
    {
      icon: Heart,
      title: 'More confident choices',
      description: 'Designed to make comparing products feel simpler',
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      details: [
        'Khi UI rõ ràng hơn và copy ít generic hơn, người dùng có xu hướng tự tin hơn trong việc chọn món phù hợp.',
        'So sánh giữa các nhóm như làm sạch, phục hồi, chống nắng hay serum treatment sẽ dễ hơn nếu mọi section cùng hỗ trợ một hướng đọc.',
        'Đó là giá trị thật của việc rebrand sang Lumière chứ không chỉ đơn thuần đổi màu đẹp hơn.',
        'Người dùng skincare cần cảm giác được hướng dẫn nhẹ nhàng hơn là bị thúc mua liên tục.',
        'Khi web tạo được cảm giác đó, tỉ lệ ở lại xem tiếp cũng thường tốt hơn.',
      ],
      benefits: [
        'Chọn sản phẩm tự tin hơn',
        'So sánh dễ hơn',
        'Bớt bị thúc mua lộ liễu',
        'Tăng thời gian ở lại web',
        'Hợp hành vi skincare thật',
        'Thương hiệu có chiều sâu hơn',
      ],
    },
  ];

  const handleFeatureClick = (feature: FeatureType) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedFeature(null), 300);
  };

  return (
    <Container className="my-16 lg:my-24">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-shop_light_blue to-shop_dark_blue rounded-full"></div>
          <Title className="text-3xl lg:text-4xl font-bold text-dark-color">Why this skincare UI feels better</Title>
          <div className="h-1 w-12 bg-gradient-to-l from-shop_light_blue to-shop_dark_blue rounded-full"></div>
        </div>
        <p className="text-light-color text-lg max-w-2xl mx-auto">
          Một giao diện dịu mắt hơn, hợp ngành skincare hơn, giúp sản phẩm, routine và nội dung trông đồng bộ hơn.
        </p>
      </div>

      {/* Features Grid */}
      <div className="rounded-3xl border border-[#dffbf7]/70 bg-gradient-to-br from-white via-[#f8fcff] to-[#fff3fa] p-8 shadow-[0_24px_64px_rgba(127,95,209,0.10)] lg:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <button
                key={index}
                onClick={() => handleFeatureClick(feature)}
                className="group w-full cursor-pointer rounded-2xl border border-[#ebe4ff] bg-white p-6 text-left shadow-lg transform hover:-translate-y-2 hover:border-[#8bf4ee] hover:shadow-[0_22px_42px_rgba(127,95,209,0.14)] hoverEffect"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Icon Container */}
                <div className="flex justify-center mb-5">
                  <div
                    className={`relative w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:shadow-lg hoverEffect`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${feature.iconColor} group-hover:scale-110 hoverEffect`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-shop_light_blue/10 to-transparent opacity-0 group-hover:opacity-100 hoverEffect rounded-2xl"></div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-dark-color group-hover:text-shop_dark_blue hoverEffect">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-light-color leading-relaxed">{feature.description}</p>
                  <div className="text-xs text-shop_dark_blue font-medium pt-2 opacity-0 group-hover:opacity-100 hoverEffect">
                    Click to learn more →
                  </div>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`bg-gradient-to-r ${feature.color} h-1.5 rounded-full hoverEffect group-hover:w-full transition-all duration-500`}
                    style={{ width: '40%' }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-12 pt-8 border-t border-shop_light_blue/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-3xl font-bold text-transparent">
                10K+
              </div>
              <div className="text-sm font-medium text-light-color">Skincare readers</div>
            </div>
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-3xl font-bold text-transparent">
                1K+
              </div>
              <div className="text-sm font-medium text-light-color">Skincare picks</div>
            </div>
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-3xl font-bold text-transparent">
                4.9★
              </div>
              <div className="text-sm font-medium text-light-color">Routine favorites</div>
            </div>
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-r from-shop_dark_blue to-shop_light_blue bg-clip-text text-3xl font-bold text-transparent">
                Daily
              </div>
              <div className="text-sm font-medium text-light-color">Beauty content</div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-shop_light_pink to-shop_light_bg rounded-2xl border border-shop_light_blue/20 shadow-md">
            <ShieldCheck className="w-6 h-6 text-shop_dark_blue" />
            <span className="text-dark-text font-semibold">
              Soft, clear, skincare-first browsing that feels less noisy from the first screen
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Modal */}
      <FeatureModal isOpen={isModalOpen} onClose={handleCloseModal} feature={selectedFeature} />
    </Container>
  );
};

export default ShopFeatures;
