'use client';

import { AlignLeft } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './Sidebar';

const MobileMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <button
        onClick={toggleSidebar}
        className="rounded-full p-2 text-shop_dark_green transition-colors duration-200 hover:bg-shop_light_pink/70 md:hidden"
      >
        <AlignLeft className="h-6 w-6" />
      </button>
      <div className="md:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>
    </>
  );
};

export default MobileMenu;
