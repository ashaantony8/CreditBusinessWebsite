import { yupResolver } from '@hookform/resolvers/yup';
import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FormProvider, useForm } from 'react-hook-form';
import { useMediaQuery } from 'react-responsive';

import { financeManagerLedgerApi } from '../../../../api/financeManagerServices';
import { fieldClass, labelClass } from '../../../../utils/constants';
import { entryHeaders } from '../../../../utils/data';
import { EntryType } from '../../../../utils/enums';
import {
  convertDateString,
  formatDate,
  handleReportDownload
} from '../../../../utils/helpers';
import { NotificationType } from '../../../../utils/hooks/toastify/enums';
import useToast from '../../../../utils/hooks/toastify/useToast';
import { ledgerFilterSchema } from '../../../../utils/Schema';
import { LedgerProps, PartnerInfo } from '../../../../utils/types';
import DateController from '../../../commonInputs/Date';
import InputController from '../../../commonInputs/Input';
import Loader from '../../../Loader';
import Pagination from '../../common/Pagination';
import usePagination from '../../common/usePagination';
import { AddEntry } from '../entry/AddEntry';
import GLSelectModal from '../entry/GLSelectModal';

const Ledger = () => {
  const {
    data,
    footerData,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    handleFilter,
    callPaginate,
    userPaginateException
  } = usePagination(financeManagerLedgerApi);

  const [transactionData, setTransactionData] = useState([]);
  const { showToast } = useToast();

  const methods = useForm({
    resolver: yupResolver(ledgerFilterSchema)
  });

  const { watch, setValue, getValues, handleSubmit } = methods;

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGl, setSelectedGl] = useState<PartnerInfo>(undefined);
  const [showLedger, setShowLedger] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loans, setLoans] = useState([]);
  // const options = ['Journal', 'Other']

  const watchGlCode = watch('gl_code');
  const watchFromDate = watch('from_date');
  const watchToDate = watch('to_date');
  const date_to = convertDateString(watchFromDate);
  const date_from = convertDateString(watchFromDate);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    if (watchFromDate && watchToDate && watchGlCode) {
      // const selectedGl =  glData.filter((item) => item.gl_code===watchGlCode)
      // setValue('gl_name',selectedGl.gl_name)
      const customFilter = {};
      customFilter['gl_code'] = convertDateString(watchGlCode);
      customFilter['start_date'] = convertDateString(watchFromDate);
      customFilter['end_date'] = convertDateString(watchToDate);
      setIsLoading(true);
      handleFilter(customFilter);
    }
    // setValue('glAccountName', glIDs.find(i => i.partner_code === watchGlCode).partner_name)
  }, [watchGlCode, watchFromDate, watchToDate]);

  const [list, setList] = useState<LedgerProps[]>([]);
  const onFilter = () => {
    // fetchData(filterData)
  };

  const firstDayOfCurrentMonth = startOfMonth(new Date());

  useEffect(() => {
    if (selectedGl) {
      setValue('gl_code', selectedGl?.partner_code);
    }
  }, [selectedGl]);

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

  const LedgerHeader = () => (
    <div className="flex items-center px-4">
      <p className="pr-4 text-[20px] font-semibold text-[#000000] max-sm:text-[18px]">
        {'Ledger'}
      </p>
      <div className="flex w-auto gap-3">
        <div className="rounded-lg bg-white">
          <div className="relative bg-inherit">
            <input
              id="gl_name"
              type="text"
              placeholder=" "
              value={selectedGl?.partner_name}
              className={fieldClass}
              onClick={() => setShowModal(true)}
            />
            <label htmlFor="gl_name" className={labelClass}>
              {'GL Name'}
              <span className="text-red-500">{' *'}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const GLCodeInput = () => (
    <InputController
      metaData={{
        fieldClass,
        labelClass,
        name: 'gl_code',
        label: 'GL Code',
        type: 'text',
        placeholder: 'GL Code',
        isDisabled: true
      }}
    />
  );
  useEffect(() => {
    if (data) setLoans(data);
  }, [data]);

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
    downloadData();
  }, []);

  const downloadData = () => {
    const fromDate = getValues('from_date');
    const toDate = getValues('to_date');
    const dateFilter = {
      filter: {
        start_date: convertDateString(fromDate),
        end_date: convertDateString(toDate),
        gl_code: watchGlCode,
        download: true
      }
    };
    handleReportDownload(
      financeManagerLedgerApi,
      setTransactionData,
      showToast,
      dateFilter
    );
  };

  const DateRangeInput = ({ fromDate, toDate }) => (
    <>
      <DateController
        metaData={{
          fieldClass,
          labelClass,
          defaultValue: fromDate,
          placeholder: 'from',
          isRequired: true,
          name: 'from_date',
          label: 'From',
          type: 'date'
        }}
      />
      <DateController
        metaData={{
          fieldClass,
          labelClass,
          defaultValue: toDate,
          placeholder: 'to',
          isRequired: true,
          name: 'to_date',
          label: 'To',
          type: 'date'
        }}
      />
    </>
  );

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      {showLedger ? (
        <div>
          <FormProvider {...methods}>
            <div className="flex">
              <form
                onSubmit={handleSubmit(onFilter)}
                className="flex flex-wrap items-center"
              >
                {/* Desktop view */}
                <div className="mb-8 mr-2 mt-4 hidden w-full items-center justify-between sm:flex">
                  <LedgerHeader />
                  <div className="flex w-auto gap-3">
                    <GLCodeInput />
                    <DateRangeInput
                      fromDate={firstDayOfCurrentMonth}
                      toDate={new Date()}
                    />
                  </div>
                </div>

                {/* Mobile view */}
                <div className="mt-3 flex w-full flex-wrap gap-3 sm:hidden">
                  <div className="flex gap-2">
                    <LedgerHeader />
                    <div className="w-48">
                      <GLCodeInput />
                    </div>
                  </div>
                  <div className="m-2 -mt-2 flex gap-2">
                    <DateRangeInput
                      fromDate={firstDayOfCurrentMonth}
                      toDate={new Date()}
                    />
                  </div>
                </div>
              </form>

              <div className="mt-4 pl-4">
                <CSVLink
                  data={
                    transactionData && transactionData.length > 0
                      ? transactionData
                      : []
                  }
                  filename={`Ledger_${date_to}-${date_from}.csv`}
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
                    disabled={
                      loans.length === 0 || transactionData.length === 0
                    }
                  >
                    {'Download'}
                  </button>
                </CSVLink>
              </div>
            </div>
          </FormProvider>
          {watchGlCode && (
            <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
              <div className="px-2 max-sm:p-4">
                <div>
                  {(isLaptop || isTablet) && (
                    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto border">
                      <thead className="bg-[#D3D3D3]">
                        <tr>
                          {entryHeaders.map(
                            (
                              { name }: { name: string; key?: string },
                              index
                            ) => (
                              <th
                                key={index}
                                className="cursor-pointer px-6 py-4 text-left text-[12px] font-semibold uppercase text-[#000000]"
                                // onClick={() => handleSortColumn(key)}
                              >
                                {name}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {list?.length > 0 ? (
                          <>
                            {list?.map((entry, index) => (
                              <tr
                                key={index}
                                className="text-[12px] font-medium text-[#000000] hover:bg-gray-200 max-sm:text-[10px]"
                              >
                                <td className="whitespace-nowrap px-6 py-4">
                                  {entry?.date ? formatDate(entry.date) : 'N/A'}
                                </td>
                                <td
                                  onClick={() => {
                                    setShowLedger(false);
                                    setSelectedEntry(entry);
                                  }}
                                  className="cursor-pointer whitespace-nowrap px-6 py-4 hover:text-blue-500"
                                >
                                  {entry?.transaction_no || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {entry?.entry_type
                                    ? EntryType[entry.entry_type.toLowerCase()]
                                    : 'N/A'}
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                {entry?.offset_accounts?.[0]?.bp_account
                                  ?.partner_code ||
                                  entry.offset_accounts?.[0]?.gl_account
                                    ?.gl_code ||
                                  "N/A"}
                              </td> */}
                                <td className="whitespace-nowrap px-6 py-4">
                                  {entry?.narration || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                  {entry?.debit_amount || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                  {entry?.credit_amount || 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                  {entry?.balance || 'N/A'}
                                </td>
                              </tr>
                            ))}
                            {/* Footer Data Row */}
                            <tr className="bg-[#D3D3D3]">
                              <td
                                colSpan={entryHeaders.length - 3}
                                className="px-6 py-4"
                              >
                                {'Total'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {footerData?.debit || 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {footerData?.credit || 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {footerData?.balance || 'N/A'}
                              </td>
                            </tr>
                          </>
                        ) : (
                          <tr>
                            <td colSpan={8} className="px-6 py-4 text-center">
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
                          {list.map((entry, index) => (
                            <div key={index} className="container mx-auto pt-4">
                              <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                                <div className="space-y-3 text-gray-700">
                                  {/* Transaction Details */}
                                  <div className="border-b border-gray-200 pb-2">
                                    <div className="flex justify-between text-xs">
                                      <span className="font-semibold">
                                        {'Date:'}
                                      </span>
                                      <span>
                                        {formatDate(entry.date) || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="mt-1 flex justify-between text-xs">
                                      <span className="font-semibold">
                                        {'Transaction No:'}
                                      </span>
                                      <span>
                                        {entry?.transaction_no || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="mt-1 flex justify-between text-xs">
                                      <span className="font-semibold">
                                        {'Entry Type:'}
                                      </span>
                                      <span>{entry?.entry_type || 'N/A'}</span>
                                    </div>
                                    <div className="mt-1 flex justify-between text-xs">
                                      <span className="font-semibold">
                                        {'Narration:'}
                                      </span>
                                      <span>{entry?.narration || 'N/A'}</span>
                                    </div>
                                  </div>

                                  {/* Amount Details */}
                                  <div className="grid grid-cols-2 gap-y-2 pt-2 text-xs">
                                    <div className="flex flex-col">
                                      <span className="font-semibold">
                                        {'Debit Amount'}
                                      </span>
                                      <span>
                                        {entry?.debit_amount || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-semibold">
                                        {'Credit Amount'}
                                      </span>
                                      <span>
                                        {entry?.credit_amount || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="col-span-2 mt-2 flex justify-between border-t border-gray-200 pt-2">
                                      <span className="font-semibold">
                                        {'Balance:'}
                                      </span>
                                      <span>{entry?.balance || 'N/A'}</span>
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
                                    <span>{'Debit:'}</span>
                                    <span>{footerData?.debit || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>{'Credit:'}</span>
                                    <span>{footerData?.credit || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span>{'Balance:'}</span>
                                    <span>{footerData?.balance || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="px-6 py-4 text-center">
                          {'No data available'}
                        </div>
                      )}
                    </>
                  )}
                  <div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <AddEntry
          setShowLedger={setShowLedger}
          selectedEntry={selectedEntry?.entry_id}
        />
      )}
      {showModal && (
        <GLSelectModal
          isForTable={false}
          setSelectedGl={setSelectedGl}
          close={() => {
            setShowModal(false);
          }}
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        goToPage={goToPage}
      />
    </>
  );
};

export default Ledger;
