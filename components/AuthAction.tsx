import { signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CartIcon from './cart/CartIcon';
import SearchBar from './common/SearchBar';
import FavoriteButton from './FavoriteButton';
import NotificationBell from './NotificationBell';

const UserDropdown = dynamic(() => import('./UserDropdown'), {
  ssr: false,
});

interface Props {
  isAuthenticated: boolean;
  signInUrl: string;
  // signUpUrl: string;
}

// const AuthActions = ({ isAuthenticated, signInUrl, signUpUrl }: Props) => {
const AuthActions = ({ isAuthenticated, signInUrl }: Props) => {
  return (
    <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-3.5">
      <div className="shrink-0">
        <SearchBar />
      </div>

      {/* ================= Desktop ================= */}
      <div className="hidden shrink-0 items-center gap-3 lg:flex">
        <CartIcon />
        <FavoriteButton />
        <NotificationBell />

        {/* Signed In */}
        {isAuthenticated && <UserDropdown />}

        {/* Signed Out */}
        {!isAuthenticated && (
          <div className="flex items-center gap-2">
            <div
              data-tour="header-auth"
              className="rounded-full border border-shop_light_green/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-shop_dark_green shadow-sm transition-all duration-200 hover:border-shop_light_green/45 hover:bg-shop_light_pink/70"
            >
              <form
                action={async () => {
                  await signIn();
                }}
              >
                <button type="submit">Sign in</button>
              </form>
            </div>
            {/* <Link
              href={signUpUrl}
              className="rounded-full border border-shop_btn_dark_green bg-shop_btn_dark_green px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(139,76,114,0.18)] transition-all duration-200 hover:bg-shop_dark_green"
            >
              Sign Up
            </Link> */}
          </div>
        )}
      </div>

      {/* ================= Tablet ================= */}
      <div className="hidden items-center gap-2 md:flex lg:hidden">
        <CartIcon />
        <FavoriteButton />
        <NotificationBell />

        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={signInUrl}
              data-tour="header-auth"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-shop_dark_green transition-colors duration-200 hover:bg-shop_light_pink/70"
            >
              Sign In
            </Link>
            {/* <Link
              href={signUpUrl}
              className="rounded-full bg-shop_dark_green px-3 py-1.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(139,76,114,0.16)] transition-all duration-200 hover:bg-shop_btn_dark_green"
            >
              Sign Up
            </Link> */}
          </div>
        )}
      </div>

      {/* ================= Mobile ================= */}
      <div className="flex md:hidden items-center gap-1">
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <div className="flex items-center gap-1">
            <Link
              href={signInUrl}
              data-tour="header-auth"
              className="rounded-full border border-shop_light_green/30 bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-shop_dark_green transition-all duration-200 hover:bg-shop_light_pink/70"
            >
              Sign In
            </Link>
            {/* <Link
              href={signUpUrl}
              className="rounded-full border border-shop_btn_dark_green bg-shop_btn_dark_green px-2.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-shop_dark_green"
            >
              Sign Up
            </Link> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthActions;
