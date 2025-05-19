import { useEffect } from 'react';

import FaqBanner from '../components/faq/FaqBanner';
import FAQSection from '../components/faq/FaqSection';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';

const FaqPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <FaqBanner />
      <FAQSection />
      <Footer />
    </>
  );
};

export default FaqPage;
