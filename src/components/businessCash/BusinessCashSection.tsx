import { motion } from 'framer-motion';

const slideDown = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const BusinessCashSection = () => {
  return (
    <>
      <motion.div
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        variants={slideDown}
      >
        <section className="bg-white">
          <div className="container mx-auto p-6 py-12 lg:px-12">
            <div className="grid">
              <div className="max-sm:order-2">
                <p className="text-[18px] font-semibold text-color-text-dark max-sm:text-lg">
                  {'ABOUT CREDIT 4 BUSINESS'}
                  <span className="mb-1 ml-2 inline-block h-[1.5px] w-7 bg-red-500"></span>
                </p>
                <p className="tracki my-2 font-Playfair font-bold leading-normal text-[#02002E] max-sm:text-2xl md:text-[22px] lg:text-[40px]">
                  {'Business Cash Advance'}
                </p>
                <p className="mt-4 font-light leading-10 text-[#929292] max-sm:text-[13px] md:text-[13px] lg:text-[17px]">
                  {'Lorem Ipsum is simply dummy text of the printing and'}
                  {'typesetting industry.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default BusinessCashSection;
