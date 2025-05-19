import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useMediaQuery } from 'react-responsive';

import {
  goodStandingReportDownloadApi,
  listGoodStandingReportApi
} from '../../../api/loanServices';
import { reportGoodStandingTableHead } from '../../../utils/data';
import { handleReportDownload } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const ReportGoodStanding = () => {
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
  } = usePagination(listGoodStandingReportApi);

  const [isOpenAddLead, setIsOpenAddLead] = useState(false);

  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const { showToast } = useToast();
  const downloadData = () => {
    handleReportDownload(
      goodStandingReportDownloadApi,
      setTransactionData,
      showToast,
      undefined
    );
  };
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
    downloadData();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header title="GoodStanding Report">
        <div className="flex gap-4">
          <div>
            <CSVLink
              data={transactionData}
              filename="ReportGoodStanding.csv"
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
                  {reportGoodStandingTableHead.map(
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
                        last_payment_date,
                        next_payment_due,
                        outstanding_amount,
                        name,
                        funding_id,
                        funding_amount
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
                          {last_payment_date || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {next_payment_due || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {outstanding_amount || 'N/A'}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={reportGoodStandingTableHead.length}
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
                      customer_id,
                      last_payment_date,
                      next_payment_due,
                      outstanding_amount,
                      name,
                      funding_id,
                      funding_amount
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Customer ID:'}
                            </span>{' '}
                            {customer_id || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{'Name:'}</span>{' '}
                            {name.trim().length > 7
                              ? name.trim().substring(0, 7) + '...'
                              : name.trim() || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{'Funding ID:'}</span>{' '}
                            {funding_id || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Funding Amount:'}
                            </span>{' '}
                            {funding_amount || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Last Payment Date:'}
                            </span>{' '}
                            {last_payment_date || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Next Payment Due:'}
                            </span>{' '}
                            {next_payment_due || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Outstanding Amount:'}
                            </span>{' '}
                            {outstanding_amount || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <td
                    colSpan={reportGoodStandingTableHead.length}
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

export default ReportGoodStanding;
