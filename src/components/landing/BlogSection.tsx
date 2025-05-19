import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { blogData } from '../../utils/data';
import { applyNewLoan, chkCustNewLoan } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import ConfirmModal from '../fundingForms/modals/ConfirmModal';
import Loader from '../Loader';

const BlogSection = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
    <>
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <section className="bg-white">
        <div className="container mx-auto space-y-24 p-6 py-12 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 lg:items-center lg:gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeInRight}
            >
              {' '}
              <div>
                <p className="my-2 font-Playfair text-3xl font-bold leading-normal text-[#02002E] max-sm:text-2xl lg:text-[40px]">
                  {'Our Flexible Funding meet most of your Business Needs'}
                </p>
                <p className="mt-4 py-8 font-light text-[#929292] max-sm:py-4 max-sm:text-base lg:text-[18px]">
                  {
                    'Credit4Business aims to cater to the various business needs of'
                  }
                  {
                    'small businesses. Here are some of the funding needs met by'
                  }
                  {'our quick financing. This is not a complete list as we are'}
                  {'ready to consider any of your valid business requirements.'}
                </p>
                <div className="flex justify-center pt-8 max-sm:pt-4 md:justify-start">
                  {authenticated ? (
                    isEligibleNewLoan?.isApplicableForNewLoan ? (
                      <button
                        onClick={handleNewLoanModal}
                        className="bg-color-text-secondary px-10 py-4 text-white hover:bg-blue-800"
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
                      className="transform bg-color-text-secondary px-10 py-4 text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-800"
                    >
                      {'APPLY NOW'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
            <div aria-hidden="true" className="mt-10 px-2 lg:mt-0">
              <motion.div
                aria-hidden="true"
                initial="hidden"
                whileInView="visible"
                variants={slideDown}
              >
                <div className="xl:shadow-small-blue mx-auto flex flex-wrap justify-center gap-4 px-2 max-sm:gap-0 max-sm:shadow-none md:gap-0 lg:w-full">
                  {blogData.map((blog, index) => (
                    <a
                      key={index}
                      href="#"
                      className="mx-1 my-1 block h-[140px] w-1/4 rounded border py-10 text-center shadow-md max-sm:h-[110px] max-sm:py-4"
                    >
                      <div>
                        <img
                          src={blog.image}
                          className="mx-auto block h-[71px] w-[71px] transform transition-transform duration-300 ease-in-out hover:scale-125 max-sm:h-[30px] max-sm:w-[30px] md:h-[40px] md:w-[40px]"
                        />

                        <p className="font-body pt-2 font-medium text-[#02002E] max-sm:text-[6.5px] md:pt-2 md:text-[11px] lg:text-[13px] xl:text-[16px]">
                          {blog.name}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>{' '}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
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

export default BlogSection;
