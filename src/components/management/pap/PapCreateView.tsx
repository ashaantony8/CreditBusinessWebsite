import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';

import { addNewPap, fetchDataForPapCreation } from '../../../api/loanServices';
import { fieldClass, labelClass, PapFields } from '../../../utils/constants';
import { convertDateString } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { paymentArrangementPlanSchema } from '../../../utils/Schema';
import {
  arrayfield,
  PapOptionalKeys,
  paymentArrangementPlanType
} from '../../../utils/types';
import InputController from '../../commonInputs/Input';
import FundingSelectModal from '../FundingSelectModal';
import AddPap from './AddPap';

const PapCreateView = ({ setShowCreateView }) => {
  const methods = useForm({
    resolver: yupResolver(paymentArrangementPlanSchema)
  });

  const [pendingAmount, setPendingAmount] = useState(0);
  const [openSelectCustomerModal, setOpenSelectCustomerModal] = useState(false);

  const {
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = methods;

  const watchContractId = watch('contract_id');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractId, SetContractId] = useState(null);

  const openModal = () => {
    if (pendingAmount > 0) {
      setIsModalOpen(true);
    }
  };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (pendingAmount) {
      setPendingAmount(Math.round(pendingAmount * 100) / 100); // Rounds to 2 decimal places
    }
  }, [pendingAmount]);

  const PapFields1: {
    key: PapOptionalKeys<paymentArrangementPlanType>;
    label: string;
  }[] = PapFields;
  const fetchContractDetails = async selectedFundingId => {
    //todo : fill all fields according to api response
    try {
      const response = await fetchDataForPapCreation(selectedFundingId);
      if (response.status_code === 200) {
        const data = response;
        PapFields1.map(i => {
          setValue(i.key as keyof paymentArrangementPlanType, data[i.key], {
            shouldValidate: true
          });
        });
        //to add from backend data
        // setTotalAmount(1500)
      } else {
        throw new Error('Something went wrong.');
      }
    } catch {
      throw new Error('Something went wrong.');
    }
  };

  const currentDynamicPlanFields = methods.getValues('adjustment_plans') || [];

  const handleDelete = () => {
    methods.setValue('adjustment_plans', []);
  };

  useEffect(() => {}, [watch('adjustment_plans')]);
  const { showToast } = useToast();

  const submitPap = async () => {
    trigger();
    console.log(errors, 'errors in form', Object.values(errors).length);
    if (Object.values(errors).length > 0) return;

    const planFieldsValues: paymentArrangementPlanType = methods.getValues();

    const adjustment_plans: paymentArrangementPlanType['adjustment_plans'] =
      currentDynamicPlanFields.map(i => {
        i.start_date = dayjs(i.start_date).format('YYYY-MM-DD');
        return i;
      });
    planFieldsValues.adjustment_plans = adjustment_plans;

    // Validate the sum against totalPendingDueToCollect
    const tolerance = 1;
    if (Math.abs(pendingAmount) > tolerance) {
      showToast(
        `Validation failed: Total amount in adjustment plans (${pendingAmount}) does not match the pending due (${totalPendingDueToCollect}).`,
        { type: NotificationType.Error }
      );
      return;
    }

    planFieldsValues.contract_id = contractId;
    try {
      const response = await addNewPap(planFieldsValues);
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

  const totalPendingDueToCollect = watch('pending_due');

  useEffect(() => {
    if (currentDynamicPlanFields.length > 0) {
      const total_to_be_collected = currentDynamicPlanFields.reduce(
        (acc, curr) => {
          return acc + (curr.total_amount_collected || 0);
        },
        0
      );
      setPendingAmount(totalPendingDueToCollect - total_to_be_collected);
    }
  }, [currentDynamicPlanFields, handleDelete]);

  useEffect(() => {
    if (totalPendingDueToCollect) setPendingAmount(totalPendingDueToCollect);
  }, [totalPendingDueToCollect]);

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
      <div className="sticky top-0 z-10 bg-white">
        <p className="flex h-20 items-center justify-between px-4">
          <div
            onClick={() => setShowCreateView(false)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
          >
            <BiArrowBack className="text-lg" />
          </div>
          <a className="pr-4 text-[18px] font-semibold text-[#000000] max-sm:text-[12px]">
            {'Payment Arrangement Plan'}
          </a>
          {watchContractId && (
            <p
              className="text-[18px] font-semibold text-[#1A439A] max-sm:text-[12px]"
              style={{
                color: pendingAmount > 0 ? '#1A439A' : 'grey',
                cursor: pendingAmount > 0 ? 'pointer' : 'not-allowed'
              }}
              onClick={openModal}
            >
              {'Add Plan Adjustment'}
            </p>
          )}
        </p>
      </div>
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto rounded-lg border bg-white max-sm:h-[64vh]">
        <div className="max-sm:p-4">
          <FormProvider {...methods}>
            <form className="w-full">
              <div className="flex flex-wrap gap-8 p-[4%] max-sm:justify-center">
                <InputController
                  metaData={{
                    fieldClass: fieldClass,
                    labelClass: labelClass,
                    key: 'contract_id',
                    placeholder: 'Contract Id',
                    isRequired: true,
                    name: `contract_id`,
                    label: 'Contract Id',
                    type: 'text',
                    events: {
                      onClick: handleOnClick
                    }
                  }}
                />
                {PapFields.map((i: arrayfield, index) => (
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

              <div>
                <p className="px-4 pr-4">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-[18px] font-semibold text-[#000000] max-sm:text-[16px]">
                        {'Adjustment Plan'}
                      </div>
                      <p className="text-sm">
                        {'Pending amount : '}
                        {pendingAmount}
                      </p>
                    </div>
                    <div className="text-[#840000]">
                      <button
                        onClick={e => {
                          e.preventDefault();
                          handleDelete();
                        }}
                        className="inline-flex items-center space-x-1 py-2"
                      >
                        <span>
                          {' '}
                          <RiDeleteBinLine size={16} />{' '}
                        </span>
                        <span className="hidden max-lg:text-[11px] md:inline-block">
                          {'Delete'}
                        </span>
                      </button>
                    </div>
                  </div>
                </p>

                {currentDynamicPlanFields.map((field, index) => {
                  return (
                    <div className="my-4 px-[2%]">
                      <div className="rounded-lg border p-3">
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-8 pt-5 md:grid-cols-3 lg:grid-cols-5"
                        >
                          <div>
                            <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                              {'Day of Debit'}
                            </div>
                            <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                              {field.day_of_debit || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                              {'Amount'}
                            </div>
                            <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                              {field.amount || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                              {'Date'}
                            </div>
                            <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                              {field.start_date
                                ? convertDateString(field.start_date)
                                : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                              {'No of Installments'}
                            </div>
                            <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                              {field.no_of_installments || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                              {'Total Amount to collect'}
                            </div>
                            <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                              {field.total_amount_collected || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      {isModalOpen && (
        <AddPap
          pendingAmount={pendingAmount}
          toggleModal={closeModal}
          methods={methods}
        />
      )}
      <div className="sticky top-[100vh] flex items-center justify-between bg-white px-4 font-light max-lg:py-6 max-sm:pb-12 max-sm:pt-0">
        <div className="flex flex-1 justify-between">
          <button
            type="button"
            onClick={() => submitPap()}
            className="my-4 rounded-lg bg-color-text-secondary px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-blue-800"
          >
            {'Submit'}
          </button>
        </div>
      </div>
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

export default PapCreateView;
