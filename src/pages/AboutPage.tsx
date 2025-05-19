import { useEffect } from 'react';

import AboutBanner from '../components/about/AboutBanner';
import AsAlwaysSection from '../components/about/AsAlwaysSection';
import LeaderSection from '../components/about/LeaderSection';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';
const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <AboutBanner />
      <LeaderSection />
      <AsAlwaysSection />
      <Footer />
    </>
  );
};

export default AboutPage;
