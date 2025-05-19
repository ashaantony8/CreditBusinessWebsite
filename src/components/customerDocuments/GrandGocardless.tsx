import { useCallback, useEffect, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { RiArrowDownSLine } from 'react-icons/ri';
import { TbAlignBoxLeftStretch } from 'react-icons/tb';
import { useSelector } from 'react-redux';

import {
  confirmBankAccountGetApi,
  confirmBankAccountPostApi,
  createRequisitionLinkApi,
  gocardlessBankListApi
} from '../../api/loanServices';
import bank from '../../assets/svg/bank.svg';
import { authSelector } from '../../store/auth/userSlice';
// import { updateFilledForms } from "../../utils/helpers";
import { Roles } from '../../utils/enums';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import Loader from '../Loader';

const GrandGocardless = ({ setIsSendConsent, loanId }) => {
  const { showToast } = useToast();
  const { role } = useSelector(authSelector);

  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showBanks, setShowBanks] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);
  const [requisitionLink, setRequisitionLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmBankAccountList, setConfirmBankAccountList] = useState([]);
  const [accountNumber, setAccountNumber] = useState(null);
  const [consent, setConsent] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [errors, setErrors] = useState({ bank: '', account: '' });

  useEffect(() => {
    fetchBankList();
  }, []);

  useEffect(() => {
    setSendMail(false);
  }, [selectedBank]);

  const fetchBankList = async () => {
    setIsLoading(true);
    try {
      const { status_code, status_message, data } =
        await gocardlessBankListApi();
      if (status_code >= 200 && status_code < 300) {
        const bankData = [
          ...data,
          {
            // bankData will remove in production
            id: 'SANDBOXFINANCE_SFIN0000',
            name: 'ABN AMRO Bank Commercial(Test Bank)',
            bic: 'ABNAGB2LXXX',
            transaction_total_days: '540',
            countries: ['GB'],
            logo: 'https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/abnamrobank.png'
          },
          {
            id: 'SANDBOXFINANCE_SFIN0000',
            name: 'Allied Irish Banks Corporate (Test Bank)',
            bic: 'AIBKGB2LXXX',
            transaction_total_days: '730',
            countries: ['GB'],
            logo: 'https://storage.googleapis.com/gc-prd-institution_icons-production/IE/PNG/aib.png'
          },
          {
            id: 'SANDBOXFINANCE_SFIN0000',
            name: 'Alpha FX (Test Bank)',
            bic: 'APAHGB2L',
            transaction_total_days: '730',
            countries: ['GB'],
            logo: 'https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/alphafx.png'
          },
          {
            id: 'SANDBOXFINANCE_SFIN0000',
            name: 'Amazon card (Newday) (Test Bank)',
            bic: 'NEWDUK00X01',
            transaction_total_days: '730',
            countries: ['GB'],
            logo: 'https://cdn-logos.gocardless.com/ais/NEWDAY_AMAZON_NEWDUK00X01.png'
          }
        ];

        setBankList(bankData);
      } else {
        showToast(status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error fetching bank list:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankChange = async (selectedBankId, isUser) => {
    setErrors({ ...errors, bank: '' });
    const bank = bankList.find(item => item.id === selectedBankId);
    setSelectedBank(bank);

    if (isUser) {
      setIsLoading(true);
      await createRequisitionLink(bank);
      setSendMail(true);
    }
  };

  const createRequisitionLink = async bank => {
    if (!bank) return;
    try {
      const { status_code, status_message, data } =
        await createRequisitionLinkApi(
          { bank_name: bank.name, institution_id: bank.id },
          loanId
        );
      if (status_code >= 200 && status_code < 300) {
        setRequisitionLink(data.link);
        if ([Roles.Customer, Roles.Leads].includes(role)) {
          showToast('Requisition Link Created.', {
            type: NotificationType.Success
          });
        } else {
          showToast("Requisition link sent to customer's email address.", {
            type: NotificationType.Success
          });
          setIsLoading(true);
        }
      } else {
        showToast(status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error creating requisition link:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfirmBankAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status_code, status_message, data } =
        await confirmBankAccountGetApi(loanId);
      if (status_code >= 200 && status_code < 300) {
        setConfirmBankAccountList(data.accounts);
      } else {
        showToast(status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error fetching confirm bank accounts:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  }, [loanId, showToast]);

  useEffect(() => {
    if (accountNumber) {
      setErrors({ ...errors, bank: '' });
    }
  }, [accountNumber]);

  const confirmBankAccount = async event => {
    event.preventDefault();

    setIsLoading(true);
    try {
      const { status_code, status_message, data } =
        await confirmBankAccountPostApi(
          { account_number: accountNumber?.id },
          loanId
        );
      if (status_code === 200) {
        showToast('Bank account confirmed successfully', {
          type: NotificationType.Success
        });
        // updateFilledForms(loanId, { gocardless_statement: true });
        setIsSendConsent(true);
        setAccountNumber(null);
        setSelectedBank(null);
        setConfirmBankAccountList([]);
        setRequisitionLink('');
        setConsent(data.consent_completed);
      } else {
        showToast(status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error confirming bank account:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const renderBankList = () => (
    <div className="absolute z-50 flex h-[10rem] w-full flex-col overflow-y-scroll bg-gray-100 px-4 py-1 text-gray-800 shadow-xl">
      {bankList.map(item => (
        <a
          key={item.id}
          onClick={() =>
            [Roles.Customer, Roles.Leads].includes(role)
              ? handleBankChange(item.id, true)
              : handleBankChange(item.id, false)
          }
          className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black"
        >
          {item.name}
        </a>
      ))}
    </div>
  );

  const renderAccountList = () => (
    <div className="absolute z-50 flex w-full flex-col bg-gray-100 px-4 py-1 text-gray-800 shadow-xl">
      {confirmBankAccountList.map(account => (
        <a
          key={account}
          onClick={() => setAccountNumber(account)}
          className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black"
        >
          {account?.account_number}
        </a>
      ))}
    </div>
  );

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="container mx-auto h-[20rem] border bg-white p-4">
        <div
          className="group relative my-4 cursor-pointer border-b py-4"
          onClick={() => setShowBanks(!showBanks)}
        >
          <div className="flex items-center justify-between">
            <a className="font-regular flex items-center text-[14px] text-[#929292]">
              <img src={bank} className="mr-1 h-5 w-5" />
              {selectedBank ? selectedBank.name : 'Select Bank'}
            </a>
            <RiArrowDownSLine size={24} />
          </div>
          {showBanks && renderBankList()}
          {errors.bank && (
            <p className="mt-1 text-xs text-red-500">{errors.bank}</p>
          )}
        </div>

        {[Roles.Customer, Roles.Leads].includes(role) && requisitionLink && (
          <div className="my-3 py-4">
            <div className="flex w-full items-center border border-[#1A439A] text-[14px] font-normal text-[#1A439A]">
              <button
                type="button"
                onClick={() => window.open(requisitionLink, '_blank')}
                className="flex w-3/5 items-center border-r border-[#1A439A] bg-[#DDE3F0] px-4 py-4"
              >
                <FaChevronRight className="mr-1" />
                {'Go to Requisition Link'}
              </button>
              <button
                type="button"
                onClick={fetchConfirmBankAccounts}
                className="flex w-2/5 items-center border bg-[#DDE3F0] px-4 py-4"
              >
                <LuRefreshCw className="mr-1" />
                {'Fetch Bank Account'}
              </button>
            </div>
          </div>
        )}

        {[
          Roles.FieldAgent,
          Roles.UnderWriter,
          Roles.Manager,
          Roles.Admin
        ].includes(role) &&
          selectedBank && (
            <div className="my-3 py-4">
              <div className="flex w-full items-center border border-[#1A439A] text-[14px] font-normal text-[#1A439A]">
                <button
                  type="button"
                  onClick={() => handleBankChange(selectedBank.id, true)}
                  className="flex w-3/5 items-center border-r border-[#1A439A] bg-[#DDE3F0] px-4 py-4 max-sm:w-full max-sm:border-b"
                >
                  <FaChevronRight className="mr-1" />
                  {sendMail ? 'Resend' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={fetchConfirmBankAccounts}
                  className="flex w-2/5 items-center border bg-[#DDE3F0] px-4 py-4"
                >
                  <LuRefreshCw className="mr-1" />
                  {'Fetch Bank Account'}
                </button>
              </div>
            </div>
          )}

        {confirmBankAccountList.length > 0 && (
          <div
            className="group relative mt-4 cursor-pointer"
            onClick={() => setShowAccounts(!showAccounts)}
          >
            <div className="flex items-center justify-between">
              <a className="font-regular flex items-center text-[14px] text-[#929292]">
                <TbAlignBoxLeftStretch className="mr-1 h-5 w-5" />
                {accountNumber?.account_number || 'Select Account'}
              </a>
              <RiArrowDownSLine size={24} />
            </div>
            {showAccounts && renderAccountList()}
            {errors.account && (
              <p className="mt-1 text-xs text-red-500">{errors.account}</p>
            )}
          </div>
        )}
      </div>
      {accountNumber?.account_number && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={confirmBankAccount}
            className="bg-[#1A439A] px-5 py-3 font-medium uppercase text-white"
          >
            {'Confirm Bank Account'}
          </button>
        </div>
      )}
      {consent && <a>{consent}</a>}
    </div>
  );
};

export default GrandGocardless;
