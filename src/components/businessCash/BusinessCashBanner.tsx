import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

import Aboutimage from '../../assets/images/About-page.png';

const slideDown = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const BusinessCashBanner = () => {
  return (
    <>
      <motion.div
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        variants={slideDown}
      >
        <section id="features" className="bg-color-primary">
          <div className="relative">
            <div className="w-full max-sm:h-[250px] md:h-[350px] lg:h-[350px]">
              <img
                src={Aboutimage}
                alt="Your Image"
                className="h-full w-full object-fill"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center py-8 backdrop-blur-[2px]">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <p className="my-4 font-Playfair text-[40px] font-bold text-white max-sm:text-2xl lg:text-[64px]">
                  {'Business Cash Advance'}{' '}
                </p>

                <nav className="flex justify-center" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <a
                        href="#"
                        className="inline-flex items-center text-[16px] text-gray-400 hover:text-white lg:text-[24px]"
                      >
                        {'Home'}
                      </a>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <FaChevronRight className="text-[9px] text-gray-400 hover:text-white lg:text-[14px]" />
                        <a
                          href="#"
                          className="ml-1 text-[16px] font-medium text-white md:ml-2 lg:text-[24px]"
                        >
                          {'Business Cash Advance'}
                        </a>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default BusinessCashBanner;
