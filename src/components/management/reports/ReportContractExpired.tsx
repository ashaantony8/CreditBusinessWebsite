import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useMediaQuery } from 'react-responsive';

import {
  expiredContractsGetApi,
  expiredContractsReportDownloadApi
} from '../../../api/loanServices';
import { reportContractExpiredTableHead } from '../../../utils/data';
import { handleReportDownload } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const ReportContractExpired = () => {
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
  } = usePagination(expiredContractsGetApi);

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

  const { showToast } = useToast();
  const downloadData = () => {
    handleReportDownload(
      expiredContractsReportDownloadApi,
      setTransactionData,
      showToast,
      undefined
    );
  };

  const [transactionData, setTransactionData] = useState([]);
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
      <Header title="Expired Contract Report">
        <div className="flex gap-4">
          <div>
            <CSVLink
              data={transactionData}
              filename="ReportContractExpired.csv"
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
                  {reportContractExpiredTableHead.map(
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
                        field_agent,
                        last_dd_date,
                        last_contract_status,
                        last_contract_weeks,
                        last_contract_amount,
                        unit_name
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {field_agent}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">{customer?.agent}</td> */}
                        <td className="px-6 py-4">
                          {unit_name.trim().length > 7
                            ? unit_name.trim().substring(0, 7) + '...'
                            : unit_name.trim()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {last_contract_amount}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {last_contract_weeks}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {last_dd_date}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {last_contract_status}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                        {customer?.agent}
                      </td> */}
                        {/* <td>
                        <span
                          className={`px-3 inline-flex text-xs leading-5 max-sm:text-[9px] rounded-full -mt-6 max-sm:mt-1 max-sm:mb-4 ml-4 ${
                            ApplicationStatusBadgeClasses[
                              loan_status?.current_status ||
                                FundingFromCurrentStatus.Inprogress
                            ]
                          }`}
                        >
                          {FundingFromStatusEnum?.[loan_status?.current_status] ||
                            FundingFromCurrentStatus.Inprogress}
                        </span>
                      </td> */}
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={reportContractExpiredTableHead.length}
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
                      month,
                      contract_id,
                      last_contract_status,
                      last_dd_date,
                      last_contract_amount,
                      last_contract_weeks,
                      field_agent,
                      unit_name
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                        <div className="flex flex-col gap-2 text-xs text-gray-700">
                          <div>
                            <span className="font-medium">
                              {'Field Agent:'}
                            </span>{' '}
                            {field_agent || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{'Month:'}</span>{' '}
                            {month || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{'Unit Name:'}</span>{' '}
                            {unit_name?.trim().length > 7
                              ? unit_name.trim().substring(0, 7) + '...'
                              : unit_name.trim() || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Contract ID:'}
                            </span>{' '}
                            {contract_id || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Last Contract Amount:'}
                            </span>{' '}
                            {last_contract_amount || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Last Contract Weeks:'}
                            </span>{' '}
                            {last_contract_weeks || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Last DD Date:'}
                            </span>{' '}
                            {last_dd_date || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Last Contract Status:'}
                            </span>{' '}
                            {last_contract_status || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <td
                    colSpan={reportContractExpiredTableHead.length}
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

export default ReportContractExpired;
