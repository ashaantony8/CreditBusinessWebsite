import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useMediaQuery } from 'react-responsive';

import {
  customerReportDownloadApi,
  CustomerReportGetApi
} from '../../../api/loanServices';
import {
  ApplicationStatusBadgeClasses,
  reportCustomerTableHead
} from '../../../utils/data';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum
} from '../../../utils/enums';
import { handleReportDownload } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const ReportCustomer = () => {
  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSort,
    sortOrder,
    callPaginate,
    userPaginateException
  } = usePagination(CustomerReportGetApi);

  const { showToast } = useToast();
  const downloadData = () => {
    handleReportDownload(
      customerReportDownloadApi,
      setTransactionData,
      showToast,
      undefined
    );
  };
  const [transactionData, setTransactionData] = useState([]);

  const [isOpenAddLead, setIsOpenAddLead] = useState(false);

  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSortColumn = column => {
    if (column === 'id') {
      setIsLoading(true);
      handleSort();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
    downloadData();
  }, []);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    if (data) {
      setIsLoading(false);
      setLoans(data);
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

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header title="Customer Report">
        {' '}
        <div className="flex gap-4">
          <div>
            <CSVLink
              data={transactionData}
              filename="ReportCustomer.csv"
              target="_blank"
              onClick={event => {
                if (transactionData.length === 0 || loans.length === 0) {
                  event.preventDefault();
                  showToast('No data available for download.', {
                    type: NotificationType.Error
                  });
                } else {
                  showToast('Download started successfully!', {
                    type: NotificationType.Success
                  });
                }
              }}
            >
              <button
                className={`rounded bg-blue-500 px-4 py-2 text-white ${
                  loans.length === 0 || transactionData.length === 0
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                disabled={loans.length === 0 || transactionData.length === 0}
              >
                {'Download'}
              </button>
            </CSVLink>
          </div>
        </div>
      </Header>
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {reportCustomerTableHead.map(
                    ({ name, key }: { name: string; key?: string }, index) => (
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
                {loans?.length > 0 ? (
                  loans?.map(
                    (
                      {
                        customer_id,
                        name,
                        contact_details,
                        funding_id,
                        funding_status
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {customer_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {name.trim().length > 7
                            ? name.trim().substring(0, 7) + '...'
                            : name.trim() || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {(contact_details && `+44 ${contact_details}`) ||
                            'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {funding_id || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {funding_status || 'N/A'}
                        </td>
                        <td>
                          <span
                            className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                              ApplicationStatusBadgeClasses[funding_status] ||
                              'bg-gray-300'
                            }`}
                          >
                            {FundingFromStatusEnum?.[funding_status] ||
                              funding_status ||
                              'N/A'}
                          </span>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={reportCustomerTableHead.length}
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
              {loans?.length > 0 ? (
                loans?.map(
                  (
                    {
                      customer_id,
                      name,
                      contact_details,
                      funding_id,
                      funding_status
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                        <div className="flex flex-col gap-2 text-sm text-gray-800">
                          <div>
                            <span className="font-medium">
                              {'Customer ID:'}
                            </span>{' '}
                            {customer_id || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{'Name:'}</span>{' '}
                            {name?.trim().length > 7
                              ? name.trim().substring(0, 7) + '...'
                              : name.trim() || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{'Contact:'}</span>{' '}
                            {contact_details ? `+44 ${contact_details}` : 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{'Funding ID:'}</span>{' '}
                            {funding_id || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Funding Status:'}
                            </span>{' '}
                            {funding_status || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Application Status:'}
                            </span>
                            <span
                              className={`mt-1 inline-flex rounded-full px-3 text-xs leading-5 ${
                                ApplicationStatusBadgeClasses[
                                  funding_status?.current_status ||
                                    FundingFromCurrentStatus.Inprogress
                                ]
                              }`}
                            >
                              {FundingFromStatusEnum?.[funding_status] ||
                                funding_status ||
                                'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <td
                    colSpan={reportCustomerTableHead.length}
                    className="px-6 py-4 text-center"
                  >
                    {'No data available'}
                  </td>
                </div>
              )}
            </>
          )}
          <div>
            {/* {isDeleteModalOpen && (
              <DeleteModals
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
              />
            )} */}

            {/* {loanId && isModalOpen && (
              <AgentLeadModal
                isOpen={isModalOpen}
                loanId={loanId}
                onClose={closeModal}
              />
            )} */}
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
      {isOpenAddLead && (
        <AddLead
          isOpenAddLead={isOpenAddLead}
          setIsOpenAddLead={setIsOpenAddLead}
        />
      )}
    </>
  );
};

export default ReportCustomer;
