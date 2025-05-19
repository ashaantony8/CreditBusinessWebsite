import { motion } from 'framer-motion';

import LRepayments from '../../assets/images/loan_repayment.png';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const LoanRepayments = () => {
  return (
    <>
      <div className="container mx-auto p-6 pt-24 max-sm:pt-12 lg:px-8">
        <div className="grid gap-x-12 md:grid-cols-2 lg:grid-cols-2 lg:items-center">
          <div aria-hidden="true" className="mt-10 lg:mt-0">
            {' '}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeInRight}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="inline-block px-4 py-5 max-sm:px-1 max-sm:py-2"
              >
                <img src={LRepayments} />
              </motion.div>{' '}
            </motion.div>
          </div>{' '}
          <motion.div
            aria-hidden="true"
            initial="hidden"
            whileInView="visible"
            variants={slideDown}
          >
            <div className=" ">
              <p className="font-Playfair font-semibold text-[#EE2F26] max-sm:text-lg md:text-[17px] lg:text-[27px]">
                {'STAGE'}{' '}
                <a className="max-sm:text-[28px] md:text-[27px] lg:text-[37px]">
                  {'4'}
                </a>
                <span className="[#EE2F26] mb-2 ml-2 inline-block h-[1.5px] w-9 bg-[#1A439A]"></span>
              </p>
              <p className="tracki my-1 font-Playfair font-bold text-color-text-primary max-sm:text-2xl md:text-[25px] lg:text-[58px]">
                {'Funding Repayments'}
              </p>

              <p className="py-2 text-[#444444] max-sm:text-[12px] md:text-[12px] lg:text-[16px]">
                {'Your Payments will be fixed based on your businesses revenue'}
                {'generation model. It must be paid regularly to our account'}
                {'through either Direct Debit Mandate or through Continuous'}
                {'Payment Authority.'}
              </p>
            </div>{' '}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoanRepayments;
