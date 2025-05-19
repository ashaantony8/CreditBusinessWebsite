import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useMediaQuery } from 'react-responsive';

import {
  pendingDueGetApi,
  pendingDueReportDownloadApi
} from '../../../api/loanServices';
import { reportPendingDueTableHead } from '../../../utils/data';
import { handleReportDownload } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';
// import { managementSliceSelector } from "../../../store/managementReducer";
// import { useSelector } from "react-redux";

const ReportPendingDue = () => {
  // const { user } = useSelector(managementSliceSelector);

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
  } = usePagination(pendingDueGetApi);

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
      pendingDueReportDownloadApi,
      setTransactionData,
      showToast,
      undefined
    );
  };

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
    downloadData();
  }, []);

  const [transactionData, setTransactionData] = useState([]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header title="PendingDue Report">
        <div className="flex gap-4">
          <div>
            <CSVLink
              data={transactionData}
              filename="ReportPendingDue.csv"
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
                  {reportPendingDueTableHead.map(
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
                        funding_id,
                        pending_amount,
                        contact_details,
                        customer_id,
                        days_overdue,
                        due_date,
                        funding_amount,
                        customer_name
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {funding_id || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {customer_id}
                        </td>
                        <td className="px-6 py-4">
                          {customer_name.trim().length > 7
                            ? customer_name.trim().substring(0, 7) + '...'
                            : customer_name.trim()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {funding_amount || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {due_date || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {days_overdue || 'N/A'}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          {pending_amount || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {contact_details || 'N/A'}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={reportPendingDueTableHead.length}
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
                      funding_id,
                      pending_amount,
                      contact_details,
                      customer_id,
                      days_overdue,
                      due_date,
                      funding_amount,
                      customer_name
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{'Funding ID:'}</span>{' '}
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
                            </span>
                            {customer_name.trim().length > 7
                              ? customer_name.trim().substring(0, 7) + '...'
                              : customer_name.trim() || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Funding Amount:'}
                            </span>{' '}
                            {funding_amount || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{'Due Date:'}</span>{' '}
                            {due_date || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Days Overdue:'}
                            </span>{' '}
                            {days_overdue || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Pending Amount:'}
                            </span>{' '}
                            {pending_amount || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Contact Details:'}
                            </span>{' '}
                            {contact_details || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <td
                    colSpan={reportPendingDueTableHead.length}
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

export default ReportPendingDue;
