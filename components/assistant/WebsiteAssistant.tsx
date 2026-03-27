'use client';

import { getAssistantTopics } from '@/lib/assistant-chat';
import { usePathname } from 'next/navigation';
import { MessageCircle, Sparkles, X } from 'lucide-react';
import AssistantMascotScene from './AssistantMascotScene';
import { useAssistantStore } from '@/stores/assistantStore';
import { motion } from 'framer-motion';

export default function WebsiteAssistant() {
  const pathname = usePathname();
  const isHovered = useAssistantStore((state) => state.isHovered);
  const isOpen = useAssistantStore((state) => state.isOpen);
  const activeTopic = useAssistantStore((state) => state.activeTopic);
  const setHovered = useAssistantStore((state) => state.setHovered);
  const togglePanel = useAssistantStore((state) => state.togglePanel);
  const closePanel = useAssistantStore((state) => state.closePanel);
  const setTopic = useAssistantStore((state) => state.setTopic);
  const isAdminRoute = pathname.startsWith('/admin');
  const isOrderDetailRoute = pathname.includes('/orders/');
  const topics = getAssistantTopics(pathname);
  const topic =
    topics.find((item) => item.id === activeTopic) ??
    topics[0];

  const persona = isAdminRoute
    ? {
        name: 'Nova Ops',
        variant: 'admin' as const,
        message: 'Hỏi nhanh flow điều hành',
        chipClass: 'text-[#35527b]',
        panelClass:
          'border-[#d4e4f8] bg-[linear-gradient(180deg,#fdfefe_0%,#eef5ff_100%)] shadow-[0_28px_60px_rgba(60,92,140,0.18)]',
      }
    : {
        name: 'Lumi',
        variant: 'storefront' as const,
        message: isOrderDetailRoute ? 'Giải thích flow đơn hàng' : 'Hỏi cách mua hàng',
        chipClass: 'text-shop_dark_green/80',
        panelClass:
          'border-[#eed7e2] bg-[linear-gradient(180deg,#fffefe_0%,#fff7fb_100%)] shadow-[0_28px_60px_rgba(155,56,100,0.16)]',
      };

  return (
    <>
      <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3">
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className={`pointer-events-auto fixed bottom-28 right-3 left-3 z-[71] flex max-h-[min(68vh,620px)] flex-col overflow-hidden rounded-[28px] border ${persona.panelClass} sm:left-auto sm:right-5 sm:w-[min(92vw,380px)]`}
          >
            <div className="flex items-start justify-between border-b border-black/5 px-4 py-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-shop_dark_green">
                  <MessageCircle className="h-4 w-4" />
                  {persona.name}
                </div>
                <p className="mt-1 text-xs leading-5 text-shop_dark_green/70">
                  {isAdminRoute
                    ? 'Mình tóm tắt nhanh flow điều hành và role xử lý cho bạn.'
                    : 'Mình hướng dẫn flow mua hàng và trạng thái đơn theo cách dễ hiểu.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-full p-2 text-shop_dark_green/60 transition-colors hover:bg-shop_light_bg hover:text-shop_dark_green"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 px-4 py-3">
              {topics.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTopic(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    item.id === topic.id
                      ? 'bg-shop_dark_green text-white'
                      : 'bg-shop_light_bg text-shop_dark_green/75 hover:bg-shop_light_pink'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto px-4 pb-4">
              <div className="rounded-[22px] bg-white/90 p-4 shadow-[0_14px_30px_rgba(155,56,100,0.08)]">
                <h3 className="text-sm font-semibold text-shop_dark_green">{topic.title}</h3>
                <div className="mt-3 space-y-3 text-sm leading-6 text-shop_dark_green/78">
                  {topic.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {topic.bullets?.length ? (
                  <div className="mt-4 rounded-2xl bg-shop_light_bg/80 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-shop_dark_green/50">
                      Checklist
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-shop_dark_green/76">
                      {topic.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-shop_light_green" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}

        {!isOpen ? (
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0.92,
              y: isHovered ? -2 : 0,
            }}
            className="pointer-events-none max-w-[180px] rounded-full bg-white/88 px-3 py-1.5 text-xs font-semibold text-shop_dark_green shadow-[0_12px_28px_rgba(155,56,100,0.14)] backdrop-blur-md"
          >
            {persona.message}
          </motion.div>
        ) : null}

        <motion.button
          type="button"
          data-tour="assistant-mascot"
          aria-label="Open assistant"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={togglePanel}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto relative h-[108px] w-[88px] overflow-visible bg-transparent outline-none sm:h-[122px] sm:w-[104px]"
        >
          <div
            className={`absolute inset-x-1 bottom-2 h-[74px] rounded-full blur-2xl ${
              isAdminRoute ? 'bg-[#9ec6f0]/50' : 'bg-[#e6bfd1]/60'
            }`}
          />
          <div
            className={`absolute right-2 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/78 shadow-[0_10px_20px_rgba(155,56,100,0.18)] backdrop-blur-sm ${persona.chipClass}`}
          >
            <Sparkles
              className={`h-3.5 w-3.5 ${isAdminRoute ? 'text-[#5b84bd]' : 'text-shop_light_green'}`}
            />
          </div>
          <div className="absolute left-1 top-1 z-10 hidden rounded-full bg-white/72 px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-shop_dark_green/75 shadow-[0_8px_20px_rgba(155,56,100,0.1)] backdrop-blur-sm sm:block">
            {persona.name}
          </div>

          <div className="absolute inset-0">
            <AssistantMascotScene
              hovered={isHovered}
              guiding={isOpen}
              variant={persona.variant}
            />
          </div>
        </motion.button>
      </div>
    </>
  );
}
