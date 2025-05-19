import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useMediaQuery } from 'react-responsive';

import {
  defaultUserReportApi,
  defaultUserReportDownloadApi
} from '../../../api/loanServices';
import { reportDefaultUserTableHead } from '../../../utils/data';
import { handleReportDownload } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const ReportDefaultUser = () => {
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
  } = usePagination(defaultUserReportApi);

  const [isOpenAddLead, setIsOpenAddLead] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const [loans, setLoans] = useState([]);

  const handleSortColumn = column => {
    if (column === 'id') {
      setIsLoading(true);
      handleSort();
    }
  };

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

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
    downloadData();
  }, []);

  const downloadData = () => {
    handleReportDownload(
      defaultUserReportDownloadApi,
      setTransactionData,
      showToast,
      undefined
    );
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header
        title="Default User Report"
        // onSearch={handleSearch}
      >
        <div className="flex gap-4">
          <div>
            <CSVLink
              data={transactionData}
              filename="ReportDefaultUser.csv"
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
                  {reportDefaultUserTableHead.map(
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
                  loans.map(
                    (
                      {
                        funding_amount,
                        customer_id,
                        default_date,
                        funding_id,
                        name,
                        days_overdue,
                        contact_details,
                        outstanding_amount
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
                        {/* <td className="px-6 py-4 whitespace-nowrap">{customer?.agent}</td> */}
                        <td className="px-6 py-4">
                          {name.trim().length > 7
                            ? name.trim().substring(0, 7) + '...'
                            : name.trim() || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {funding_id || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {funding_amount || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {default_date || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {days_overdue || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {outstanding_amount || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {(contact_details && `+44 ${contact_details}`) ||
                            'N/A'}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={reportDefaultUserTableHead.length}
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
                loans.map(
                  (
                    {
                      funding_amount,
                      customer_id,
                      default_date,
                      funding_id,
                      name,
                      days_overdue,
                      contact_details,
                      outstanding_amount
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-800">
                            {'Customer ID:'}{' '}
                            <span className="text-gray-600">
                              {customer_id || 'N/A'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {'Funding ID:'}{' '}
                            <span className="font-medium">
                              {funding_id || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <hr className="my-2 border-gray-200" />
                        <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                          <div>
                            <span className="font-medium">{'Name:'}</span>{' '}
                            {name || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Funding Amount:'}
                            </span>{' '}
                            {funding_amount || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Default Date:'}
                            </span>{' '}
                            {default_date || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Days Overdue:'}
                            </span>{' '}
                            {days_overdue || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Outstanding Amount:'}
                            </span>{' '}
                            {outstanding_amount || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{'Contact:'}</span>{' '}
                            {contact_details ? `+44 ${contact_details}` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <td
                    colSpan={reportDefaultUserTableHead.length}
                    className="px-6 py-4 text-center"
                  >
                    {'No data available'}
                  </td>
                </div>
              )}
            </>
          )}
          <div></div>
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

export default ReportDefaultUser;
