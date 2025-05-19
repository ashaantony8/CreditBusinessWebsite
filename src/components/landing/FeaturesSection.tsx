import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

import { featureData } from '../../utils/data';

export const FeatureSection = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  return (
    <section id="features" className="bg-color-primary-light font-Playfair">
      <div className="container mx-auto px-16 py-20 font-Playfair">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          className="m-auto mb-20 text-center max-sm:mb-2 md:w-1/2"
        >
          <p className="mb-4 font-Playfair text-3xl font-bold text-[#02002E] max-sm:text-2xl lg:text-[34px]">
            <a>{'Why choose Credit'}</a>
            <a className="text-[#F02E23]">{'4'}</a>
            <a>{'business'}</a>
          </p>
          <div className="flex items-center">
            <div className="mr-4 flex-1 border-t-2 border-[#F02E23]"></div>
            <p className="font-Poppins text-[14px] font-semibold text-color-text-dark lg:text-[15px]">
              {'SUPERCHARGE YOUR GROWTH WITH FOUNDER-FRIENDLY CAPITAL'}
            </p>
            <div className="ml-4 flex-1 border-t-2 border-[#F02E23]"></div>
          </div>
        </motion.div>

        {(isLaptop || isTablet) && (
          <div className="grid grid-cols-3 max-sm:grid-cols-2">
            {featureData.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                className="cursor-pointer bg-color-primary-light px-2 py-2 text-center max-sm:text-start"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block px-4 py-5 max-sm:px-1 max-sm:py-2"
                >
                  <img
                    src={feature.image}
                    className="h-[170px] w-[170px] max-sm:h-[150px] max-sm:w-[150px]"
                    alt={feature.heading}
                  />
                </motion.div>
                <p className="py-4 font-Playfair text-[18px] font-bold text-[#02002E] max-sm:py-1 max-sm:text-[14px] lg:text-[28px]">
                  {feature.heading}
                </p>
                <p className="font-Poppins text-[16px] text-color-text-secondary-dark max-sm:text-[12px] lg:text-[18px]">
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {isMobile && (
          <div className="grid grid-cols-1">
            {featureData.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                className="cursor-pointer bg-color-primary-light px-2 py-2 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block px-4 py-5 max-sm:px-1 max-sm:py-2"
                >
                  <img
                    src={feature.image}
                    className="h-[100px] w-[100px]"
                    alt={feature.heading}
                  />
                </motion.div>
                <p className="py-4 font-Playfair text-[14px] font-bold text-[#02002E]">
                  {feature.heading}
                </p>
                <p className="font-Poppins text-[11px] text-color-text-secondary-dark">
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;
