import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

function UserLayout({ children, hideFooter = true }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />

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
