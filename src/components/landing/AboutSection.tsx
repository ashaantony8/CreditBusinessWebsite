import { motion } from 'framer-motion';

import AboutBanner from '../../assets/images/about-banner.png';
import { aboutData } from '../../utils/data';

const AboutSection = () => {
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  return (
    <>
      <section className="bg-white">
        <div className="container mx-auto p-6 py-12 lg:px-12">
          <div className="grid gap-x-4 md:grid-cols-2 lg:grid-cols-2 lg:items-center">
            <motion.div
              className="max-sm:order-2"
              initial="hidden"
              whileInView="visible"
              variants={fadeInLeft}
            >
              <p className="text-[18px] font-semibold text-color-text-dark max-sm:text-lg">
                {'ABOUT CREDIT 4 BUSINESS'}
                <span className="mb-1 ml-2 inline-block h-[1.5px] w-7 bg-red-500"></span>
              </p>
              <p className="my-2 font-Playfair font-bold leading-normal tracking-normal text-[#02002E] max-sm:text-2xl md:text-[22px] lg:text-[40px]">
                {'We look for building a long term relationship with the'}
                {'businesses'}
              </p>
              <p className="mt-4 font-light text-[#929292] max-sm:text-[13px] md:text-[13px] lg:text-[17px]">
                {'Credit 4 business is a door to access business funding in a'}
                {
                  'friendly way. We are here mainly to support the small businesses'
                }
                {
                  'deprived of funds by providing quick unsecured finance to meet'
                }
                {'their business ambitions.'}
              </p>

              <div className="space-y-12 max-sm:mt-4 max-sm:space-y-4 md:mt-4 md:space-y-4 lg:mt-8">
                {aboutData.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <motion.div
                        className="flex items-center justify-center max-sm:mt-7"
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                      >
                        <img
                          src={item.image}
                          className="h-[94px] w-[94px]"
                          alt={item.heading}
                        />
                      </motion.div>
                    </div>
                    <div className="ml-4 text-start">
                      <p className="font-semibold text-black max-sm:text-[14px] md:text-[15px] lg:text-[18px]">
                        {item.heading}
                      </p>
                      <p className="mt-2 font-light text-[#929292] max-sm:text-[10px] md:text-[12px] lg:text-[15px]">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              aria-hidden="true"
              className="mt-10 max-sm:order-1 lg:mt-0"
              initial="hidden"
              whileInView="visible"
              variants={slideUp}
            >
              <img
                src={AboutBanner}
                alt="About Banner"
                className="lg:h-[630px] lg:w-[630px]"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
