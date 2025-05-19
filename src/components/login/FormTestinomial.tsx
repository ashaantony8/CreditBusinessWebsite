import 'swiper/css';
import 'swiper/css/pagination';
import './style.css';

import { useMediaQuery } from 'react-responsive';
import { Swiper, SwiperSlide } from 'swiper/react';

import image from '../../assets/images/form-image.png';
import logo from '../../assets/images/formLogo.png';
import { formtestimonialData } from '../../utils/data';
export default function FormTestinomial() {
  const pagination = {
    clickable: true
  };
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  return (
    <div className="max-sm:hidden">
      <Swiper
        pagination={pagination}
        className=""
        style={
          {
            '--swiper-pagination-color': '#FFFFFF',
            '--swiper-pagination-bullet-inactive-color': '#5E7CB8',
            '--swiper-pagination-bullet-inactive-opacity': '1',
            '--swiper-pagination-bullet-size': '13px',
            '--swiper-pagination-bullet-horizontal-gap': '4px'
          } as React.CSSProperties
        }
      >
        {formtestimonialData.map((formtestimonialData, index) => (
          <SwiperSlide key={index}>
            <div aria-hidden="true" className="hefffffader">
              <div className="relative h-screen">
                <img
                  src={image}
                  alt="Your Image"
                  className="-z-0 block h-full w-full object-fill opacity-75"
                />
                <div className="absolute left-0 top-0 h-1/2 w-full bg-gradient-to-t from-transparent to-[#2f5280]"></div>
                <div className="absolute bottom-0 left-0 h-[60%] w-full bg-gradient-to-b from-transparent to-[#1A439A]"></div>
                <div className="absolute left-0 top-0 h-full w-[5%] bg-gradient-to-r from-[#26436A] to-transparent"></div>
                <div className="absolute right-0 top-0 h-full w-[30%] bg-gradient-to-l from-[#1A439A] to-transparent"></div>

                <div className="absolute inset-0 grid content-around px-16">
                  <div className="mx-auto flex items-center px-4 py-2 md:mx-0 md:mr-auto">
                    <img
                      src={logo}
                      alt="Logo"
                      className="max-sm:w-[170px] md:h-[50px] md:w-[150px] lg:h-[70px] lg:w-[190px] xl:w-[100%]"
                    />
                  </div>

                  <div></div>
                  <div className="font-Playfair">
                    {(isLaptop || isMobile) && (
                      <div className="text-[54.72px] font-extrabold leading-none text-[#FFFFFF] max-sm:text-[20px]">
                        {formtestimonialData.label}{' '}
                        <a className="text-[#EF2E25]">
                          {formtestimonialData.name}
                        </a>
                      </div>
                    )}
                    {isTablet && (
                      <div className="text-[32.72px] font-extrabold leading-tight text-[#FFFFFF] max-sm:text-[20px]">
                        {formtestimonialData.label}{' '}
                        <a className="text-[#EF2E25]">
                          {formtestimonialData.name}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
