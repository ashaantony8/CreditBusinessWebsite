import 'swiper/css';
import 'swiper/css/navigation';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { bannerSlides } from '../../utils/data';
import { applyNewLoan, chkCustNewLoan } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import ConfirmModal from '../fundingForms/modals/ConfirmModal';
import Loader from '../Loader';

const BannerSection: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { authenticated } = useAuth();
  const [isEligibleNewLoan, setIsEligibleNewLoan] = useState<{
    isApplicableForNewLoan: boolean;
    loanCount: number;
  }>(null);
  const [newLoanModalOpen, setNewLoanModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const eligibility = await chkCustNewLoan();
        setIsEligibleNewLoan(eligibility);
      } catch (error) {
        console.error('Failed to check eligibility:', error);
        setIsEligibleNewLoan(null); // or handle error state
      }
    };

    checkEligibility();
  }, []);

  const handleNewLoan = async () => {
    try {
      await applyNewLoan(navigate);
    } catch {
      showToast('Failed to apply for a new Funding', {
        type: NotificationType.Error
      });
    }
  };

  const handleNewLoanModal = () => {
    setIsLoading(!newLoanModalOpen);
    setNewLoanModalOpen(prevState => !prevState);
  };

  return (
    <>
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <div className="bg-color-primary">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }}
          loop={true}
          className="mySwiper"
          autoplay={{
            delay: 10000, // Set delay to 10 seconds (10000ms)#1A439A
            reverseDirection: true,
            disableOnInteraction: true // Autoplay will not stop after user interactions
          }}
        >
          {bannerSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="container mx-auto px-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 lg:items-center">
                  <motion.div
                    aria-hidden="true"
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInLeft}
                  >
                    <div className="mt-16 max-sm:order-2 max-sm:mt-4">
                      <p className="font-Poppins max-w-sm text-center text-[26px] max-sm:mt-4 max-sm:text-[17px] md:text-left md:text-[20px] lg:text-[28px]">
                        <a className="text-[#454545]">{slide.title}</a>{' '}
                        <a className="text-[#F02E23]">{slide.title2}</a>
                      </p>
                      <p className="text-center font-Playfair font-medium leading-tight text-[#1A439A] max-sm:text-[24px] md:text-left md:text-[30px] lg:text-[45px] xl:text-[64px]">
                        {slide.description}
                        <br />
                        {slide.description1}
                        <br />
                        <a className="font-bold text-[#F02E23]">{'Funding'}</a>
                      </p>

                      <>
                        <div className="flex justify-center pt-12 max-sm:pt-4 md:justify-start">
                          {authenticated ? (
                            isEligibleNewLoan?.isApplicableForNewLoan ? (
                              <button
                                onClick={handleNewLoanModal}
                                className="bg-[#F02E23] px-10 py-3 text-white hover:bg-[#c8504a] max-sm:py-2 max-sm:text-[12px]"
                              >
                                {slide.description5}
                              </button>
                            ) : isEligibleNewLoan?.loanCount == 1 ? (
                              <button
                                onClick={() => {
                                  navigate(`/funding-form`);
                                }}
                                className="bg-[#F02E23] px-10 py-3 text-white hover:bg-[#c8504a] max-sm:py-2 max-sm:text-[12px]"
                              >
                                {slide.description3}
                              </button>
                            ) : (
                              <></>
                            )
                          ) : (
                            <button
                              onClick={() => {
                                navigate(`/funding-form`);
                              }}
                              className="transform bg-[#F02E23] px-10 py-3 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-[#c8504a] max-sm:py-2 max-sm:text-[12px]"
                            >
                              {slide.description3}
                            </button>
                          )}
                        </div>
                      </>

                      <div className="flex justify-center text-[12px] max-sm:mb-16 max-sm:mt-4 max-sm:pt-1 md:mb-16 md:mt-6 md:justify-start md:pt-8 lg:justify-start lg:pl-4 xl:mb-16 xl:mt-12">
                        {slide.description4}
                      </div>
                      <></>
                    </div>
                  </motion.div>
                  <div aria-hidden="true" className="max-sm:order-1">
                    <div className="relative">
                      <img
                        src={slide.image}
                        alt="Your Image"
                        className="-z-0 block w-full max-sm:h-[250px] md:h-[350px] xl:h-[475px]"
                      />
                      <div className="absolute left-0 top-0 h-1/4 w-full bg-gradient-to-t from-transparent to-[#CDD6E9]"></div>
                      <div className="absolute bottom-0 left-0 h-[10%] w-full bg-gradient-to-b from-transparent to-[#CDD6E9]"></div>
                      <div className="absolute left-0 top-0 h-full w-[30%] bg-gradient-to-r from-[#CDD6E9] to-transparent"></div>
                      <div className="absolute right-0 top-0 h-full w-[30%] bg-gradient-to-l from-[#CDD6E9] to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <FaArrowLeftLong className="swiper-button-prev z-10 flex !h-[36px] !w-[36px] items-center justify-center rounded-full border-4 border-[#8f9fc8] p-1 text-[#8f9fc8] hover:border-color-text-secondary hover:text-color-text-secondary" />
          <FaArrowRightLong className="swiper-button-next z-10 flex !h-[36px] !w-[36px] items-center justify-center rounded-full border-4 border-[#8f9fc8] p-1 text-[#8f9fc8] hover:border-color-text-secondary hover:text-color-text-secondary" />
        </Swiper>
      </div>
      {newLoanModalOpen && (
        <ConfirmModal
          isOpen={newLoanModalOpen}
          onSubmit={handleNewLoan}
          onClose={handleNewLoanModal}
          head="Confirm New Funding Application"
          content="Are you sure you want to proceed with applying for new funding?"
        />
      )}
    </>
  );
};

export default BannerSection;
