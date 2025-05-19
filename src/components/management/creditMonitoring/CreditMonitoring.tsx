import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

// import threeDots from '../../assets/svg/threeDots.svg'
// import ActionModal from './common/ThreeDotAction'
import { listFailedMandatesApi } from '../../../api/loanServices';
import SidebarLayout from '../../../pages/layout/SidebarLayout';
import { CreditDefaultTableHead } from '../../../utils/data';
import { CreditMonitoringStatusType } from '../../../utils/enums';
import { truncateString } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';

export const creditMonitoringStatusBadgeClasses = {
  Failed: ` bg-[#f3ccc9] text-[#F02E23] `
};

const CreditMonitoring = () => {
  const { showToast } = useToast();

  const {
    data,
    currentPage,
    // filter,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    // handleSearch,
    handleSort,
    sortOrder,
    callPaginate,
    // handleFilter,
    // setMode,
    // setCurrentStatus
    userPaginateException
  } = usePagination(listFailedMandatesApi);
  // const [filtered, setFiltered] = useState({
  //   status: [],
  // });
  // const [isAction, setIsAction] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [actionLeadId, setActionLeadId] = useState(null)
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

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
      handleSort('loan_number', customerIdSortOrder);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      navigate(`/default/${selectedId}`);
    }
  }, [isModalOpen]);

  // const dropdownData = [
  //   {
  //     title: "Status",
  //     type: "status",
  //     items: [{ id: "failed", label: "Failed" }],
  //   },
  // ];

  // const handleFilterChange = (newFilters) => {
  //   setFiltered(newFilters);
  //   setIsLoading(true);
  //   handleFilter({
  //     ...filter,
  //     status: newFilters.status,
  //   });
  // };

  useEffect(() => {
    if (userPaginateException) {
      showToast(userPaginateException as string, {
        type: NotificationType.Error
      });
      setIsLoading(false);
    }
  }, [userPaginateException]);

  return (
    <SidebarLayout>
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
          title="Credit Monitoring"
          // onSearch={handleSearch}
          // onFilterChange={handleFilterChange}
          // dropdownData={dropdownData}
          // initialFilters={filtered}
        />
        <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
          <div className="px-2 max-sm:p-4">
            {(isLaptop || isTablet) && (
              <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border max-md:hidden">
                <thead className="bg-[#D3D3D3]">
                  <tr>
                    {CreditDefaultTableHead.map(
                      (
                        { name, key }: { name: string; key?: string },
                        index
                      ) => (
                        <th
                          key={index}
                          className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                          onClick={() => handleSortColumn(key)}
                        >
                          {name}
                          {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data?.length > 0 ? (
                    data?.map(
                      (
                        {
                          id,
                          loan_number,
                          created_on,
                          amount,
                          mandate,
                          previous_comment
                        },
                        index
                      ) => (
                        <tr
                          key={index}
                          className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                        >
                          <td className="whitespace-nowrap px-6 py-4">{`${
                            index + 1
                          }`}</td>

                          <td className="whitespace-nowrap px-6 py-4">
                            {loan_number || 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {created_on
                              ? dayjs(created_on).format('DD-MM-YY')
                              : 'N/A'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {amount || 'N/A'}
                          </td>
                          <td>
                            <span
                              className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                                mandate?.status === 'failed' &&
                                creditMonitoringStatusBadgeClasses[
                                  CreditMonitoringStatusType.Failed
                                ]
                              }`}
                            >
                              {mandate?.status === 'failed' &&
                                CreditMonitoringStatusType.Failed}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap px-6 py-4">
                            {previous_comment?.comment?.length > 0
                              ? truncateString(previous_comment?.comment, 20)
                              : '--'}
                          </td>
                          <td className="relative whitespace-nowrap px-6 py-4">
                            {previous_comment?.created_on.length > 0
                              ? dayjs(previous_comment?.created_on).format(
                                  'DD-MM-YY'
                                )
                              : '--'}
                          </td>
                          <td className="relative whitespace-nowrap px-6 py-4">
                            {previous_comment?.created_by.first_name
                              ? truncateString(
                                  `${previous_comment?.created_by?.first_name} ${previous_comment?.created_by?.last_name}`,
                                  20
                                )
                              : '--'}
                          </td>
                          <td className="relative whitespace-nowrap px-6 py-4">
                            {/* <img
                            src={threeDots}
                            onClick={() => {
                              setContractId(customer_loan)
                              setMandateId(mandate.id)
                              setActionLeadId(id)
                              setIsRecommendedForLegalAction(loan_status.current_status === "Moved_To_Legal")
                              setIsAction(prevState =>
                                actionLeadId !== id ? true : !prevState
                              )
                            }}
                            className='cursor-pointer'
                          />
                          {isAction && actionLeadId === id && (
                            <div className='absolute top-0 right-0 mt-8 z-10'>
                              <ActionModal
                                setIsAction={setIsAction}
                                setIsModalOpen={setIsModalOpen}
                              />
                            </div>
                          )} */}

                            <button
                              type="button"
                              className="mr-2 flex cursor-pointer bg-[#1A439A] px-8 py-2 text-white"
                              onClick={() => {
                                setSelectedId(id);
                                // setActionLeadId(id)
                                setIsModalOpen(true);
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
                        colSpan={CreditDefaultTableHead.length}
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
                {data?.length > 0 ? (
                  data.map(
                    (
                      {
                        id,
                        loan_number,
                        created_on,
                        amount,
                        mandate,
                        previous_comment
                      },
                      index
                    ) => (
                      <div key={index} className="container mx-auto pt-4">
                        <div className="relative flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
                          {/* Header Section */}
                          <div className="flex items-center justify-between">
                            <div className="truncate text-lg font-semibold text-gray-800">
                              {'Loan #'}
                              {loan_number || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {created_on
                                ? dayjs(created_on).format('DD-MM-YY')
                                : 'N/A'}
                            </div>
                          </div>

                          {/* Details Section */}
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">{'Amount:'}</span>
                              <span className="block truncate">
                                {amount || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">{'Status:'}</span>
                              <span
                                className={`block inline-flex rounded-full px-3 text-xs leading-5 ${
                                  mandate?.status === 'failed'
                                    ? creditMonitoringStatusBadgeClasses[
                                        CreditMonitoringStatusType.Failed
                                      ]
                                    : ''
                                }`}
                              >
                                {mandate?.status === 'failed'
                                  ? CreditMonitoringStatusType.Failed
                                  : 'N/A'}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">
                                {'Previous Comment:'}
                              </span>
                              <span className="block truncate">
                                {previous_comment?.comment?.length > 0
                                  ? truncateString(previous_comment.comment, 20)
                                  : '--'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Commented On:'}
                              </span>
                              <span className="block truncate">
                                {previous_comment?.created_on?.length > 0
                                  ? dayjs(previous_comment.created_on).format(
                                      'DD-MM-YY'
                                    )
                                  : '--'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">
                                {'Commented By:'}
                              </span>
                              <span className="block truncate">
                                {previous_comment?.created_by?.first_name
                                  ? truncateString(
                                      `${previous_comment.created_by.first_name} ${previous_comment.created_by.last_name}`,
                                      20
                                    )
                                  : '--'}
                              </span>
                            </div>
                          </div>

                          {/* View Button */}
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              className="rounded bg-[#1A439A] px-6 py-2 text-white transition-colors hover:bg-[#163c7e]"
                              onClick={() => {
                                setSelectedId(id);
                                setIsModalOpen(true);
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
    </SidebarLayout>
  );
};

export default CreditMonitoring;
