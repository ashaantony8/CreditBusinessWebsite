import { useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
// ../../../assets/svg/threeDots.svg
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import { listPapApi } from '../../../api/loanServices';
import { papTableHead } from '../../../utils/data';
import { PapStatusType } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';

export const papStatusBadgeClasses = {
  approved: ` bg-[#c7d0e3] text-[#1A439A]`,
  pending: ` bg-[#f3ccc9] text-[#F02E23] `,
  cancelled: ` bg-amber-300 text-amber-600 `,
  closed: ` bg-gray-300 text-gray-600 `
};

const PapListView: React.FC<{
  setShowCreateView: Dispatch<SetStateAction<boolean>>;
  loanId?: string;
}> = ({ setShowCreateView, loanId }) => {
  const { showToast } = useToast();
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState({ status: [] });
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSearch,
    sortOrder,
    handleSort,
    handleFilter,
    callPaginate,
    userPaginateException
  } = usePagination(listPapApi);

  const navigate = useNavigate();

  const navigateToDetailsPage = planId => {
    navigate(`/pap-details/${planId}`);
  };
  // for sorting
  const [customerIdSortOrder, setCustomerIdSortOrder] = useState<
    'asc' | 'desc'
  >('asc');
  const handleSortColumn = column => {
    if (column === 'id') {
      setCustomerIdSortOrder(prevState =>
        prevState === 'asc' ? 'desc' : 'asc'
      );
      setIsLoading(true);
      handleSort('contract_id', customerIdSortOrder);
    }
  };
  // pagination new code
  useEffect(() => {
    setIsLoading(true);
    if (loanId) {
      handleFilter({
        loan_id: loanId
      });
    } else {
      callPaginate();
    }
  }, [loanId]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setList(data);
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

  const dropdownData = [
    {
      title: 'Status',
      type: 'status',
      items: [
        { id: 'approved', label: 'Approved' },
        { id: 'pending', label: 'Pending' },
        { id: 'cancelled', label: 'Cancelled' },
        { id: 'closed', label: 'Closed' }
      ]
    }
  ];
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });
  const handleFilterChange = newFilters => {
    setFiltered(newFilters);
    setIsLoading(true);
    handleFilter({
      ...(loanId && { loan_id: loanId }),
      status: newFilters.status
    });
  };

  const getStatus = status => {
    switch (status) {
      case PapStatusType.Approved:
        return PapStatusType.Approved;
      case PapStatusType.Pending:
        return PapStatusType.Pending;
      case PapStatusType.Cancelled:
        return PapStatusType.Cancelled;
      default:
        return PapStatusType.Pending;
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header
        title="Pap"
        onFilterChange={handleFilterChange}
        dropdownData={dropdownData}
        initialFilters={filtered}
        onSearch={handleSearch}
        onAdd={() => setShowCreateView(true)}
      />
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {papTableHead.map(({ name, key }, index) => (
                    <th
                      key={index}
                      className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                      onClick={() => handleSortColumn(key)}
                    >
                      {name}
                      {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {list?.length > 0 ? (
                  list.map(
                    (
                      { id, loan_number, company_name, pending_due, status },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {loan_number || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {company_name || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {pending_due || 'N/A'}
                        </td>
                        <td>
                          <span
                            className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs capitalize leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                              papStatusBadgeClasses[getStatus(status)]
                            }`}
                          >
                            {getStatus(status)}
                          </span>
                        </td>

                        <td className="relative whitespace-nowrap px-6 py-4">
                          <button
                            key={index}
                            type="button"
                            className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                            onClick={() => {
                              navigateToDetailsPage(id);
                            }}
                          >
                            {'View'}
                          </button>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={papTableHead.length}
                      className="px-6 py-4 text-center"
                    >
                      {'No data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {isMobile && (
            <>
              {list?.length > 0 ? (
                list.map(
                  (
                    { id, loan_number, company_name, pending_due, status },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="truncate text-lg font-semibold text-gray-900">
                            {loan_number || 'N/A'}
                          </div>
                          <div className="truncate text-sm text-gray-600">
                            {company_name || 'N/A'}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">
                              {'Pending Due:'}
                            </span>
                            <span className="block truncate">
                              {pending_due || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{'Status:'}</span>
                            <span className="block truncate">
                              <span
                                className={`inline-flex rounded-full px-3 text-xs leading-5 ${papStatusBadgeClasses[getStatus(status)]}`}
                              >
                                {getStatus(status)}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="relative mt-4 flex items-center text-[#1A439A] max-sm:text-[11px]">
                          <button
                            type="button"
                            className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                            onClick={() => {
                              navigateToDetailsPage(id);
                            }}
                          >
                            {'View'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className="text-center">{'No data available'}</div>
              )}
            </>
          )}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        goToPage={goToPage}
      />
    </>
  );
};

export default PapListView;
