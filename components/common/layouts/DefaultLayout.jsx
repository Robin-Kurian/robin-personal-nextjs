import React from "react";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import Navbar from "@/components/common/Navbar/Navbar";

const DefaultLayout = ({ children, footer = true }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <Navbar title="SHOP" />
      {/* Default Layout Wrapper */}
      <main className="flex-grow">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-4">
            {children}
          </div>
        </div>
      </main>
      {/* Scroll to Top */}
      <ScrollToTop />
      {/* Footer */}
      {footer && <Footer />}
    </div>
  );
};

export default DefaultLayout;
