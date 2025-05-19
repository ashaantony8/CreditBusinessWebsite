import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

import { fetchUnitCustomersNonPaginatedApi } from '../../../api/userServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { UnitCustomerSelectModalProps } from '../../../utils/types';
import Loader from '../../Loader';

// Define type for customers
interface Customer {
  id: string;
  display: string;
}

const UnitCustomerSelectModal: React.FC<UnitCustomerSelectModalProps> = ({
  close,
  link,
  notInCompanyId
}) => {
  const [codeType, setCodeType] = useState<string>('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const fetchCustomersNonPaginated = async (
    notInCompanyId: string,
    term: string,
    filter: string
  ) => {
    setLoading(true);
    try {
      const response = await fetchUnitCustomersNonPaginatedApi(
        notInCompanyId,
        term,
        filter
      );
      if (response.status_code >= 200 && response.status_code < 300) {
        const fetchedGlIds = response.data.map(customer => ({
          id: customer.id,
          display: `${customer.customer_id} - ${customer.first_name} ${customer.last_name}`
        }));
        setCustomers(fetchedGlIds);
      } else {
        showToast('Failed to fetch customer data.', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('An error occurred while fetching customer data.', {
        type: NotificationType.Error
      });
      console.error('Error during API call:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notInCompanyId) {
      fetchCustomersNonPaginated(notInCompanyId, searchTerm, codeType);
    }
  }, [searchTerm, codeType]);

  const toggleCustomerSelection = (id: string) => {
    setSelectedCustomerIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleConfirmSelection = () => {
    link(selectedCustomerIds);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCodeTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeType(e.target.value);
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

          {/* SeCusto
Custo
Custoarch and Filter */}
          <div className="mb-4 flex gap-2">
            <input
              className="rounded border border-gray-200 p-2"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search customers"
            />
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="codeTypeAll"
                name="codeType"
                value="all"
                checked={codeType === 'all'}
                onChange={handleCodeTypeChange}
              />
              <label htmlFor="codeTypeAll" className="cursor-pointer">
                {'All'}
              </label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="codeTypeCustomer"
                name="codeType"
                value="customer"
                checked={codeType === 'customer'}
                onChange={handleCodeTypeChange}
              />
              <label htmlFor="codeTypeCustomer" className="cursor-pointer">
                {'Customer'}
              </label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="radio"
                id="codeTypeLead"
                name="codeType"
                value="lead"
                checked={codeType === 'lead'}
                onChange={handleCodeTypeChange}
              />
              <label htmlFor="codeTypeLead" className="cursor-pointer">
                {'Lead'}
              </label>
            </div>
          </div>

          {/* Customer List or Loader */}
          <div className="relative flex-1">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                <Loader />
              </div>
            )}
            <div className="max-h-[50vh] overflow-auto rounded border border-gray-200">
              {customers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => toggleCustomerSelection(customer.id)}
                  className={`cursor-pointer border-b p-2 ${
                    selectedCustomerIds.includes(customer.id)
                      ? 'bg-gray-200'
                      : 'hover:bg-gray-100'
                  }`}
                  role="button"
                  aria-pressed={selectedCustomerIds.includes(customer.id)}
                >
                  {customer.display}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 mt-4 flex justify-end gap-4 bg-white py-4">
            <button
              onClick={handleConfirmSelection}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || selectedCustomerIds.length === 0}
            >
              {'Link'}
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

export default UnitCustomerSelectModal;
