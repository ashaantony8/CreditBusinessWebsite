import { useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import { listCashReceiptsApi } from '../../../api/loanServices';
import { cashPaymentTableHead } from '../../../utils/data';
import { PapStatusType } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import { papStatusBadgeClasses } from '../pap/PapListView';

const ReceiptListView: React.FC<{
  setShowCreateView: Dispatch<SetStateAction<boolean>>;
  loanId?: string;
}> = ({ setShowCreateView, loanId }) => {
  const { showToast } = useToast();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleFilter,
    // handleSearch,
    sortOrder,
    // handleSort,
    callPaginate,
    userPaginateException
  } = usePagination(listCashReceiptsApi);

  const navigate = useNavigate();

  const navigateToDetailsPage = id => {
    navigate(`/cash-receipt/${id}`);
  };

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

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

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
      <div>
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <Header
          title="Cash Payment"
          // onFilterChange={handleFilterChange}
          // dropdownData={dropdownData}
          // initialFilters={filtered}
          // onSearch={handleSearch}
          onAdd={() => setShowCreateView(true)}
        />
        <div className="mt-2 flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
          <div className="px-2 max-sm:p-4">
            {(isLaptop || isTablet) && (
              <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
                <thead className="bg-[#D3D3D3]">
                  <tr>
                    {cashPaymentTableHead.map(({ name, key }, index) => (
                      <th
                        key={index}
                        className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                        // onClick={() => handleSortColumn(key)}
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
                        {
                          id,
                          loan_number,
                          is_approved,
                          company_name,
                          pending_due
                        },
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
                            {pending_due === 0 ? 0 : pending_due || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 text-xs leading-5 ${papStatusBadgeClasses[getStatus(is_approved)]}`}
                            >
                              {getStatus(
                                is_approved
                                  ? PapStatusType.Approved
                                  : PapStatusType.Pending
                              )}
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
                        colSpan={cashPaymentTableHead.length}
                        className="px-6 py-4 text-center"
                      >
                        {'No data available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* <div className="hidden max-md:block">
            {list?.length > 0 ? (
              list.map(({ id, contract_id, is_approved }, index) => (
                <div key={index} className="container mx-auto pt-4">
                  <div className="bg-[#FFFFFF] border border-[#C5C5C5] p-4 flex justify-between mb-4 items-center">
                    <div className="flex items-center font-medium">
                      <div>
                        <div className="font-medium text-[12px]">
                          {contract_id}
                        </div>
                        <div className="py-1 text-[9px]">
                          {is_approved ? "Approved" : "Pending"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-[#1A439A] max-sm:text-[11px] relative">
                      <img
                        src={threeDots}
                        onClick={() => {
                          navigateToDetailsPage(id, contract_id, is_approved);
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">No data available</div>
            )}
          </div> */}

            {isMobile && (
              <>
                {list?.length > 0 ? (
                  list.map(
                    (
                      {
                        id,
                        loan_number,
                        is_approved,
                        company_name,
                        pending_due
                      },
                      index
                    ) => (
                      <div
                        key={index}
                        className="container mx-auto pt-4"
                        onClick={() => {
                          navigateToDetailsPage(id);
                        }}
                      >
                        <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
                          <div className="flex items-center justify-between">
                            <div className="truncate text-lg font-semibold text-gray-900">
                              {loan_number || 'N/A'}
                            </div>
                            <span className="block truncate">
                              <span
                                className={`inline-flex rounded-full px-3 text-xs leading-5 ${papStatusBadgeClasses[getStatus(is_approved)]}`}
                              >
                                {getStatus(
                                  is_approved
                                    ? PapStatusType.Approved
                                    : PapStatusType.Pending
                                )}
                              </span>
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">
                                {'Company Name:'}
                              </span>
                              <span className="block truncate">
                                {company_name || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Pending Due:'}
                              </span>
                              <span className="block truncate">
                                {pending_due === 0 ? 0 : pending_due || 'N/A'}
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

export default ReceiptListView;
