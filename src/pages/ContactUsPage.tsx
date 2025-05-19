import { useEffect } from 'react';

import ContactUs from '../components/ContactUs';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';

const ContactUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <ContactUs />
      <Footer />
    </>
  );
};

export default ContactUsPage;
