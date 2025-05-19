import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useMediaQuery } from 'react-responsive';

import {
  snapShotGetApi,
  snapShotReportDownloadApi
} from '../../../api/loanServices';
import {
  reportSnapshotTableBody,
  reportSnapshotTableHead
} from '../../../utils/data';
import { handleReportDownload } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const ReportSnapshot = () => {
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
  } = usePagination(snapShotGetApi);

  const [isOpenAddLead, setIsOpenAddLead] = useState(false);
  const [Snap, setSnap] = useState([]);
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
      setSnap(data);
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
      snapShotReportDownloadApi,
      setTransactionData,
      showToast,
      undefined
    );
  };
  const [transactionData, setTransactionData] = useState([]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header title="Snapshot Report">
        <div className="flex gap-4">
          <div>
            <CSVLink
              data={transactionData}
              filename="transactions.csv"
              target="_blank"
              onClick={event => {
                if (transactionData.length === 0 || Snap.length === 0) {
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
                  Snap.length === 0 || transactionData.length === 0
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
                disabled={Snap.length === 0 || transactionData.length === 0}
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
            <table className="divide-white-200 min-w-full divide-y overflow-x-auto border">
              <thead className="divide-white-200 divide-x bg-[#D3D3D3]">
                <tr className="divide-white-200 divide-x">
                  {reportSnapshotTableHead.map(
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
                {Snap?.length > 0 ? (
                  Snap?.map(
                    (
                      {
                        status,
                        numbers,
                        income_due,
                        contract_amount,
                        principal_outstanding
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="divide-x divide-gray-200 text-[12px] font-medium text-[#000000] max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap bg-[#D3D3D3] px-6 py-4">
                          {status || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {numbers || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {contract_amount || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {principal_outstanding || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {income_due || 'N/A'}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={reportSnapshotTableHead.length}
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
              {reportSnapshotTableBody?.length > 0 ? (
                Snap?.map(
                  (
                    {
                      status,
                      numbers,
                      income_due,
                      contract_amount,
                      principal_outstanding
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{'Status:'}</span>{' '}
                            {status || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{'Numbers:'}</span>{' '}
                            {numbers || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Contract Amount:'}
                            </span>{' '}
                            {contract_amount || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              {'Principal Outstanding:'}
                            </span>{' '}
                            {principal_outstanding || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">{'Income Due:'}</span>{' '}
                            {income_due || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <td
                    colSpan={reportSnapshotTableHead.length}
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

export default ReportSnapshot;
