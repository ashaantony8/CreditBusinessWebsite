import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';

import {
  createCashReceiptsApi,
  fetchDataForCashPaymentCreation,
  listFailedMandatesForLoanApi
} from '../../../api/loanServices';
import { cashReceiptFields } from '../../../utils/constants';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { cashReceiptSchema } from '../../../utils/Schema';
import { arrayfield, cashReceiptType } from '../../../utils/types';
import InputController from '../../commonInputs/Input';
import FundingSelectModal from '../FundingSelectModal';
import FailedMandatesTableView from './FailedMandatesTableView';

const fieldClass = `peer bg-transparent h-12 w-full rounded-lg text-black placeholder-transparent px-8 focus:outline-none focus:border-gray-500 border border-stone-300`;
const labelClass = `-top-3 absolute cursor-text text-sm text-gray-500 start-8 mt-1 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-gray-600 peer-focus:text-sm transition-all`;

const ReceiptCreateView = ({ setShowCreateView }) => {
  const [openSelectCustomerModal, setOpenSelectCustomerModal] = useState(false);
  const [contractId, SetContractId] = useState(null);

  const methods = useForm({
    resolver: yupResolver(cashReceiptSchema)
  });

  const {
    watch,
    trigger,
    setValue,
    handleSubmit,
    control,
    formState: { errors }
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'failed_mandates'
  });

  const { showToast } = useToast();

  const fetchFailedMandates = async selectedFundingId => {
    try {
      const response = await listFailedMandatesForLoanApi(selectedFundingId);
      if (response.status_code === 200) {
        const { data } = response;
        const arr = data
          ?.filter(item => item.mandate.status === 'failed')
          .map(i => {
            return {
              id: i.mandate.id,
              contract_id: i.customer_loan,
              loan_number: i.loan_number,
              date: i.mandate.created_on,
              amount: i.amount,
              status: 'failed',
              received_date: new Date(),
              received_amount: 0
            };
          });

        setValue('failed_mandates', arr);
      } else {
        throw new Error('Something went wrong.');
      }
    } catch {
      throw new Error('Something went wrong.');
    }
  };

  const fetchContractDetails = async selectedFundingId => {
    try {
      const response = await fetchDataForCashPaymentCreation(selectedFundingId);

      if (response.status_code === 200) {
        const data = response;
        data.outstanding_amount = data.pending_due;

        cashReceiptFields.map(i => {
          setValue(i.key as keyof cashReceiptType, data[i.key], {
            shouldValidate: true
          });
        });
        await fetchFailedMandates(selectedFundingId);
      } else {
        throw new Error('Something went wrong.');
      }
    } catch {
      throw new Error('Something went wrong.');
    }
  };

  const watchFailedMandates = watch('failed_mandates');

  useEffect(() => {}, [watchFailedMandates]);

  const onSubmit = async data => {
    const formattedData = data;
    formattedData.failed_mandates.forEach((field, index) => {
      formattedData.failed_mandates[index].date = dayjs(field.date).format(
        'YYYY-MM-DD'
      );
      formattedData.failed_mandates[index].received_date = dayjs(
        field.received_date
      ).format('YYYY-MM-DD');
      formattedData.failed_mandates[index].contract_id = contractId;
    });
    try {
      const response = await createCashReceiptsApi(formattedData);
      if (response.status_code === 200) {
        showToast(response?.status_message, { type: NotificationType.Success });
        setShowCreateView(false);
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    console.log(errors, 'form erros');
  }, [errors]);

  const handleSelect = async loan => {
    if (loan) {
      try {
        await fetchContractDetails(loan.id);
        setValue('contract_id', loan.loan_number);
        trigger('contract_id');
        SetContractId(loan.id);
      } catch (error) {
        showToast(error.message, {
          type: NotificationType.Error
        });
      }
    }
  };

  const handleOnClick = () => {
    setOpenSelectCustomerModal(true);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full p-8">
          <div className="sticky top-0 z-10 bg-white">
            <p className="flex h-20 items-center justify-between px-4">
              <div
                onClick={() => setShowCreateView(false)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
              >
                <BiArrowBack className="text-lg" />
              </div>
              <a className="pr-4 text-[18px] font-semibold text-[#000000] max-sm:text-[12px]">
                {'Cash Receipt'}
              </a>
            </p>
          </div>
          <div className="flex h-[75%] flex-1 flex-col overflow-y-auto rounded-lg border bg-white max-sm:h-[64vh]">
            <div className="max-sm:p-4">
              <div>
                <div className="max-sm:cols-1 grid grid-cols-3 gap-4 p-[2%] max-lg:grid-cols-1 max-sm:justify-center">
                  <InputController
                    metaData={{
                      fieldClass,
                      labelClass,
                      key: 'contract_id',
                      placeholder: 'Contract Id',
                      isRequired: true,
                      name: `contract_id`,
                      label: 'Contract Id',
                      type: 'text',
                      isReadOnly: true,
                      events: {
                        onClick: handleOnClick
                      }
                    }}
                  />
                  {cashReceiptFields.map((i: arrayfield, index) => (
                    <InputController
                      key={index}
                      metaData={{
                        fieldClass,
                        labelClass,
                        key: i.key,
                        placeholder: i.label,
                        isRequired: true,
                        name: i.key,
                        label: i.label,
                        type: 'text'
                      }}
                    />
                  ))}
                </div>
                {contractId ? (
                  <div>
                    <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
                      {'Failed Mandates'}
                    </p>
                    <FailedMandatesTableView list={fields} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="sticky top-[100vh] flex items-center justify-between bg-white px-4 font-light max-lg:py-6 max-sm:pb-12 max-sm:pt-0">
            <div className="flex flex-1 justify-between">
              <button
                type="submit"
                className="my-4 rounded-lg bg-color-text-secondary px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-blue-800"
              >
                {'Submit'}
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
      {openSelectCustomerModal && (
        <FundingSelectModal
          close={() => {
            setOpenSelectCustomerModal(false);
          }}
          handleSelect={handleSelect}
        />
      )}
    </>
  );
};

export default ReceiptCreateView;
