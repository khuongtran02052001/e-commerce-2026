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
  const [signUpUrl, setSignUpUrl] = useState('/sign-up');

  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    setSignInUrl(`/sign-in?redirectTo=${encodeURIComponent(path)}`);
    setSignUpUrl(`/sign-up?redirectTo=${encodeURIComponent(path)}`);
  }, []);
  return (
    <header className="sticky top-0 z-40 py-2 bg-white/95 backdrop-blur-md border-b">
      <Container>
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <MobileMenu />
            <Logo />
          </div>

          <div className="hidden lg:flex flex-1 justify-center mx-8">
            <HeaderMenu />
          </div>

          <AuthActions
            isAuthenticated={isAuthenticated}
            signInUrl={signInUrl}
            signUpUrl={signUpUrl}
          />
        </div>
      </Container>
    </header>
  );
};

export default ClientHeader;
