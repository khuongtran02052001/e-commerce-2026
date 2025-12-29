import dynamic from 'next/dynamic';
import Link from 'next/link';
import CartIcon from './cart/CartIcon';
import FavoriteButton from './FavoriteButton';
import NotificationBell from './NotificationBell';
import { signIn } from 'next-auth/react';

const UserDropdown = dynamic(() => import('./UserDropdown'), {
  ssr: false,
});

interface Props {
  authReady: boolean;
  isAuthenticated: boolean;
  signInUrl: string;
  signUpUrl: string;
}

const AuthActions = ({ authReady, isAuthenticated, signInUrl, signUpUrl }: Props) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto">
      {/* ================= Desktop ================= */}
      <div className="hidden lg:flex items-center gap-4">
        <CartIcon />
        <FavoriteButton />
        <NotificationBell />

        {/* Signed In */}
        {isAuthenticated && <UserDropdown />}

        {/* Signed Out */}
        {!isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="bg-transparent border border-shop_btn_dark_green hover:bg-shop_btn_dark_green text-shop_btn_dark_green hover:text-white px-2 py-1.5 rounded text-xs font-semibold hoverEffect">
              <form
                action={async () => {
                  await signIn();
                }}
              >
                <button type="submit">Sign in</button>
              </form>
            </div>
            <Link
              href={signUpUrl}
              className="bg-shop_btn_dark_green border border-shop_btn_dark_green hover:bg-transparent text-white hover:text-shop_btn_dark_green px-2 py-1.5 rounded text-xs font-semibold hoverEffect"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* ================= Tablet ================= */}
      <div className="hidden md:flex lg:hidden items-center gap-2">
        <CartIcon />
        <FavoriteButton />
        <NotificationBell />

        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href={signInUrl}
              className="text-sm font-semibold hover:text-shop_light_green hoverEffect px-2 py-1 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              href={signUpUrl}
              className="bg-shop_dark_green hover:bg-shop_light_green text-white px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200"
            >
              Sign Up
            </Link>
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
              className="bg-transparent border border-shop_btn_dark_green hover:bg-shop_btn_dark_green text-shop_btn_dark_green hover:text-white px-2 py-1.5 rounded text-xs font-semibold hoverEffect"
            >
              Sign In
            </Link>
            <Link
              href={signUpUrl}
              className="bg-shop_btn_dark_green border border-shop_btn_dark_green hover:bg-transparent text-white hover:text-shop_btn_dark_green px-2 py-1.5 rounded text-xs font-semibold hoverEffect"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthActions;
