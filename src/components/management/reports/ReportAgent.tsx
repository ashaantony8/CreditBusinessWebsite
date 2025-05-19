import { yupResolver } from '@hookform/resolvers/yup';
import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FormProvider, useForm } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';

import {
  agentReportDownloadApi,
  agentReportGetApi
} from '../../../api/loanServices';
import { fieldClass, labelClass } from '../../../utils/constants';
import { reportAgentTableHead } from '../../../utils/data';
import {
  convertDateString,
  handleReportDownload
} from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { summaryFilterSchema } from '../../../utils/Schema';
import DateController from '../../commonInputs/Date';
import Loader from '../../Loader';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import usePagination from '../common/usePagination';
import AddLead from '../customer/AddLead';

const ReportAgent = () => {
  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSort,
    sortOrder,
    // callPaginate,
    handleFilter,
    userPaginateException
  } = usePagination(agentReportGetApi);

  const [isOpenAddLead, setIsOpenAddLead] = useState(false);

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

  const methods = useForm({
    resolver: yupResolver(summaryFilterSchema)
  });
  const { watch, handleSubmit, getValues } = methods;
  const watchFromDate = watch('date_from');
  const watchtoDate = watch('date_to');
  const date_to = convertDateString(watchFromDate);
  const date_from = convertDateString(watchFromDate);
  const [isLoading, setIsLoading] = useState(false);
  const firstDayOfCurrentMonth = startOfMonth(new Date());
  const onFilter = () => {
    // fetchData(filterData)
  };
  useEffect(() => {
    const custFilter = {};
    if (watchFromDate)
      custFilter['date_from'] = convertDateString(watchFromDate);
    if (watchtoDate) custFilter['date_to'] = convertDateString(watchtoDate);
    if (watchFromDate && watchtoDate) {
      setIsLoading(true);
      handleFilter(custFilter);
    }
  }, [watchFromDate, watchtoDate]);

  useEffect(() => {
    setIsLoading(true);
    downloadData();
  }, []);

  const { showToast } = useToast();

  const downloadData = () => {
    const fronDate = getValues('date_from');
    const toDate = getValues('date_to');

    const filter = {
      filter: {
        date_from: convertDateString(fronDate),
        date_to: convertDateString(toDate)
      }
    };

    handleReportDownload(
      agentReportDownloadApi,
      setTransactionData,
      showToast,
      filter
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
      <Header title="Agent Report">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFilter)}
            // className='flex justify-between items-center mb-8 gap-4 '
          >
            <div className="flex gap-4">
              <DateController
                metaData={{
                  fieldClass: fieldClass,
                  labelClass: labelClass,
                  defaultValue: `${firstDayOfCurrentMonth}`,
                  placeholder: 'from',
                  isRequired: true,
                  name: `date_from`,
                  label: 'from',
                  type: 'date'
                }}
              />
              <DateController
                metaData={{
                  fieldClass: fieldClass,
                  labelClass: labelClass,
                  defaultValue: `${new Date()}`,
                  placeholder: 'to',
                  isRequired: true,
                  name: `date_to`,
                  label: 'to',
                  type: 'date'
                }}
              />
            </div>
          </form>
          <div className="pl-4">
            <CSVLink
              data={
                transactionData && transactionData.length > 0
                  ? transactionData
                  : []
              }
              filename={`ReportAgent.csv ${date_from} - ${date_to}`}
              target="_blank"
              onClick={event => {
                downloadData();
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
        </FormProvider>
      </Header>
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
        <div className="px-2 max-sm:p-4">
          {(isLaptop || isTablet) && (
            <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
              <thead className="bg-[#D3D3D3]">
                <tr>
                  {reportAgentTableHead.map(
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
                        field_agent_name,
                        cases_in_legal_numbers,
                        cases_in_pap_amount,
                        cases_in_legal_amount,
                        cases_in_pap_numbers,
                        income_due,
                        principal_recovery_due,
                        income_earned,
                        amount_of_business
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {field_agent_name}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">{customer?.agent}</td> */}
                        <td className="px-6 py-4">
                          {amount_of_business || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {income_earned || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {principal_recovery_due || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {income_due || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {cases_in_pap_numbers || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {cases_in_pap_amount || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {cases_in_legal_numbers || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {cases_in_legal_amount || 'N/A'}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={reportAgentTableHead.length}
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
                      field_agent_name,
                      income_booked,
                      business_from_new_clients,
                      enhancement_amount,
                      amount_advanced,
                      new_clients_added
                    },
                    index
                  ) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                        <div className="flex flex-col gap-2 text-xs text-gray-700">
                          <div>
                            <span className="font-medium">
                              {'Field Agent Name:'}
                            </span>{' '}
                            {field_agent_name || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Amount Advanced:'}
                            </span>{' '}
                            {amount_advanced || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Enhancement Amount:'}
                            </span>{' '}
                            {enhancement_amount || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Business from New Clients:'}
                            </span>{' '}
                            {business_from_new_clients || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'New Clients Added:'}
                            </span>{' '}
                            {new_clients_added || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">
                              {'Income Booked:'}
                            </span>{' '}
                            {income_booked || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <td
                    colSpan={reportAgentTableHead.length}
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

export default ReportAgent;
