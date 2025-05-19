import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

import date from '../../assets/images/date.png';
import { BlogsectionImageData } from '../../utils/data';

const BlogSection = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <>
      <section className="bg-[#F0F3F9]">
        <div className="container mx-auto p-6 py-12 lg:px-12">
          {(isLaptop || isTablet) && (
            <>
              <div className="container mx-auto p-6 py-12 lg:px-12">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {BlogsectionImageData.map((blog, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-white shadow-md"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <a href="/blog-inner">
                          <img
                            className="rounded-t-lg"
                            src={blog.image}
                            alt=""
                          />
                        </a>
                      </motion.div>
                      <div className="p-5">
                        <a href="#">
                          <h5 className="mb-2 text-2xl tracking-tight text-gray-900">
                            {blog.heading}
                          </h5>
                        </a>
                        <p className="mb-3 text-[13.5px] font-normal text-gray-500">
                          {blog.label}
                        </p>
                        <p className="mb-3 flex text-[13.5px] font-normal text-gray-500">
                          <img src={date} className="mr-2" /> {blog.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {isMobile && (
            <div className="grid grid-cols-1 gap-4">
              {BlogsectionImageData.map((blog, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white shadow-md"
                >
                  <a href="#">
                    <img className="rounded-t-lg" src={blog.image} alt="" />
                  </a>
                  <div className="p-5">
                    <a href="#">
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                        {blog.heading}
                      </h5>
                    </a>
                    <p className="mb-3 text-[10.5px] font-normal text-gray-500">
                      {blog.label}
                    </p>
                    <p className="mb-3 flex text-[10.5px] font-normal text-gray-500">
                      <img src={date} className="mr-2" /> {blog.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogSection;
