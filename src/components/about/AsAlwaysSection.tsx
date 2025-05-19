import { motion } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';

import experience from '../../assets/images/experience.png';
import mission from '../../assets/images/mission.png';
import Vision from '../../assets/images/vision.png';

const slideDown = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const AsAlwaysSection = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <>
      {' '}
      <motion.div
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        variants={slideDown}
      >
        <section className="bg-[#F0F3F9]">
          <div className="container mx-auto space-y-12 p-6 py-12 lg:px-16">
            <div>
              <p className="font-Playfair font-semibold text-[#EE2F26] max-sm:text-lg md:text-[17px] lg:text-[27px]">
                {'As always'}
                <span className="mb-1 ml-2 inline-block h-[1.5px] w-7 bg-[#1A439A]"></span>
              </p>
              <p className="my-2 font-Playfair font-bold text-color-text-primary max-sm:text-2xl md:text-[28px] lg:text-[52px]">
                {'“ For your Funding '}
                <a className="text-[#EE2F26]">{' need'}</a>
                {', We'}
                {'are Friend in ’'}
                <a className="text-[#EE2F26]">{'deed'}</a>
                {'’'}
              </p>
            </div>
            {(isLaptop || isTablet) && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-gray-200 bg-[url('assets/images/teamwork.png')] bg-auto bg-center p-4 shadow-md">
                  {' '}
                </div>
                <div className="col-span-1 grid justify-items-center bg-white p-4 shadow-md">
                  <motion.div
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    {' '}
                    <img
                      className="h-[70px] w-[70px] max-sm:h-[40px] max-sm:w-[50px] lg:h-[95px] lg:w-[95px]"
                      alt="Card Image"
                      src={experience}
                    />
                  </motion.div>
                  <p className="py-2 text-[18px] font-semibold max-sm:text-[12px] lg:text-[27px]">
                    {'Our Experience'}
                  </p>
                  <p className="text-center text-gray-600 max-sm:text-[9px] md:text-[11px] lg:text-[16px]">
                    {
                      'We aim at giving the best customer experience for the small'
                    }
                    {
                      'businesses. We value the business needs of our clients and'
                    }
                    {
                      'will always be there to forge an everlasting relationship'
                    }
                    {'with our clients by supporting them when it matters the'}
                    {'most.'}
                  </p>
                </div>
                <div className="col-span-1 bg-gray-400 bg-[url('assets/images/group.png')] bg-auto bg-center p-4 shadow-md">
                  {' '}
                </div>

                <div className="col-span-1 grid justify-items-center bg-white p-4 shadow-md">
                  {' '}
                  <motion.div
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    {' '}
                    <img
                      className="h-[70px] w-[70px] max-sm:h-[40px] max-sm:w-[50px] lg:h-[95px] lg:w-[95px]"
                      alt="Card Image"
                      src={mission}
                    />
                  </motion.div>
                  <p className="py-2 text-[18px] font-semibold max-sm:text-[12px] lg:text-[27px]">
                    {'Our Mission'}
                  </p>
                  <p className="text-center text-gray-600 max-sm:text-[9px] md:text-[11px] lg:text-[16px]">
                    {
                      'We strive to be the best friendly financing option for the'
                    }
                    {
                      'small businesses in the UK. Our motto is to support funding'
                    }
                    {'needs of these businesses and to become a part of their'}
                    {'success.'}
                  </p>
                </div>
                <div className="col-span-1 bg-gray-600 bg-[url('assets/images/laptop.png')] bg-auto bg-center p-4 shadow-md"></div>
                <div className="col-span-1 grid justify-items-center bg-white p-4 shadow-md">
                  {' '}
                  <motion.div
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6 }}
                  >
                    {' '}
                    <img
                      className="h-[70px] w-[70px] max-sm:h-[40px] max-sm:w-[50px] lg:h-[95px] lg:w-[95px]"
                      alt="Card Image"
                      src={Vision}
                    />
                  </motion.div>
                  <p className="py-2 text-[18px] font-semibold max-sm:text-[12px] lg:text-[27px]">
                    {'Our Vision'}
                  </p>
                  <p className="text-center text-gray-600 max-sm:text-[9px] md:text-[11px] lg:text-[16px]">
                    {
                      'As our tagline says “For Your Funding need we are friend in'
                    }
                    {
                      'deed” we mean it. We want to be the one and only friendly'
                    }
                    {'financing option for small businesses in the UK'}
                  </p>
                </div>
              </div>
            )}
            {isMobile && (
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-1 h-[150px] bg-gray-200 bg-[url('assets/images/teamwork.png')] bg-auto bg-center p-4 shadow-md">
                  {' '}
                </div>
                <div className="col-span-1 grid justify-items-center bg-white p-4 shadow-md">
                  <img className="h-[40px]" alt="Card Image" src={experience} />
                  <p className="py-2 text-[18px] font-semibold max-sm:text-[12px] lg:text-[27px]">
                    {'Our Experience'}
                  </p>
                  <p className="text-center text-gray-600 max-sm:text-[9px] md:text-[11px] lg:text-[16px]">
                    {
                      'We aim at giving the best customer experience for the small'
                    }
                    {
                      'businesses. We value the business needs of our clients and'
                    }
                    {
                      'will always be there to forge an everlasting relationship'
                    }
                    {'with our clients by supporting them when it matters the'}
                    {'most.'}
                  </p>
                </div>
                <div className="col-span-1 h-[150px] bg-gray-400 bg-[url('assets/images/group.png')] bg-auto bg-center p-4 shadow-md">
                  {' '}
                </div>

                <div className="col-span-1 grid justify-items-center bg-white p-4 shadow-md">
                  {' '}
                  <img className="h-[40px]" alt="Card Image" src={mission} />
                  <p className="py-2 text-[18px] font-semibold max-sm:text-[12px] lg:text-[27px]">
                    {'Our Mission'}
                  </p>
                  <p className="text-center text-gray-600 max-sm:text-[9px] md:text-[11px] lg:text-[16px]">
                    {
                      'We strive to be the best friendly financing option for the'
                    }
                    {
                      'small businesses in the UK. Our motto is to support funding'
                    }
                    {'needs of these businesses and to become a part of their'}
                    {'success.'}
                  </p>
                </div>
                <div className="col-span-1 h-[150px] bg-gray-600 bg-[url('assets/images/laptop.png')] bg-auto bg-center p-4 shadow-md"></div>
                <div className="col-span-1 grid justify-items-center bg-white p-4 shadow-md">
                  {' '}
                  <img className="h-[40px]" alt="Card Image" src={Vision} />
                  <p className="py-2 text-[18px] font-semibold max-sm:text-[12px] lg:text-[27px]">
                    {'Our Vision'}
                  </p>
                  <p className="text-center text-gray-600 max-sm:text-[9px] md:text-[11px] lg:text-[16px]">
                    {
                      'As our tagline says “For Your Funding need we are friend in'
                    }
                    {
                      'deed” we mean it. We want to be the one and only friendly'
                    }
                    {'financing option for small businesses in the UK'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>{' '}
      </motion.div>
    </>
  );
};

export default AsAlwaysSection;
