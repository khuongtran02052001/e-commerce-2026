'use client';

import { useUserData } from '@/contexts/UserDataContext';
import { useEffect, useState } from 'react';
import AuthActions from './AuthAction';
import Container from './Container';
import Logo from './common/Logo';
import HeaderMenu from './layout/HeaderMenu';
import MobileMenu from './layout/MobileMenu';

const ClientHeader = () => {
  const { isAuthenticated } = useUserData();

  const [signInUrl, setSignInUrl] = useState('/sign-in');
  // const [signUpUrl, setSignUpUrl] = useState('/sign-up');

  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    setSignInUrl(`/sign-in?redirectTo=${encodeURIComponent(path)}`);
    // setSignUpUrl(`/sign-up?redirectTo=${encodeURIComponent(path)}`);
  }, []);
  return (
    <header className="sticky top-0 z-40 py-2 border-b border-shop_light_green/20 bg-white/92 backdrop-blur-md shadow-[0_10px_30px_rgba(201,124,167,0.08)]">
      <Container>
        <div className="flex items-center justify-between gap-3 xl:gap-5">
          <div className="flex shrink-0 items-center gap-2">
            <MobileMenu />
            <Logo />
          </div>

          <div className="hidden min-w-0 flex-1 justify-center px-4 lg:flex xl:px-6">
            <HeaderMenu />
          </div>

          <div className="shrink-0">
            <AuthActions
              isAuthenticated={isAuthenticated}
              signInUrl={signInUrl}
              // signUpUrl={signUpUrl}
            />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default ClientHeader;
