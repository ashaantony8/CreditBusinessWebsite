import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import eliglbleBanner from '../../assets/images/Eligble-banner.png';
import { eligbleData } from '../../utils/data';
import { applyNewLoan, chkCustNewLoan } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import ConfirmModal from '../fundingForms/modals/ConfirmModal';
import Loader from '../Loader';

const slideDown = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const EligbleSection = () => {
  const { showToast } = useToast();
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  const [isEligibleNewLoan, setIsEligibleNewLoan] = useState<{
    isApplicableForNewLoan: boolean;
    loanCount: number;
  }>(null);
  const [newLoanModalOpen, setNewLoanModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

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

      <motion.div
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        variants={slideDown}
      >
        <section id="features" className="bg-color-primary">
          <div className="relative">
            {/* <div className="container  p-6 py-12 mx-auto  lg:px-12  "> */}

            <div className="w-full max-sm:h-[963px] md:h-[780px] lg:h-[883px]">
              <img
                src={eliglbleBanner}
                alt="Your Image"
                className="h-full w-full object-fill"
              />
            </div>

            <div className="container absolute inset-0 mx-auto p-6 py-12 lg:px-12">
              <div className="mx-auto px-4 py-8 lg:px-12">
                <div className="m-auto text-center max-sm:mb-4 md:w-1/2">
                  <p className="my-4 mt-4 font-Playfair text-[40px] font-semibold text-white max-sm:text-2xl">
                    {'Who is Eligible?'}
                  </p>

                  <p className="font-Poppins text-[18px] font-light text-white max-sm:text-[12px]">
                    {'MOST BUSINESSES WHO MEET THESE CRITERIA ARE ELIGIBLE'}
                  </p>
                  <span className="mb-4 mt-4 inline-block h-[1.5px] w-[70px] bg-red-500"></span>
                </div>
                {(isLaptop || isTablet) && (
                  <>
                    <div className="grid grid-cols-2 gap-4 max-sm:gap-1 md:grid-cols-4">
                      {eligbleData.map(eligble => (
                        <div
                          key={eligble.name}
                          data-aos="fade-up"
                          data-aos-delay={eligble.aosDelay}
                          className="card mt-16 grid justify-center justify-items-center space-y-3 p-4 text-center max-sm:p-2 sm:space-y-2"
                        >
                          {' '}
                          <motion.div
                            className="flex items-center justify-center max-sm:mt-7"
                            whileHover={{ rotateY: 180 }}
                            transition={{ duration: 0.6 }}
                          >
                            <img
                              src={eligble.image}
                              className="max-sm:h-[60px] max-sm:w-[60px] md:h-[80px] md:w-[80px] lg:h-[120px] lg:w-[120px]"
                            ></img>
                          </motion.div>
                          <div className="pt-4 font-Playfair font-semibold text-[#C6C6C6] max-sm:text-[14px] md:text-[18px] lg:text-[24px]">
                            {eligble.name}
                          </div>
                          <div className="pt-4 font-light text-[#C6C6C6] max-sm:text-[12px] md:text-[16px] lg:text-[18px]">
                            {eligble.description}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-16 text-center max-sm:mt-8">
                      {authenticated ? (
                        isEligibleNewLoan?.isApplicableForNewLoan ? (
                          <button
                            onClick={handleNewLoanModal}
                            className="bg-color-text-secondary px-10 py-3 text-white hover:bg-blue-800"
                          >
                            {'APPLY NEW FUNDING'}
                          </button>
                        ) : isEligibleNewLoan?.loanCount == 1 ? (
                          <button
                            onClick={() => {
                              navigate(`/funding-form`);
                            }}
                            className="transform bg-color-text-secondary px-10 py-4 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-800"
                          >
                            {'APPLY NOW'}
                          </button>
                        ) : (
                          <></>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            navigate(`/funding-form`);
                          }}
                          className="transform bg-color-text-secondary px-10 py-3 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-800"
                        >
                          {'APPLY NOW'}
                        </button>
                      )}
                    </div>
                  </>
                )}
                {isMobile && (
                  <>
                    <div className="grid grid-cols-2">
                      {eligbleData.map(eligble => (
                        <div
                          key={eligble.name}
                          data-aos="fade-up"
                          data-aos-delay={eligble.aosDelay}
                          className="card mt-8 grid justify-center justify-items-center space-y-3 p-4 text-center max-sm:p-2 sm:space-y-2"
                        >
                          <img
                            src={eligble.image}
                            className="h-[60px] w-[60px]"
                          ></img>

                          <div className="pt-4 font-Playfair text-[18px] font-semibold text-[#C6C6C6]">
                            {eligble.name}
                          </div>

                          <div className="pt-4 font-light text-[#C6C6C6] max-sm:text-[12px] md:text-[16px] lg:text-[18px]">
                            {eligble.description}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-16 text-center max-sm:mt-8">
                      {authenticated ? (
                        isEligibleNewLoan ? (
                          <button
                            onClick={() => {
                              navigate(`/funding-form`);
                            }}
                            className="bg-color-text-secondary px-10 py-3 text-white hover:bg-blue-800"
                          >
                            {'APPLY NEW FUNDING'}
                          </button>
                        ) : isEligibleNewLoan?.loanCount == 1 ? (
                          <button
                            onClick={() => {
                              navigate(`/funding-form`);
                            }}
                            className="transform bg-color-text-secondary px-10 py-3 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-800"
                          >
                            {'APPLY NOW'}
                          </button>
                        ) : (
                          <></>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            navigate(`/funding-form`);
                          }}
                          className="transform bg-color-text-secondary px-10 py-3 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-800"
                        >
                          {'APPLY NOW'}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </motion.div>
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

export default EligbleSection;
