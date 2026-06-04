import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import MobileNavigationDrawer from '@/Components/MobileNavigationDrawer';

function UserLayout({ children, hideFooter = true, showMobileDrawer = false }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />
      {showMobileDrawer && (
        <MobileNavigationDrawer isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}

      {React.isValidElement(children)
        ? React.cloneElement(children, {
            isSidebarOpen,
            setIsSidebarOpen,
          })
        : children}

      {!hideFooter && <Footer />}
    </>
  );
}

export default UserLayout;
