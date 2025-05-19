import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

import { getLoanIds } from '../../api/loanServices';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { FundingSelectModalProps } from '../../utils/types';
import Loader from '../Loader';

interface Funding {
  id: string;
  loan_number: string;
  company_name: string;
}

const FundingSelectModal: React.FC<FundingSelectModalProps> = ({
  close,
  handleSelect
}) => {
  const [loans, setLoans] = useState<Funding[]>([]);
  const [selectedFunding, setSelectedFunding] = useState<{
    id?: string;
  } | null>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const fetchLoan = async (term: string) => {
    setLoading(true);
    try {
      const response = await getLoanIds(term);
      if (response.status_code >= 200 && response.status_code < 300) {
        setLoans(response.data);
      } else {
        showToast('Failed to fetch funding data.', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('An error occurred while fetching funding data.', {
        type: NotificationType.Error
      });
      console.error('Error during API call:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoan(searchTerm);
  }, [searchTerm]);

  const handleSelectFunding = loan => {
    setSelectedFunding(loan);
  };

  const handleConfirmSelection = () => {
    handleSelect(selectedFunding);
    close();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      <div
        className="relative w-full max-w-[800px] md:h-auto"
        aria-modal="true"
        role="dialog"
      >
        <div className="relative flex min-h-[70vh] flex-col rounded bg-white p-4 shadow">
          {/* Close Button */}
          <button
            onClick={close}
            className="absolute right-2 top-2 rounded-lg bg-transparent p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            aria-label="Close modal"
          >
            <RxCross2 size={24} />
          </button>

          {/* Search and Filter */}
          <div className="mb-4 flex gap-2">
            <input
              className="rounded border border-gray-200 p-2"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search funding"
            />
          </div>

          <div className="relative flex-1">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                <Loader />
              </div>
            )}
            <div className="max-h-[50vh] overflow-auto rounded border border-gray-200">
              {loans.map(loan => (
                <div
                  key={loan.id}
                  onClick={() => handleSelectFunding(loan)}
                  className={`cursor-pointer border-b p-2 ${
                    selectedFunding?.id === loan.id
                      ? 'bg-gray-300 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                  role="button"
                  aria-pressed={selectedFunding?.id === loan.id}
                >
                  {`${loan.loan_number} - Company Name: ${loan.company_name}`}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 mt-4 flex justify-end gap-4 bg-white py-4">
            <button
              onClick={handleConfirmSelection}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !selectedFunding}
            >
              {'Select'}
            </button>
            <button
              onClick={close}
              className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              disabled={loading}
            >
              {'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingSelectModal;
