import { useState } from 'react';
import { CiFilter } from 'react-icons/ci';
import { FiPlus } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive';

import Referalform from '../../../pages/profile/Referalform';
import Filter from '../common/Filtex';
import Header, { HeaderProps } from '../common/Header';

type ReferralHeaderProps = HeaderProps;

const ReferralHeader: React.FC<ReferralHeaderProps> = ({
  onSearch,
  onFilterChange,
  dropdownData,
  initialFilters
}) => {
  // const ReferralHeader = ({ onSearch }) => {
  // const [formData,] = useState({
  //   first_name: "",
  //   last_name: "",
  //   phone_number: "",
  //   email: "",
  //   business_name: "",
  // });
  // const [, setIsLoading] = useState(false); // State for loading spinner
  // const { showToast } = useToast();

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [referForm, setReferForm] = useState(false);

  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  const toggleReferForm = () => {
    setReferForm(!referForm);
  };

  const closeReferForm = () => {
    setReferForm(false);
  };
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [isFilterOpened, setFilterOpened] = useState(false);

  // to close the filter component in the child component
  const setFilterHanlder = () => {
    setFilterOpened(prevState => !prevState);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true); // Set loading state to true when form is submitted
  //   try {
  //     const response = await addReferralPostAPI(formData);
  //     console.log("Referral added:", response);
  //     toggleModal();
  //     if (response.status_code >= 200 && response.status_code < 300) {
  //       showToast(response.status_message, { type: NotificationType.Success });
  //     } else {
  //       // Handle other status codes as errors
  //       showToast(response.status_title, { type: NotificationType.Error });
  //     }
  //   } catch (error) {
  //     console.error("Failed to add referral:", error);
  //     showToast(error.status_title, { type: NotificationType.Error });
  //   }
  //   setIsLoading(false); // Set loading state to false after API call completes
  // };

  return (
    <>
      <div className="sticky top-0 z-10 flex h-20 items-center justify-between border-gray-200 bg-white">
        {/* <div className="flex items-center px-4">
          <p className="text-[#000000] font-semibold text-[20px] max-sm:text-[18px]">
            Referral
          </p>
        </div> */}
        <Header title="Referral" onSearch={onSearch} />
        {(isLaptop || isTablet) && (
          <>
            <div className="flex items-center pr-4">
              <>
                <button
                  onClick={toggleReferForm}
                  className="flex items-center rounded-lg border bg-transparent px-5 py-2.5 text-center text-sm font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
                  type="button"
                >
                  <FiPlus size={16} className="mr-2" />
                  {'Add'}
                </button>
                {onFilterChange && (
                  <div className="text-gray-900">
                    <div className="group relative w-full" id="filter-icon">
                      <button
                        className="text-site focus:border-brand peer flex items-center justify-between rounded bg-transparent px-3 py-2.5 font-semibold focus:outline-none focus:ring-0 md:text-sm"
                        onClick={setFilterHanlder}
                      >
                        <CiFilter className="ml-3 h-5 w-6 text-gray-400 hover:text-gray-500" />
                        <a className="text-[14px] tracking-wide text-[#929292]">
                          {'Filter'}
                        </a>
                      </button>
                      {isFilterOpened && (
                        <Filter
                          closeFilterHandler={setFilterHanlder}
                          isOpen={isFilterOpened}
                          onFilterChange={onFilterChange}
                          initialFilters={initialFilters}
                          dropdownData={dropdownData}
                        />
                      )}
                    </div>
                  </div>
                )}{' '}
              </>
            </div>
          </>
        )}
        {isMobile && (
          <>
            <div className="mt-8 flex items-center">
              <>
                <button
                  onClick={toggleReferForm}
                  className="items-centertext-gray-400 flex rounded-lg border bg-transparent px-2 py-2.5 text-center text-sm font-medium hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
                  type="button"
                >
                  <FiPlus size={16} className="mr-2" />
                  {'Add'}
                </button>
                {onFilterChange && (
                  <div className="text-gray-900">
                    <div className="group relative w-full" id="filter-icon">
                      <button
                        className="text-site focus:border-brand peer flex items-center justify-between rounded bg-transparent px-3 py-2.5 font-semibold focus:outline-none focus:ring-0 md:text-sm"
                        onClick={setFilterHanlder}
                      >
                        <CiFilter className="ml-3 h-5 w-6 text-gray-400 hover:text-gray-500" />
                        <a className="text-[14px] tracking-wide text-[#929292]">
                          {'Filter'}
                        </a>
                      </button>
                      {isFilterOpened && (
                        <Filter
                          closeFilterHandler={setFilterHanlder}
                          isOpen={isFilterOpened}
                          onFilterChange={onFilterChange}
                          initialFilters={initialFilters}
                          dropdownData={dropdownData}
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            </div>
          </>
        )}
      </div>
      {referForm && <Referalform closeModal={closeReferForm} />}
    </>
  );
};

export default ReferralHeader;
