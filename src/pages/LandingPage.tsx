import { useSelector } from 'react-redux';

import ContactUs from '../components/ContactUs';
import AboutSection from '../components/landing/AboutSection';
import BannerSection from '../components/landing/BannerSection';
import BlogSection from '../components/landing/BlogSection';
import EligibleSection from '../components/landing/EligibleSection';
import FeatureSection from '../components/landing/FeaturesSection';
import FinanceSection from '../components/landing/FinanceSection';
import MobileDownloadButton from '../components/landing/MobileDownloadButton';
import NewsLetter from '../components/landing/NewsLetter';
import PaymentBox from '../components/landing/PaymentBox';
import QuickButton from '../components/landing/QuickButton';
import ShareLinkSection from '../components/landing/ShareLinkSection';
import StatusSection from '../components/landing/StatusSection';
import Testimonial from '../components/landing/Testimonial';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';
import { authSelector } from '../store/auth/userSlice';
import { Roles } from '../utils/enums';
import useAuth from '../utils/hooks/useAuth';

const LandingPage = () => {
  const { authenticated } = useAuth();
  const { role } = useSelector(authSelector);

  return (
    <>
      <Header />
      <BannerSection />
      <MobileDownloadButton />
      <QuickButton />
      {authenticated &&
        (role === Roles.Customer ? (
          <>
            <PaymentBox />
            <ShareLinkSection />
          </>
        ) : (
          <StatusSection />
        ))}
      <FeatureSection />

      <AboutSection />
      <EligibleSection />
      <BlogSection />
      <FinanceSection />
      <Testimonial />
      <NewsLetter />
      <ContactUs />
      <Footer />
    </>
  );
};

export default LandingPage;
