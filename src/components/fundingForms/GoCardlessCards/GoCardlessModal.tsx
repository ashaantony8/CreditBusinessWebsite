import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { AiOutlineClose } from 'react-icons/ai';
import { FiPlus } from 'react-icons/fi';
import { GrGroup } from 'react-icons/gr';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import {
  downloadBankStatementApi,
  transactionCategoryApi
} from '../../../api/loanServices';
import proof from '../../../assets/images/proof.png';
import download from '../../../assets/svg/download.svg';
import eye from '../../../assets/svg/eye.svg';
import {
  creditCategoryOptions,
  debitCategoryOptions,
  gocardlessSortingConstant
} from '../../../utils/constants';
import {
  getExtensionFromUrl,
  getNameFromUrl,
  handleReportDownload
} from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import useCategoryCount from '../../../utils/hooks/useCategoryCount';
import Loader from '../../Loader';
import ChipInput from './ChipInput';
import GoCardlessStatementCard from './GoCardlessStatementCard';

const GoCardlessModal = ({
  isGocardless,
  gocardlessData,
  setGocardlessData,
  onClose,
  selectedId,
  withoutGocardlessData,
  setWithoutGocardlessData,
  sortTransactionCheckpoint
}) => {
  const [isDebitListing, setIsDebitListing] = useState(true);
  const [openStatements, setOpenStatements] = useState(false);
  const [fileSizes, setFileSizes] = useState({});
  const [openChipInput, setOpenChipInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('payments');

  const { showToast } = useToast();

  const bankData = [...gocardlessData, ...withoutGocardlessData].find(
    i => selectedId === i.id
  );

  function sortBankData(data) {
    return data.sort((a, b) => {
      // Place items without a 'category' key at the top
      if (!('category' in a) && 'category' in b) {
        return -1;
      }
      if (!('category' in b) && 'category' in a) {
        return 1;
      }
      // Place items with an empty category at the top
      if (a.category === '' && b.category !== '') {
        return -1;
      }
      if (b.category === '' && a.category !== '') {
        return 1;
      }
      // Place items with "ignore_transaction" at the very end
      if (
        a.category === 'ignore_transaction' &&
        b.category !== 'ignore_transaction'
      ) {
        return 1;
      }
      if (
        b.category === 'ignore_transaction' &&
        a.category !== 'ignore_transaction'
      ) {
        return -1;
      }
      // Sort by 'category' in ascending order if both items have categories
      const categoryComparison = a?.category
        ? a?.category?.localeCompare(b.category)
        : 0;
      if (categoryComparison !== 0) return categoryComparison;

      // If categories are the same, sort by 'entryReference' in ascending order
      return a?.entryReference?.localeCompare(b.entryReference);
    });
  }

  const creditData = bankData.credit ? sortBankData(bankData.credit) : [];
  const debitData = bankData.debit ? sortBankData(bankData.debit) : [];

  const debitCategoryGrouped = useCategoryCount(debitData);
  const creditCategoryGrouped = useCategoryCount(creditData);

  const onCategorySelect = (data, type) => {
    const arr = type === 'debit' ? [...debitData] : [...creditData];
    let parentArr = isGocardless
      ? [...gocardlessData]
      : [...withoutGocardlessData];
    const modArr = arr.map(item => (item.id === data.id ? { ...data } : item));
    parentArr = parentArr.map(item =>
      item.id === selectedId ? { ...item, [type]: modArr } : item
    );
    if (isGocardless) {
      setGocardlessData(parentArr);
    } else {
      setWithoutGocardlessData(parentArr);
    }
  };
  // const autoSelect =()=>{
  //   const debarr =  [...debitData]
  //   const credarr =  [...creditData]
  //   const parentArr = [...gocardlessData]
  //   debarr.forEach((i)=> {
  //     return i.category = 'payment'
  //   })
  //   credarr.forEach((i)=> {
  //     return i.category = 'payment'
  //   })
  //   const accountObject =  parentArr.find(i=> selectedId === i.id)

  //   accountObject.debit = debarr
  //   accountObject.credit = credarr
  //   setGocardlessData(parentArr)
  // }

  useEffect(() => {
    setType(isDebitListing ? 'payments' : 'card');
  }, [isDebitListing]);

  useEffect(() => {
    const parentArr = isGocardless
      ? [...gocardlessData]
      : [...withoutGocardlessData];
    const setData = isGocardless ? setGocardlessData : setWithoutGocardlessData;
    const accountObject = parentArr?.find(i => selectedId === i.id);

    accountObject.all_grouped =
      debitCategoryGrouped === debitData?.length &&
      creditCategoryGrouped === creditData?.length &&
      debitData?.length >= 1 &&
      creditData?.length >= 1;
    setData(parentArr);
  }, [debitCategoryGrouped, creditCategoryGrouped]);

  const onAdd = () => {
    const type = isDebitListing ? 'debit' : 'credit';
    const arr = type === 'debit' ? [...debitData] : [...creditData];
    arr.push({
      id: arr.length + 1,
      debtorName: '',
      transactionAmount: {
        amount: '',
        currency: 'EUR'
      },
      bankTransactionCode: '',
      remittanceInformationUnstructured: ''
    });

    const parentArr = [...withoutGocardlessData];

    const updatedParentArr = parentArr.map(item =>
      item.id === selectedId ? { ...item, [type]: arr } : item
    );

    setWithoutGocardlessData(updatedParentArr);
  };

  const handleViewLinkClick = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const fetchFileSize = async url => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const size = (blob.size / 1024).toFixed(2);
      return `${size} KB`;
    } catch (error) {
      console.error('Error fetching file size:', error);
    }
  };

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes = {};
      const promises = bankData?.business_account_statements?.map(
        async statement => {
          const size = await fetchFileSize(statement.file);
          sizes[statement.file] = size; // Using file link as key
        }
      );
      await Promise.all(promises);
      setFileSizes(sizes);
    };

    if (bankData?.business_account_statements) {
      fetchSizes();
    }
  }, [bankData]);

  useEffect(() => {
    return () => {
      sortTransactionCheckpoint();
    };
  }, []);

  const [chips, setChips] = useState(gocardlessSortingConstant);

  const fetchTransactionCategor = async () => {
    try {
      const response = await transactionCategoryApi();
      if (response.status_code === 200) {
        setChips(response.data);
      }
    } catch (error) {
      console.error('Error fetching transaction categor:', error);
    }
  };

  useEffect(() => {
    fetchTransactionCategor();
  }, []);

  useEffect(() => {
    if (selectedId) {
      downloadData();
    }
  }, [selectedId]);

  const onBulkSort = () => {
    setIsLoading(true);
    if (isDebitListing) {
      const debarr = [...debitData];
      const parentArr = [...gocardlessData];

      debarr.forEach(item => {
        const values = chips.debit[type];
        for (const value of values) {
          if (item.remittanceInformationUnstructured) {
            const remittanceInfo =
              item.remittanceInformationUnstructured.toLowerCase();

            if (remittanceInfo.includes(value.toLowerCase())) {
              item.category = type;
              break;
            }
          }
        }
      });
      const accountObject = parentArr.find(i => selectedId === i.id);

      accountObject.debit = debarr;
      setGocardlessData(parentArr);
    } else {
      const credarr = [...creditData];
      const parentArr = [...gocardlessData];

      credarr.forEach(item => {
        const values = chips.credit[type];
        for (const value of values) {
          if (item.remittanceInformationUnstructured) {
            const remittanceInfo =
              item.remittanceInformationUnstructured.toLowerCase();

            if (remittanceInfo.includes(value.toLowerCase())) {
              item.category = type;
              break;
            }
          }
        }
      });
      const accountObject = parentArr.find(i => selectedId === i.id);

      accountObject.credit = credarr;
      setGocardlessData(parentArr);
    }
    setOpenChipInput(false);
    setIsLoading(false);
  };

  const [transactionData, setTransactionData] = useState([]);

  const downloadData = () => {
    handleReportDownload(
      downloadBankStatementApi,
      setTransactionData,
      showToast,
      selectedId
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end overflow-auto bg-black bg-opacity-50">
      <div className="h-screen w-full overflow-auto bg-white md:w-1/2 lg:w-1/2 xl:w-2/5">
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <div className="relative w-full border-[1px] border-b-gray-200 px-6 pt-6">
          <div className="flex w-[80%] justify-between">
            <p className="mb-4 font-bold">{'Bank name'}</p>
            <button
              type="button"
              onClick={() => {
                sortTransactionCheckpoint(true);
              }}
              className="self-center rounded bg-[#1B4398] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3a5692]"
            >
              {'Save Sort'}
            </button>
          </div>
          {/* <p onClick={() => autoSelect()} className=""> */}
          <p className="">{bankData?.bank_name}</p>
          {isGocardless && (
            <>
              <p className="mb-4 font-bold">{'Statement Date'}</p>
              <div className="flex items-center gap-2">
                <p className="">{bankData?.start_date}</p>
                <p className="">{'TO'}</p>
                <p className="">{bankData?.end_date}</p>
              </div>
            </>
          )}
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-4 text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose size={32} />
          </button>
        </div>

        <div className="my-8">
          <div className="flex items-center gap-2 px-4">
            <div
              onClick={() => setIsDebitListing(true)}
              className={`w-1/2 cursor-pointer rounded border-2 p-4 ${
                isDebitListing
                  ? 'border-[#1A439A] bg-[#1A439A] text-white'
                  : 'border-gray-300'
              }`}
            >
              <p>{'Debit transactions'}</p>
              <div className="flex items-center gap-2">
                <GrGroup />
                <p className="text-[13px]">{'Grouped:'}</p>
                <p className="text-[13px]">
                  {debitCategoryGrouped}
                  {'/'}
                  {debitData?.length}
                </p>
              </div>
            </div>

            <div
              onClick={() => setIsDebitListing(false)}
              className={`w-1/2 cursor-pointer rounded border-2 p-4 ${
                !isDebitListing
                  ? 'border-[#1A439A] bg-[#1A439A] text-white'
                  : 'border-gray-300'
              }`}
            >
              <p>{'Credit transactions'}</p>
              <div className="flex items-center gap-2">
                <GrGroup />
                <p className="text-[13px]">{'Grouped:'}</p>
                <p className="text-[13px]">
                  {creditCategoryGrouped}
                  {'/'}
                  {creditData?.length}
                </p>
              </div>
            </div>
          </div>

          {isGocardless && (
            <div className="flex flex-col items-center gap-4 px-4 pt-4">
              <CSVLink
                data={transactionData}
                filename={`statment-${selectedId}.csv`}
                target="_blank"
                onClick={event => {
                  if (transactionData.length === 0 || bankData.length === 0) {
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
                className="flex w-full cursor-pointer justify-between rounded border border-gray-300 p-4 text-[#929292]"
              >
                <div className="flex gap-2">
                  <img src={download} alt="download" />
                  <div>
                    <a className="text-[14px]">{'Download Statment'}</a>
                  </div>
                </div>
              </CSVLink>
              {openStatements &&
                bankData?.business_account_statements?.map(statement => (
                  <div
                    key={statement.file}
                    className="flex w-full cursor-pointer justify-between rounded border border-gray-300 p-4 text-[#929292]"
                  >
                    <div className="flex gap-2">
                      <div className="flex h-full w-[30px] items-center justify-center">
                        <img src={proof} alt="proof" />
                      </div>
                      <div>
                        <a className="text-[14px]">
                          {getNameFromUrl(statement.file)}
                        </a>
                        <a className="ml-4 text-[14px] text-[#1A439A]">
                          {fileSizes[statement.file] || 'Loading...'}
                        </a>
                      </div>
                    </div>
                    <span
                      onClick={() => handleViewLinkClick(statement.file || '')}
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      {['xlsx'].includes(
                        getExtensionFromUrl(statement.file) || ''
                      ) ? (
                        <img src={download} alt="download" />
                      ) : (
                        <img src={eye} alt="blue-eye" />
                      )}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {!isGocardless && (
            <div className="flex flex-col items-center gap-4 px-4 pt-4">
              <div
                className="flex w-full cursor-pointer justify-between rounded border border-gray-300 p-4 text-[#929292]"
                onClick={() => setOpenStatements(prev => !prev)}
              >
                <div className="flex gap-2">
                  <img src={download} alt="download" />
                  <div>
                    <a className="text-[14px] text-[#1A439A]">
                      {`${bankData?.business_account_statements?.length} `}
                    </a>
                    <a className="text-[14px]">{'file for download'}</a>
                  </div>
                </div>
                <span className="accordion-arrow">
                  {openStatements ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
              </div>

              {openStatements &&
                bankData?.business_account_statements?.map(statement => (
                  <div
                    key={statement.file}
                    className="flex w-full cursor-pointer justify-between rounded border border-gray-300 p-4 text-[#929292]"
                  >
                    <div className="flex gap-2">
                      <div className="flex h-full w-[30px] items-center justify-center">
                        <img src={proof} alt="proof" />
                      </div>
                      <div>
                        <a className="text-[14px]">
                          {getNameFromUrl(statement.file)}
                        </a>
                        <a className="ml-4 text-[14px] text-[#1A439A]">
                          {fileSizes[statement.file] || 'Loading...'}
                        </a>
                      </div>
                    </div>
                    <span
                      onClick={() => handleViewLinkClick(statement.file || '')}
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      {['xlsx'].includes(
                        getExtensionFromUrl(statement.file) || ''
                      ) ? (
                        <img src={download} alt="download" />
                      ) : (
                        <img src={eye} alt="blue-eye" />
                      )}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {isGocardless ? (
          <div className="mx-4 mb-8 flex flex-col items-center gap-4">
            <div
              className="flex w-full cursor-pointer justify-between rounded border border-gray-300 p-4 text-gray-500"
              onClick={() => setOpenChipInput(prev => !prev)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{'Bulk Sort'}</span>
              </div>
              <span className="accordion-arrow text-gray-500">
                {openChipInput ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </span>
            </div>
            {openChipInput && (
              <div className="flex w-full flex-col gap-4 rounded border border-gray-200 bg-white p-4">
                {isDebitListing ? (
                  <div key={type} className="mb-4">
                    <ChipInput
                      options={debitCategoryOptions}
                      setType={setType}
                      type={type}
                      chips={chips.debit[type] || []}
                      setChips={setChips}
                      category="debit"
                      mainCategory={type}
                    >
                      <button
                        type="button"
                        onClick={onBulkSort}
                        className="self-center rounded bg-[#1B4398] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3a5692]"
                      >
                        {'Apply'}
                      </button>
                    </ChipInput>
                  </div>
                ) : (
                  <div key={type} className="mb-4">
                    <ChipInput
                      options={creditCategoryOptions}
                      setType={setType}
                      type={type}
                      chips={chips.credit[type] || []}
                      setChips={setChips}
                      category="credit"
                      mainCategory={type}
                    >
                      <button
                        type="button"
                        onClick={onBulkSort}
                        className="self-center rounded bg-[#1B4398] px-6 py-2 text-sm font-semibold text-white hover:bg-[#3a5692]"
                      >
                        {'Apply'}
                      </button>
                    </ChipInput>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex w-full justify-end p-4">
            <button
              onClick={() => onAdd()}
              className="flex items-center rounded-lg border bg-transparent px-5 py-2.5 text-center text-sm font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
              type="button"
            >
              <FiPlus size={16} className="mr-2" />
              {'Add'}
            </button>
          </div>
        )}
        <div className="custom-scrollbar h-[60%]">
          {isDebitListing
            ? debitData?.map(debit => (
                <GoCardlessStatementCard
                  isGocardless={isGocardless}
                  data={debit}
                  onCategorySelect={onCategorySelect}
                  options={debitCategoryOptions}
                  isDebit={true}
                />
              ))
            : creditData?.map(credit => (
                <GoCardlessStatementCard
                  isGocardless={isGocardless}
                  data={credit}
                  onCategorySelect={onCategorySelect}
                  options={creditCategoryOptions}
                  isDebit={false}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default GoCardlessModal;
