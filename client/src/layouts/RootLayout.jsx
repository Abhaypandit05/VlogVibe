import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="vv-app-layout bg-grid-pattern">
      <Navbar />

      <div className="vv-app-content">
        <main className="vv-app-main">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;
