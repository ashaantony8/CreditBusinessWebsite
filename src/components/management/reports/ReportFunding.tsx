import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useMediaQuery } from 'react-responsive';

import {
  fundingGetApi,
  fundingReportDownloadApi
} from '../../../api/loanServices';
import {
  ApplicationStatusBadgeClasses,
  reportFundingTableHead
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

const ReportFunding = () => {
  // State and hooks
  const [loans, setLoans] = useState([]);
  const [isOpenAddLead, setIsOpenAddLead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  } = usePagination(fundingGetApi);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  // Fetch loans data
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

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
    downloadData();
  }, []);

  const { showToast } = useToast();
  const downloadData = () => {
    handleReportDownload(
      fundingReportDownloadApi,
      setTransactionData,
      showToast,
      undefined
    );
  };
  const [transactionData, setTransactionData] = useState([]);

  // Table rendering for different devices
  const renderTableRows = () => {
    if (!loans?.length) {
      return (
        <tr>
          <td
            colSpan={reportFundingTableHead.length}
            className="px-6 py-4 text-center"
          >
            {'No data available'}
          </td>
        </tr>
      );
    }

    return loans?.map((loan, index) => {
      const {
        customer_id,
        funding_amount,
        funding_term,
        issue_date = 'N/A',
        customer_name = 'Unknown',
        roi = 'N/A',
        outstanding_amount = 'N/A',
        loan_status,
        funding_id
      } = loan;

      const displayCustomerName =
        customer_name.trim().length > 7
          ? `${customer_name.trim().substring(0, 7)}...`
          : customer_name.trim();

      return (
        <tr
          key={index}
          className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
        >
          <td className="whitespace-nowrap px-6 py-4">{funding_id || 'N/A'}</td>
          <td className="whitespace-nowrap px-6 py-4">
            {customer_id || 'N/A'}
          </td>
          <td className="whitespace-nowrap px-6 py-4">
            {displayCustomerName || 'N/A'}
          </td>
          <td className="whitespace-nowrap px-6 py-4">
            {funding_amount || 'N/A'}
          </td>
          <td className="whitespace-nowrap px-6 py-4">{issue_date || 'N/A'}</td>
          <td className="whitespace-nowrap px-6 py-4">
            {funding_term || 'N/A'}
          </td>
          <td className="whitespace-nowrap px-6 py-4">{roi || 'N/A'}</td>
          <td className="whitespace-nowrap px-6 py-4">
            {outstanding_amount || 'N/A'}
          </td>
          <td>
            <span
              className={`inline-flex rounded-full px-3 text-xs leading-5 max-sm:text-[9px] ${
                ApplicationStatusBadgeClasses[
                  loan_status?.current_status ||
                    FundingFromCurrentStatus.Inprogress
                ]
              }`}
            >
              {FundingFromStatusEnum?.[loan_status?.current_status] ||
                FundingFromCurrentStatus.Inprogress}
            </span>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header title="Funding Report">
        <div className="flex gap-4">
          <div>
            <CSVLink
              data={transactionData}
              filename="ReportFunding.csv"
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
                  transactionData.length === 0
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                disabled={transactionData.length === 0}
              >
                {'Download'}
              </button>
            </CSVLink>
          </div>
        </div>
      </Header>

      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white px-2 max-sm:h-[64vh] max-sm:p-4">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {reportFundingTableHead.map(({ name, key }, index) => (
                    <th
                      key={index}
                      className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                      onClick={() => {
                        setIsLoading(true);
                        handleSort();
                      }}
                    >
                      {name}
                      {key === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {renderTableRows()}
              </tbody>
            </table>
          )}

          {isMobile && (
            <>
              {loans?.length > 0 ? (
                loans.map(
                  (
                    {
                      customer_id,
                      funding_amount,
                      funding_term,
                      issue_date = 'N/A',
                      customer_name = 'Unknown',
                      roi = 'N/A',
                      outstanding_amount = 'N/A',
                      loan_status,
                      funding_id
                    },
                    index
                  ) => {
                    const displayCustomerName =
                      customer_name.trim().length > 7
                        ? `${customer_name.trim().substring(0, 7)}...`
                        : customer_name.trim();
                    return (
                      <div key={index} className="container mx-auto pt-4">
                        <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {'Funding ID:'}
                              </span>{' '}
                              {funding_id || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {'Customer ID:'}
                              </span>{' '}
                              {customer_id || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {'Customer Name:'}
                              </span>{' '}
                              {displayCustomerName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {'Funding Amount:'}
                              </span>{' '}
                              {funding_amount || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {'Issue Date:'}
                              </span>{' '}
                              {issue_date || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {'Funding Term:'}
                              </span>{' '}
                              {funding_term || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">{'ROI:'}</span>{' '}
                              {roi || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-700">
                              <span className="font-medium">
                                {'Outstanding Amount:'}
                              </span>{' '}
                              {outstanding_amount || 'N/A'}
                            </div>
                            <div>
                              {'Loan Status:'}
                              <span
                                className={`inline-flex rounded-full px-3 text-xs leading-5 max-sm:text-[9px] ${
                                  ApplicationStatusBadgeClasses[
                                    loan_status?.current_status ||
                                      FundingFromCurrentStatus.Inprogress
                                  ]
                                }`}
                              >
                                {FundingFromStatusEnum?.[
                                  loan_status?.current_status
                                ] || FundingFromCurrentStatus.Inprogress}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div>
                  <td
                    colSpan={reportFundingTableHead.length}
                    className="px-6 py-4 text-center"
                  >
                    {'No data available'}
                  </td>
                </div>
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

      {isOpenAddLead && (
        <AddLead
          isOpenAddLead={isOpenAddLead}
          setIsOpenAddLead={setIsOpenAddLead}
        />
      )}
    </>
  );
};

export default ReportFunding;
