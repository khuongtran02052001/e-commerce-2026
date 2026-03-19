'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ApplicationSuccessNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'premium' | 'business';
  userName?: string;
}

export default function ApplicationSuccessNotification({
  isVisible,
  onClose,
  type,
  userName = 'User',
}: ApplicationSuccessNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const config = {
    premium: {
      title: '🎉 Premium Application Submitted!',
      subtitle: `Congratulations ${userName}!`,
      description:
        'Your premium account application has been successfully submitted and is now under administrative review.',
      bgColor: 'from-shop_dark_green via-[#a75f8f] to-shop_light_green',
      iconBg: 'bg-white/22',
      iconColor: 'text-white',
      benefits: [
        'Exclusive premium features access',
        'Priority customer support',
        'Enhanced rewards program',
        'Eligible for Business upgrades',
      ],
    },
    business: {
      title: '🚀 Business Application Submitted!',
      subtitle: `Excellent choice ${userName}!`,
      description:
        'Your business account application has been submitted and is under review for approval.',
      bgColor: 'from-shop_dark_green via-[#9f6eb2] to-shop_dark_blue',
      iconBg: 'bg-white/22',
      iconColor: 'text-white',
      benefits: [
        '2% additional discount on all orders',
        'Priority business support',
        'Bulk order management',
        'Professional invoicing',
      ],
    },
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-shop_dark_green/16 p-4 backdrop-blur-[3px]">
      <div
        className={`max-w-lg w-full transform rounded-2xl border border-shop_light_green/18 bg-white shadow-[0_28px_70px_rgba(139,76,114,0.16)] transition-all duration-500 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header with gradient */}
        <div
          className={`p-6 bg-gradient-to-r ${currentConfig.bgColor} text-white rounded-t-2xl relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 opacity-20">
            <Sparkles className="w-24 h-24" />
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className={`${currentConfig.iconBg} p-3 rounded-full`}>
              <CheckCircle className={`w-8 h-8 ${currentConfig.iconColor}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentConfig.title}</h3>
              <p className="text-white/90">{currentConfig.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-dark-color">{currentConfig.description}</p>

          {/* Status indicator */}
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-shop_light_green/18 bg-shop_light_pink/55 p-3">
            <Clock className="h-4 w-4 animate-pulse text-shop_dark_green" />
            <span className="text-sm font-medium text-shop_dark_green">Status: Pending Review</span>
          </div>

          {/* What's next */}
          <div className="mb-4">
            <h4 className="mb-2 font-semibold text-dark-color">What happens next?</h4>
            <ul className="space-y-1 text-sm text-dark-text">
              <li>• Admin team will review your application within 24-48 hours</li>
              <li>• You&apos;ll receive an email notification once status changes</li>
              <li>• Upon approval, benefits will be activated immediately</li>
            </ul>
          </div>

          {/* Benefits preview */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              {type === 'premium' ? 'Premium' : 'Business'} Benefits (Upon Approval):
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {currentConfig.benefits.map((benefit, index) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1 bg-gray-900 hover:bg-gray-800">
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
