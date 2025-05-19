import { useEffect } from 'react';

import BlogBanner from '../components/blog/BlogBanner';
import BlogSection from '../components/blog/BlogSection';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';
const BlogPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <BlogBanner />
      <BlogSection />
      <Footer />
    </>
  );
};

export default BlogPage;
