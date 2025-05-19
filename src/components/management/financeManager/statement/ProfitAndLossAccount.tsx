import { yupResolver } from '@hookform/resolvers/yup';
import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FormProvider, useForm } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';

import { financeManagerPlApi } from '../../../../api/financeManagerServices';
import { fieldClass, labelClass } from '../../../../utils/constants';
import { statementPlTableHead } from '../../../../utils/data';
import {
  convertDateString,
  handleReportDownload
} from '../../../../utils/helpers';
import { NotificationType } from '../../../../utils/hooks/toastify/enums';
import useToast from '../../../../utils/hooks/toastify/useToast';
import { financialStatementDateSchema } from '../../../../utils/Schema';
import { ProfitAndLossAccountProps } from '../../../../utils/types';
import DateController from '../../../commonInputs/Date';
import Loader from '../../../Loader';
import Header from '../../common/Header';
import Pagination from '../../common/Pagination';
import usePagination from '../../common/usePagination';
import AddLead from '../../customer/AddLead';

const StatementPl = () => {
  const {
    data,
    footerData,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    // handleSearch,
    handleSort,
    sortOrder,
    handleFilter,
    callPaginate,
    userPaginateException
  } = usePagination(financeManagerPlApi);

  const [transactionData, setTransactionData] = useState([]);
  const { showToast } = useToast();

  const methods = useForm({
    resolver: yupResolver(financialStatementDateSchema)
  });

  const { watch, handleSubmit, getValues } = methods;

  const [isOpenAddLead, setIsOpenAddLead] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loans, setLoans] = useState<ProfitAndLossAccountProps[]>([]);

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
    const fronDate = getValues('date_from');
    const toDate = getValues('date_to');
    const filter = {
      filter: {
        start_date: convertDateString(fronDate),
        end_date: convertDateString(toDate),
        download: true
      }
    };
    handleReportDownload(
      financeManagerPlApi,
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
      <Header title="Profit & Loss Account">
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
              filename="ProfitAndLossAccount .csv"
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
                  {statementPlTableHead.map(
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
                  <>
                    {loans?.map((row, index) => (
                      <tr
                        key={index}
                        className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {row?.main_category_name || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {row?.category_name || 'N/A'}
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
                    {/* Footer Data Row */}
                    <tr className="bg-[#D3D3D3] text-[15px]">
                      <td
                        colSpan={statementPlTableHead.length - 4}
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
                      colSpan={statementPlTableHead.length}
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
                <>
                  {loans.map((row, index) => (
                    <div key={index} className="container mx-auto pt-4">
                      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                        <div className="space-y-3 text-gray-700">
                          {/* Category Details */}
                          <div className="border-b border-gray-200 pb-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold">
                                {'Main Category:'}
                              </span>
                              <span>{row?.main_category_name || 'N/A'}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-xs">
                              <span className="font-semibold">
                                {'Category Name:'}
                              </span>
                              <span>{row?.category_name || 'N/A'}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-xs">
                              <span className="font-semibold">
                                {'GL Code:'}
                              </span>
                              <span>{row?.gl_code || 'N/A'}</span>
                            </div>
                            <div className="mt-1 flex justify-between text-xs">
                              <span className="font-semibold">
                                {'GL Name:'}
                              </span>
                              <span>{row?.gl_name || 'N/A'}</span>
                            </div>
                          </div>

                          {/* Financial Details */}
                          <div className="grid grid-cols-2 gap-y-2 pt-2 text-xs">
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {'Opening Balance'}
                              </span>
                              <span>{row?.opening_balance || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">{'Debit'}</span>
                              <span>{row?.debit || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">{'Credit'}</span>
                              <span>{row?.credit || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {'Closing Balance'}
                              </span>
                              <span>{row?.closing_balance || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    colSpan={statementPlTableHead.length}
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

export default StatementPl;
