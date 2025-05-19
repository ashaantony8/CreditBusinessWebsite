import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import flag from '../../assets/images/LondonFlag.png';
import mobile from '../../assets/images/mobile.png';
import support from '../../assets/images/support.png';
import teamachieve from '../../assets/images/teamachieve.png';

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};
const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};
const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};
const LeaderSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        variants={slideUp}
      >
        <section className="bg-white lg:h-[900px]">
          <div className="container mx-auto space-y-24 p-6 py-12 lg:px-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 lg:items-center lg:gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={fadeInLeft}
              >
                <div>
                  <p className="font-Playfair font-semibold text-[#EE2F26] max-sm:text-lg md:text-[17px] lg:text-[28px]">
                    {'We are'}
                    <span className="mb-1 ml-2 inline-block h-[1.5px] w-[70px] bg-[#1A439A]"></span>
                  </p>
                  <p className="tracki my-2 font-Playfair font-bold text-[#02002E] max-sm:text-2xl md:text-[25px] lg:text-[52px]">
                    {'Leaders in Funding Solution'}
                  </p>
                  <div className="mt-4 flex">
                    <motion.div
                      className="flex items-center justify-center max-sm:mt-7"
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span>
                        <img
                          className="h-10 w-10 rounded-full max-sm:h-[45px] max-sm:w-[50px] lg:h-[80px] lg:w-[80px]"
                          src={flag}
                          alt="Rounded avatar"
                        />
                      </span>
                    </motion.div>
                    <span className="mx-2 pl-2 font-semibold text-black max-sm:text-[12px] md:text-[11px] lg:text-[24px]">
                      {'Since 1998 '}
                      <br />
                      {'All over the United Kingdom'}
                    </span>
                  </div>
                  <p className="mt-4 py-4 text-[#444444] max-sm:text-[12px] md:text-[12px] lg:text-[16px]">
                    {
                      'Credit 4 business is a door to access business funding in a'
                    }
                    {'friendly way. We are here mainly to support the small'}
                    {
                      'businesses deprived of funds by providing quick unsecured'
                    }
                    {
                      'finance to meet their business ambitions. Register with us'
                    }
                    {'and then our team will be available to help you grab any'}
                    {
                      'business opportunity arising at any point of time. We are'
                    }
                    {
                      'keen in delivering excellent service to our customers and by'
                    }
                    {
                      'supporting them with their financing needs, we want to be'
                    }
                    {
                      'part of their business success. We look for building a long'
                    }
                    {'term relationship with the businesses and to remain a'}
                    {'trusted friend for all their financing needs.'}
                  </p>
                  <div className="flex justify-center max-sm:pb-8 max-sm:pt-4 md:justify-start lg:mt-8 lg:h-[75px] lg:w-[239px]">
                    <button
                      onClick={() => {
                        navigate(`/contact-us`);
                      }}
                      className="bg-[#1B4398] px-10 py-4 font-semibold text-white hover:bg-[#3a5692] max-sm:text-[12px] md:text-[12px] lg:text-[24px]"
                    >
                      {'CONTACT US'}
                    </button>
                  </div>
                </div>
              </motion.div>
              <div className="flex h-[500px] max-sm:h-[280px]">
                <div className="relative">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInLeft}
                  >
                    {' '}
                    <img
                      src={teamachieve}
                      className="h-[470px] w-[220px] pb-16 max-sm:h-[250px] lg:h-[544px] lg:w-[395px]"
                    />{' '}
                  </motion.div>
                  <div className="absolute bottom-2 bg-[#1B4398] max-sm:w-[210px] md:w-[220px] lg:-bottom-40 lg:h-[161px] lg:w-[492px]">
                    <div className="flex justify-between">
                      <span className="grid items-center lg:p-4">
                        <p className="py-2 pl-4 text-[11px] text-white max-sm:text-[10px] lg:text-[22.39px]">
                          {'Safe Credit, Save Life! '}
                          <br /> {'Any questions?'}
                          <br />
                          <a className="lg:text-[26px]">{'Call '}</a>
                          <a className="font-semibold lg:text-[26px]">
                            {'020 8004 9787'}
                          </a>
                        </p>
                      </span>
                      <span>
                        {' '}
                        <motion.div
                          initial="hidden"
                          whileInView="visible"
                          variants={fadeInLeft}
                        >
                          <img
                            src={support}
                            className="h-20 py-1 pr-2 max-sm:pr-1 lg:mt-[21px] lg:h-[141px] lg:w-[141px] lg:py-0"
                          />{' '}
                        </motion.div>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInRight}
                  >
                    <img
                      src={mobile}
                      className="h-[470px] w-[210px] pl-2 pt-16 max-sm:h-[250px] lg:h-[531px] lg:w-[399px] lg:pl-4"
                    />{' '}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default LeaderSection;
