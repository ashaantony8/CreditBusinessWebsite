import { motion } from 'framer-motion';

import mask from '../../assets/images/MaskUk.png';
import ukimage from '../../assets/images/uk-image.png';

const FinanceSection = () => {
  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };
  const slideDown = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };
  return (
    <div className="lg:h-[705px]">
      <div className="relative gap-0 md:grid md:grid-cols-2">
        <div className="bg-[#1A439A] md:relative lg:h-[610px]">
          {' '}
          <motion.div
            aria-hidden="true"
            initial="hidden"
            whileInView="visible"
            variants={slideDown}
          >
            <div className="border-[12px] border-[#F02E23] bg-white px-8 md:ml-6 md:mt-4 md:w-[490px] lg:ml-12 lg:mt-20 lg:h-[455px] lg:w-[937px]">
              <div className="md:px-12 lg:px-0">
                <p className="pb-2 pt-7 text-[14px] font-semibold text-[#828282] lg:mt-[6px] lg:text-[18px]">
                  {'RENOWNED AND TRUSTED IN THE UNITED KINGDOM'}
                </p>
                <p className="tracki my-2 font-Playfair font-bold text-[#02002E] max-sm:text-2xl md:text-[20px] lg:text-[40px]">
                  {'Credit4business Finance is accessible '}
                  <br />
                  {'throughout "The United Kingdom"'}
                </p>
                <span className="mb-8 mt-2 inline-block h-[1.5px] w-[70px] bg-red-500 lg:mb-2"></span>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeInRight}
                >
                  {' '}
                  <img
                    src={mask}
                    alt="icon1"
                    className="w-full md:h-[100px] lg:h-[201px] lg:w-[937px]"
                  />{' '}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        <div>
          <img
            src={ukimage}
            alt="icon1"
            className="shadow-y-md w-full bg-color-primary md:h-[400px] lg:h-[610px]"
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceSection;
