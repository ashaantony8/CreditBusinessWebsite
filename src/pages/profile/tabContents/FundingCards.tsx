import { useEffect, useState } from 'react';
import { listAndSortCustomerLoanApi } from '../../../api/loanServices';
import { ApplicationStatusBadgeClasses } from '../../../utils/data';
import build from '../../../assets/svg/unit-company.svg';
import { FundingFromStatusEnum } from '../../../utils/enums';
import usePagination from '../../../components/management/common/usePagination';
import { useNavigate } from 'react-router-dom';
import { applyNewLoan, chkCustNewLoan } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import ConfirmModal from '../../../components/fundingForms/modals/ConfirmModal';
import Loader from '../../../components/Loader';
import { FundingCardProps } from '../../../utils/types';

const FundingCard: React.FC<FundingCardProps> = ({
  customerId,
  setSelectedFundingId,
  setMenuHistory,
  setSelectedMenu,
  setSelectedCompanyId,
  unitId
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data, handleFilter, userPaginateException } = usePagination(
    listAndSortCustomerLoanApi
  );

  const [funding, setFunding] = useState([]);
  const [isEligibleNewLoan, setIsEligibleNewLoan] = useState<{
    isApplicableForNewLoan: boolean;
    loanCount: number;
  }>(null);
  const [newLoanModalOpen, setNewLoanModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setFunding(data);
      // setSelectedCompanyId(data.unit.id)
    }
  }, [data]);

  useEffect(() => {
    if (userPaginateException) {
      showToast(userPaginateException as string, {
        type: NotificationType.Error
      });
      setIsLoading(false);
    }
  }, [userPaginateException]);

  const handleCardClick = id => {
    setSelectedFundingId(id);
    const selectedFUnding = data.find(item => item.id === id);
    setSelectedCompanyId(selectedFUnding.unit.id);

    setMenuHistory(prev => {
      const updatedHistory = [...prev];

      // Check if the second item exists and if it contains an array
      if (updatedHistory.length >= 2) {
        const secondItem = updatedHistory[1];

        // Find the key of the second item dynamically
        const key = Object.keys(secondItem)[0]; // This grabs the first key of the second item

        if (Array.isArray(secondItem[key])) {
          // Only push "fundingDetails" if it is not already in the array
          if (!secondItem[key].includes('fundingDetails')) {
            secondItem[key].push('fundingDetails');
          }
        }
      }

      return updatedHistory;
    });

    setSelectedMenu('fundingDetails');
  };

  useEffect(() => {
    if (customerId && unitId) {
      setIsLoading(true);
      handleFilter({ customer_id: customerId, company_id: unitId });
    } else if (customerId) {
      setIsLoading(true);
      handleFilter({ customer_id: customerId });
    }
  }, [customerId, unitId]);

  const handleNewLoan = async () => {
    try {
      await applyNewLoan(navigate);
    } catch {
      showToast('Failed to apply for a new Funding', {
        type: NotificationType.Error
      });
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
      <div className="mt-8 flex h-full w-full flex-col gap-4 overflow-y-auto pr-8 max-lg:h-[65vh]">
        <div className="flex justify-end pr-4">
          {isEligibleNewLoan?.isApplicableForNewLoan && (
            <button
              type="button"
              onClick={handleNewLoanModal}
              className="bg-color-text-secondary px-10 py-4 text-white hover:bg-blue-800"
            >
              APPLY NEW FUNDING
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 max-md:grid-cols-1">
          {funding.length > 0 ? (
            funding.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between gap-2 rounded-lg border border-gray-400/40 bg-white p-4 shadow-md"
              >
                <div className="bg-white-300 mb-2 flex flex-wrap items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 hidden items-center justify-center rounded-full border-4 border-white bg-[#E8E8E8] p-3 text-xl font-semibold text-[#1A439A] sm:flex">
                      <img src={build} className="h-5 w-5" />
                    </div>
                    <div className="text-[12px] font-medium leading-6">
                      <p className="font-semibold text-[#929292]">
                        Company Name
                      </p>
                      {item.unit.company_name || 'Company Name'}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <a className="text-[13px] text-[#929292]">Current Status</a>
                    <span
                      className={`ml-2 inline-flex rounded-full px-3 text-xs leading-5 ${
                        ApplicationStatusBadgeClasses[
                          item.loan_status.current_status
                        ] || 'bg-green-200 text-[#3cb861]'
                      }`}
                    >
                      {FundingFromStatusEnum?.[item.loan_status.current_status]}
                    </span>
                  </div>
                </div>

                <hr />

                <div className="mt-2 grid grid-cols-2 gap-4 text-[13px] text-gray-800">
                  <p className="mb-2 grid">
                    <strong>Funding Id:</strong> {item.loan_number || 'N/A'}
                  </p>

                  <p className="mb-2 grid">
                    <strong>Company Number:</strong>{' '}
                    {item.unit.company_id || 'N/A'}
                  </p>
                </div>
                <div className="flex justify-end">
                  <a
                    onClick={() => handleCardClick(item.id)}
                    className="text-[#929292] hover:cursor-pointer hover:text-[#1A439A]"
                  >
                    View
                  </a>
                </div>
              </div>
            ))
          ) : (
            <h1>No Data found</h1>
          )}
        </div>
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

export default FundingCard;
