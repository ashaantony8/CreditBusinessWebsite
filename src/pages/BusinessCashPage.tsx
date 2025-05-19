import { useEffect } from 'react';

import BusinessCashBanner from '../components/businessCash/BusinessCashBanner';
import BusinessCashSection from '../components/businessCash/BusinessCashSection';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';
const BusinessCashPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <BusinessCashBanner />
      <BusinessCashSection />
      <Footer />
    </>
  );
};

export default BusinessCashPage;
