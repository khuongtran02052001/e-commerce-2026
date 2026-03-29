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
    <header className="sticky top-0 z-40 border-b border-[#dffbf7]/60 bg-white/88 py-2 backdrop-blur-xl shadow-[0_16px_40px_rgba(127,95,209,0.10)]">
      <Container>
        <div className="flex items-center justify-between gap-3 xl:gap-5">
          <div data-tour="header-logo" className="flex shrink-0 items-center gap-2">
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
