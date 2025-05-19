import 'swiper/css';
import 'swiper/css/pagination';
import 'react-animated-slider/build/horizontal.css';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { FaQuoteLeft } from 'react-icons/fa';
import SwiperCore from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { testimonialData } from '../../utils/data';

SwiperCore.use([Pagination]);

const Testimonial = () => {
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
  const [swiper, setSwiper] = useState(null);

  return (
    <>
      <Swiper
        modules={[Pagination]}
        spaceBetween={40}
        centeredSlides={true}
        onSwiper={swiper => {
          setSwiper(swiper);
        }}
        // onActiveIndexChange={(swiper) => {
        //   console.log("active index is", swiper.activeIndex);
        // }}
      >
        <div className="mt-8 bg-white">
          {testimonialData.map((testimonialData, index) => (
            <SwiperSlide key={index}>
              <div>
                <div className="container mx-auto p-6 py-12 lg:px-12">
                  <div className="grid grid-cols-2 max-sm:grid-cols-1">
                    <div className="px-2">
                      <div className="flex">
                        {' '}
                        <p className="tracki my-2 font-Playfair text-3xl font-bold text-[#02002E] max-sm:py-0 max-sm:text-2xl lg:text-[40px]">
                          {'Success Stories'}
                        </p>
                        <span className="ml-4 mt-8 inline-block h-[1.5px] w-[70px] bg-red-500 max-sm:mb-0 max-sm:w-[40px]"></span>
                      </div>
                      <FaQuoteLeft
                        size={25}
                        color="#1A439A"
                        className="absolute mt-2 lg:mt-8"
                      />{' '}
                      <motion.div
                        aria-hidden="true"
                        initial="hidden"
                        whileInView="visible"
                        variants={slideDown}
                      >
                        {' '}
                        <p className="mt-4 italic text-[#565050] first-letter:ml-10 max-sm:text-[12px] lg:mt-8 lg:text-[22px]">
                          {testimonialData.label}
                        </p>
                        <div></div>
                        <p className="mt-20 text-[16px] font-semibold text-[#1A439A] max-sm:mt-2 max-sm:text-[10px]">
                          {testimonialData.name}
                        </p>
                        <p className="text-[16px] text-[#02002E] max-sm:text-[10px]">
                          {' '}
                          {testimonialData.address}
                        </p>
                      </motion.div>
                      {/* <div className="text-end  ">
                        <button
                          className="button"
                          onClick={() => {
                            swiper.slidePrev();
                          }}
                        >
                          <BsArrowLeft
                            size={28}
                            className="w-[42px] h-[31.03px] text-[#666666]"
                          />
                        </button>
                        <button
                          className="button "
                          onClick={() => {
                            swiper.slideNext();
                          }}
                        >
                          <BsArrowRight
                            size={28}
                            className="w-[42px] h-[31.03px] text-[#666666]"
                          />
                        </button>
                      </div> */}
                    </div>

                    <motion.div
                      initial="hidden"
                      whileInView="visible"
                      variants={fadeInRight}
                    >
                      <div
                        aria-hidden="true"
                        className="mt-16 px-12 max-sm:mt-0 max-sm:hidden"
                      >
                        <img
                          src={testimonialData.image}
                          className="h-[100%] w-[819px]"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
      <div className="-mt-4 text-center">
        <button
          className="button"
          onClick={() => {
            swiper.slidePrev();
          }}
        >
          <BsArrowLeft
            size={28}
            className="h-[31.03px] w-[42px] text-[#666666]"
          />
        </button>
        <button
          className="button"
          onClick={() => {
            swiper.slideNext();
          }}
        >
          <BsArrowRight
            size={28}
            className="h-[31.03px] w-[42px] text-[#666666]"
          />
        </button>
      </div>
    </>
  );
};

export default Testimonial;
