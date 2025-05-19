import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useSelector } from 'react-redux';

import { primaryBankAccountApi } from '../../../api/loanServices';
import build from '../../../assets/svg/gocard_bank.svg';
import { authSelector } from '../../../store/auth/userSlice';
import { declarationCheckboxStyle } from '../../../utils/constants';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

const BankCard = ({
  statement,
  setSelectedStatement,
  setShowModal,
  isHigherAuthority,
  seuUpdatedPrimaryAccount,
  setIsGocardless
}) => {
  const { role } = useSelector(authSelector);
  const { showToast } = useToast();

  const getStyle = () => {
    if (isHigherAuthority) {
      return {
        border: statement?.all_grouped ? '1px solid green' : '1px solid tomato'
      };
    } else {
      return { border: '1px solid gray' };
    }
  };

  const handlePrimaryBankAccount = async () => {
    try {
      const payload = {
        is_primary_account: !statement.is_primary_account // Toggle the value
      };

      const loanGetApiResponse = await primaryBankAccountApi(
        statement.statement_id,
        payload
      );

      if (loanGetApiResponse.status_code === 200) {
        seuUpdatedPrimaryAccount(prevState => !prevState);
        showToast('Primary bank account set successfully', {
          type: NotificationType.Success
        });
      } else {
        showToast(loanGetApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('Exception', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  return (
    <div
      style={getStyle()}
      className="relative flex flex-col justify-between gap-2 rounded-lg border bg-white p-4 shadow-md"
    >
      <div className="text-[14px] font-medium leading-6">
        {statement.continue_with_gocardless
          ? 'With Gocardless'
          : 'With out Gocardless'}
      </div>
      <div className="bg-white-300 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 hidden items-center justify-center rounded-full border-4 border-white bg-[#E8E8E8] p-3 text-xl font-semibold text-[#1A439A] sm:flex">
            <img src={build} className="h-5 w-5" />
          </div>
          <div className="text-[14px] font-medium leading-6">
            <p className="text-[12px] font-semibold text-[#929292]">
              {'Bank name'}
            </p>
            {statement.bank_name || 'Company Name'}
          </div>
        </div>
        <div className="text-[14px] font-medium leading-6">
          <p className="text-[12px] font-semibold text-[#929292]">
            {'Account Holder Name'}
          </p>
          {statement.account_holder_name || 'N/A'}
        </div>

        <div className="text-[14px] font-medium leading-6">
          <p className="text-[12px] font-semibold text-[#929292]">
            {'Account Number'}
          </p>
          {statement.bank_account_number || 'N/A'}
        </div>
        <div className="mr-8 mt-4 flex items-center">
          <label
            htmlFor="setPrimaryBankAccount"
            className={`flex cursor-pointer items-center ${declarationCheckboxStyle.wrapperClass} `}
          >
            <span className={`${declarationCheckboxStyle.labelClass} mr-2`}>
              {'Primary'}
            </span>
            <input
              id="setPrimaryBankAccount"
              type="checkbox"
              onChange={handlePrimaryBankAccount}
              disabled={
                ![Roles.UnderWriter, Roles.Manager, Roles.Admin].includes(role)
              } // only allow befor disbursal
              checked={statement?.is_primary_account}
              className={` ${declarationCheckboxStyle.fieldClass}`}
            />
          </label>
        </div>
        {isHigherAuthority && (
          <div
            className="cursor-pointer"
            onClick={() => {
              setSelectedStatement(statement);
              setShowModal(true);
              setIsGocardless(statement.continue_with_gocardless);
            }}
          >
            <HiOutlineDotsHorizontal size={32} color="#929292" />
          </div>
        )}
      </div>

      <div className="m-4 flex justify-between">
        {statement.start_date && statement.end_date && (
          <span>
            {' '}
            <p className="text-[12px] font-semibold text-[#929292]">
              {'Statement Date'}
            </p>
            <div className="my-3 flex items-center text-[16px] font-semibold max-sm:text-[12px]">
              <span>
                {' '}
                {statement.start_date}{' '}
                <a className="mx-2 text-[14px] font-medium text-[#929292] max-sm:text-[12px]">
                  {'TO'}{' '}
                </a>
                {statement.end_date}
              </span>
            </div>
          </span>
        )}

        {statement.total_periods && (
          <span>
            <p className="text-[12px] font-semibold text-[#929292]">
              {'Total periods'}
            </p>{' '}
            <div className="my-3">{statement.total_periods}</div>
          </span>
        )}
      </div>
    </div>
  );
};

export default BankCard;
