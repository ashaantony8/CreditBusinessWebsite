import { yupResolver } from '@hookform/resolvers/yup';
import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FormProvider, useForm } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';

import { financeManagerBalanceSheetApi } from '../../../../api/financeManagerServices';
import { fieldClass, labelClass } from '../../../../utils/constants';
import { statementBalanceSheetTableHead } from '../../../../utils/data';
import {
  convertDateString,
  handleReportDownload
} from '../../../../utils/helpers';
import { NotificationType } from '../../../../utils/hooks/toastify/enums';
import useToast from '../../../../utils/hooks/toastify/useToast';
import { financialStatementDateSchema } from '../../../../utils/Schema';
import { BalanceSheetProps } from '../../../../utils/types';
import DateController from '../../../commonInputs/Date';
import Loader from '../../../Loader';
import Header from '../../common/Header';
import Pagination from '../../common/Pagination';
import usePagination from '../../common/usePagination';
import AddLead from '../../customer/AddLead';

const StatementBalanceSheet = () => {
  const {
    data,
    footerData,
    profitAndLoss,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleSort,
    sortOrder,
    handleFilter,
    callPaginate,
    userPaginateException
  } = usePagination(financeManagerBalanceSheetApi);

  const methods = useForm({
    resolver: yupResolver(financialStatementDateSchema)
  });
  useEffect(() => {
    if (data) setLoans(data);
  }, [data]);
  const { watch, handleSubmit } = methods;
  const [loans, setLoans] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenAddLead, setIsOpenAddLead] = useState(false);

  const [list, setList] = useState<BalanceSheetProps[]>([]);

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

  const firstDayOfCurrentMonth = startOfMonth(new Date());

  const watchFromDate = watch('date_from');
  const watchToDate = watch('date_to');

  useEffect(() => {
    if (watchFromDate && watchToDate) {
      const customFilter = {};
      customFilter['start_date'] = convertDateString(watchFromDate);
      customFilter['end_date'] = convertDateString(watchToDate);
      setIsLoading(true);
      handleFilter(customFilter);
    }
    // setValue('glAccountName', glIDs.find(i => i.partner_code === watchGlCode).partner_name)
  }, [watchFromDate, watchToDate]);

  const onFilter = () => {
    // fetchData(filterData)
  };

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
    downloadData();
  }, []);

  const downloadData = () => {
    const filter = {
      filter: {
        date_from: convertDateString(watchFromDate),
        date_to: convertDateString(watchToDate),
        download: true
      }
    };
    handleReportDownload(
      financeManagerBalanceSheetApi,
      setTransactionData,
      showToast,
      filter
    );
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <Header title="Balance Sheet">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onFilter)}
            // className="flex justify-between items-center mb-8 gap-4 "
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
              filename="transactions.csv"
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
                  {statementBalanceSheetTableHead.map(
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
                {list?.length > 0 ? (
                  <>
                    {list.map((row, index) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {row?.main_category || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {row?.sub_category || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {row?.gl_code || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {row?.gl_name || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          {row?.opening_balance || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          {row?.debit || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          {row?.credit || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          {row?.closing_balance || 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {/* Profit and Loss Row */}
                    <tr className="bg-[#e4e1e193]">
                      <td
                        colSpan={statementBalanceSheetTableHead.length - 4}
                        className="px-6 py-4"
                      >
                        {'Profit and Loss'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {profitAndLoss?.opening_balance || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {profitAndLoss?.debit || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {profitAndLoss?.credit || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {profitAndLoss?.closing_balance || 'N/A'}
                      </td>
                    </tr>

                    {/* Footer Data Row */}
                    <tr className="bg-[#D3D3D3]">
                      <td
                        colSpan={statementBalanceSheetTableHead.length - 4}
                        className="px-6 py-4"
                      >
                        {'Total'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {footerData?.opening_balance || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {footerData?.debit || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {footerData?.credit || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {footerData?.closing_balance || 'N/A'}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={statementBalanceSheetTableHead.length}
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
              {list?.length > 0 ? (
                <>
                  {list.map((row, index) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="flex flex-col space-y-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <div className="text-sm font-semibold text-gray-700">
                            {'Main Category'}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {row?.main_category || 'N/A'}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2 text-gray-600">
                          <div className="flex-1">
                            <div className="text-xs font-semibold">
                              {'Sub Category:'}
                            </div>
                            <div className="text-xs">
                              {row?.sub_category || 'N/A'}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold">
                              {'GL Code:'}
                            </div>
                            <div className="text-xs">
                              {row?.gl_code || 'N/A'}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold">
                              {'GL Name:'}
                            </div>
                            <div className="text-xs">
                              {row?.gl_name || 'N/A'}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-y-2 border-t border-gray-200 pt-2 text-gray-600">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">
                              {'Op Balance'}
                            </span>
                            <span className="text-xs">
                              {row?.opening_balance || 'N/A'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">
                              {'Debit'}
                            </span>
                            <span className="text-xs">
                              {row?.debit || 'N/A'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">
                              {'Credit'}
                            </span>
                            <span className="text-xs">
                              {row?.credit || 'N/A'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">
                              {'Cl Balance'}
                            </span>
                            <span className="text-xs">
                              {row?.closing_balance || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="container mx-auto pt-4">
                    <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                      <div className="space-y-3 text-gray-700">
                        {'Profit and Loss'}
                        <div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Opening Balance:'}</span>
                            <span>
                              {profitAndLoss?.opening_balance || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Debit:'}</span>
                            <span>{profitAndLoss?.debit || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Credit:'}</span>
                            <span>{profitAndLoss?.credit || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Closing Balance:'}</span>
                            <span>
                              {profitAndLoss?.closing_balance || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="container mx-auto pt-4">
                    <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                      <div className="space-y-3 text-gray-700">
                        {'Total'}
                        <div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Opening Balance:'}</span>
                            <span>{footerData?.opening_balance || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Debit:'}</span>
                            <span>{footerData?.debit || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Credit:'}</span>
                            <span>{footerData?.credit || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{'Closing Balance:'}</span>
                            <span>{footerData?.closing_balance || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <td
                    colSpan={statementBalanceSheetTableHead.length}
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

export default StatementBalanceSheet;
