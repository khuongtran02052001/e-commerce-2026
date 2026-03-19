'use client';

import { categoriesData } from '@/constants';
import { useUserData } from '@/contexts/UserDataContext';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import useStore from '@/store';
import {
  BookOpen,
  Flame,
  Grid3X3,
  Heart,
  HelpCircle,
  Home,
  Info,
  Logs,
  Package,
  Phone,
  ShoppingBag,
  ShoppingCart,
  Tag,
  User,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import Logo from '../common/Logo';
import SocialMedia from '../common/SocialMedia';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sectionTitleClass = 'text-sm font-semibold uppercase tracking-wider text-shop_dark_green';
const cardClass =
  'rounded-2xl border border-shop_light_green/15 bg-white/75 transition-colors hover:bg-shop_light_pink/75';
const navItemClass =
  'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium tracking-wide transition-all duration-200 hover:bg-shop_light_pink/80 hover:text-shop_dark_green';

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  const { items, favoriteProduct } = useStore();
  const { authReady } = useUserData();

  const userMenuItems = [
    { title: 'My Account', href: '/account', icon: User },
    { title: 'My Orders', href: '/orders', icon: Package },
    { title: 'Wishlist', href: '/wishlist', icon: Heart },
    { title: 'Shopping Cart', href: '/cart', icon: ShoppingCart },
  ];

  const mainMenuItems = [
    { title: 'Home', href: '/', icon: Home },
    { title: 'Shop', href: '/shop', icon: ShoppingBag },
    { title: 'Categories', href: '/category', icon: Grid3X3 },
    { title: 'Brands', href: '/brands', icon: Tag },
    { title: 'Blog', href: '/blog', icon: BookOpen },
    { title: 'Hot Deal', href: '/deal', icon: Flame },
  ];

  const supportMenuItems = [
    { title: 'Help Center', href: '/help', icon: HelpCircle },
    { title: 'Customer Service', href: '/support', icon: Phone },
    { title: 'About Us', href: '/about', icon: Info },
  ];

  const renderNavLink = ({
    href,
    title,
    icon: Icon,
  }: {
    href: string;
    title: string;
    icon: typeof Home;
  }) => (
    <Link
      onClick={onClose}
      key={title}
      href={href}
      className={`${navItemClass} ${
        pathname === href
          ? 'border border-shop_light_green/20 bg-linear-to-r from-shop_light_pink via-white to-shop_light_pink/50 text-shop_dark_green shadow-sm'
          : 'text-dark-text'
      }`}
    >
      <Icon size={18} />
      {title}
    </Link>
  );

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 h-screen w-full bg-shop_dark_green/18 backdrop-blur-[2px] transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        ref={sidebarRef}
        className="z-50 flex h-screen min-w-72 max-w-96 flex-col gap-4 overflow-y-auto border-r border-shop_light_green/25 bg-linear-to-b from-white via-shop_light_bg to-shop_light_pink/90 p-6 text-dark-color shadow-[0_24px_60px_rgba(139,76,114,0.18)] scrollbar-thin scrollbar-thumb-shop_dark_green scrollbar-track-transparent"
      >
        <div className="flex items-center justify-between border-b border-shop_light_green/20 pb-4">
          <Logo className="text-shop_dark_green" />
          <button
            onClick={onClose}
            className="rounded-full p-2 text-shop_dark_green transition-colors duration-200 hover:bg-shop_light_pink/80"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <h3 className={sectionTitleClass}>Quick Access</h3>
          <div className="grid grid-cols-3 gap-3">
            <Link
              onClick={onClose}
              href="/cart"
              className={`${cardClass} relative flex flex-col items-center gap-2 p-3 text-center`}
            >
              <ShoppingCart size={20} className="text-shop_light_green" />
              <span className="text-xs font-medium text-dark-text">Cart</span>
              {items?.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-shop_btn_dark_green text-xs font-semibold text-white">
                  {items.length}
                </span>
              )}
            </Link>

            <Link
              onClick={onClose}
              href="/wishlist"
              className={`${cardClass} relative flex flex-col items-center gap-2 p-3 text-center`}
            >
              <Heart size={20} className="text-shop_dark_green" />
              <span className="text-xs font-medium text-dark-text">Wishlist</span>
              {favoriteProduct?.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-shop_light_green text-xs font-semibold text-white">
                  {favoriteProduct.length}
                </span>
              )}
            </Link>

            {!!authReady && (
              <Link
                onClick={onClose}
                href="/user/orders"
                className={`${cardClass} flex flex-col items-center gap-2 p-3 text-center`}
              >
                <Logs size={20} className="text-shop_dark_blue" />
                <span className="text-xs font-medium text-dark-text">Orders</span>
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className={sectionTitleClass}>My Account</h3>
          <div className="flex flex-col gap-2">{userMenuItems.map(renderNavLink)}</div>
        </div>

        <div className="space-y-3">
          <h3 className={sectionTitleClass}>Navigation</h3>
          <div className="flex flex-col gap-2">{mainMenuItems.map(renderNavLink)}</div>
        </div>

        <div className="space-y-3">
          <h3 className={sectionTitleClass}>Popular Categories</h3>
          <div className="flex flex-col gap-1">
            {categoriesData.slice(0, 6).map((item) => (
              <Link
                onClick={onClose}
                key={item.title}
                href={`/category/${item.href}`}
                className="rounded-lg px-2 py-1.5 text-xs font-medium capitalize text-light-color transition-colors hover:bg-shop_light_pink/60 hover:text-shop_dark_green"
              >
                {item.title}
              </Link>
            ))}
            <Link
              onClick={onClose}
              href="/category"
              className="mt-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-shop_dark_green transition-colors hover:bg-shop_light_pink/60 hover:text-shop_btn_dark_green"
            >
              View All Categories →
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className={sectionTitleClass}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link
              onClick={onClose}
              href="/deal"
              className={`${cardClass} flex flex-col items-center gap-1 p-3 text-center`}
            >
              <Flame size={20} className="text-shop_orange" />
              <span className="text-xs font-medium text-dark-text">Hot Deals</span>
            </Link>

            <Link
              onClick={onClose}
              href="/wishlist"
              className={`${cardClass} flex flex-col items-center gap-1 p-3 text-center`}
            >
              <Heart size={20} className="text-shop_light_green" />
              <span className="text-xs font-medium text-dark-text">Wishlist</span>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className={sectionTitleClass}>Support</h3>
          <div className="flex flex-col gap-2">{supportMenuItems.map(renderNavLink)}</div>
        </div>

        <div className="my-2 border-t border-shop_light_green/20" />

        <div className="rounded-2xl border border-shop_light_green/20 bg-linear-to-br from-shop_light_pink via-white to-shop_light_blue/70 p-4 text-center shadow-sm">
          <h4 className="mb-1 text-sm font-bold text-shop_dark_green">Special Offer!</h4>
          <p className="mb-2 text-xs text-dark-text">Get 20% off on your first order</p>
          <Link
            onClick={onClose}
            href="/deal"
            className="inline-block rounded-full bg-shop_dark_green px-3 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-shop_btn_dark_green"
          >
            Shop Now
          </Link>
        </div>

        <div className="mt-4">
          <h3 className={`${sectionTitleClass} mb-3`}>Follow Us</h3>
          <SocialMedia />
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
