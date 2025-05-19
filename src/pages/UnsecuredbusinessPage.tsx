import { useEffect } from 'react';

import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';
import UnsecuredbusinessBanner from '../components/unsecuredbusiness/UnsecuredbusinessBanner';
import UnsecuredbusinessSection from '../components/unsecuredbusiness/UnsecuredbusinessSection';
const UnsecuredbusinessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <UnsecuredbusinessBanner />
      <UnsecuredbusinessSection />
      <Footer />
    </>
  );
};

export default UnsecuredbusinessPage;
