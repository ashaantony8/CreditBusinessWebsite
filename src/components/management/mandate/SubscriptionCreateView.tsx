import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';

import {
  addNewPap,
  fetchDataForMandateCreation
} from '../../../api/loanServices';
import {
  fieldClass,
  labelClass,
  subscriptionFields
} from '../../../utils/constants';
import { convertDateString } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { subscriptiontSchema } from '../../../utils/Schema';
import {
  arrayfield,
  SubscriptionCreatePropType,
  subscriptionType
} from '../../../utils/types';
import InputController from '../../commonInputs/Input';
import FundingSelectModal from '../FundingSelectModal';
import AddSubscriptionModal from './AddSubscriptionModal';

const dummmyPlans = [
  {
    day_of_debit: 'Monday',
    amount: '450',
    start_date: '15-10-24',
    period: 6,
    reference_no: 'dadadad'
  }
];

const SubscriptionCreateView: React.FC<SubscriptionCreatePropType> = ({
  setShowCreateView
}) => {
  const methods = useForm({
    resolver: yupResolver(subscriptiontSchema)
  });

  const [existingSubscriptionPlans, setExistingSubscriptionPlans] = useState(
    []
  );

  const {
    watch,
    setValue,
    trigger,
    formState: { errors }
  } = methods;

  const watchContractId = watch('contract_id');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSelectCustomerModal, setOpenSelectCustomerModal] = useState(false);
  const [contractId, SetContractId] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchContractDetails = async contractId => {
    //todo : fill all fields according to api response
    const response = await fetchDataForMandateCreation(contractId);
    if (response.status_code === 200) {
      const data = response;
      setExistingSubscriptionPlans(dummmyPlans);
      subscriptionFields.map(i => {
        setValue(i.key as keyof subscriptionType, data[i.key], {
          shouldValidate: true
        });
      });
      //to add from backend data
      // setTotalAmount(1500)
    }
  };

  const currentDynamicPlanFields = methods.getValues('subscriptions') || [];

  const handleDelete = () => {
    methods.setValue('subscriptions', []);
  };

  const { showToast } = useToast();

  const submitPap = async () => {
    trigger();
    console.log(errors, 'errors in form', Object.values(errors).length);
    if (Object.values(errors).length > 0) return;

    const planFieldsValues: subscriptionType = methods.getValues();

    const adjustment_plans: subscriptionType['subscriptions'] =
      currentDynamicPlanFields.map(i => {
        i.start_date = dayjs(i.start_date).format('YYYY-MM-DD');
        return i;
      });

    planFieldsValues.subscriptions = adjustment_plans;
    planFieldsValues.contract_id = contractId;
    try {
      const response = await addNewPap(planFieldsValues);
      if (response.status_code === 200) {
        showToast(response?.status_message, { type: NotificationType.Success });
        if (setShowCreateView) {
          setShowCreateView(false);
        }
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    }
  };

  const handleOnClick = () => {
    setOpenSelectCustomerModal(true);
  };

  const handleSelect = async loan => {
    if (loan) {
      try {
        await fetchContractDetails(loan.id);
        setValue('contract_id', loan.loan_number);
        trigger('contract_id');
        SetContractId(loan.id);
      } catch (error) {
        showToast(error, {
          type: NotificationType.Error
        });
      }
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <p className="flex h-20 items-center justify-between px-4">
          <div
            onClick={() => setShowCreateView && setShowCreateView(false)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
          >
            <BiArrowBack className="text-lg" />
          </div>
          <a className="pr-4 text-[18px] font-semibold text-[#000000] max-sm:text-[12px]">
            {'Subscription Plan'}
          </a>
          {watchContractId && (
            <button
              onClick={openModal}
              className="cursor-pointer rounded-lg bg-[#1A439A] px-4 py-2 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-[#173a84] max-sm:text-[12px]"
            >
              {'Add Subscription Plan'}
            </button>
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
                    fieldClass,
                    labelClass,
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
                {subscriptionFields.map((i: arrayfield, index) => (
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
                <div className="px-4 pr-4 text-[18px] font-semibold text-[#000000] max-sm:text-[16px]">
                  {'Existing Subscription Plans'}
                </div>

                {existingSubscriptionPlans.map((field, index) => {
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
                              {'Period'}
                            </div>
                            <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                              {field.period || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                              {'Reference Number'}
                            </div>
                            <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                              {field.reference_number || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {currentDynamicPlanFields.length > 0 && (
                <div>
                  <p className="px-4 pr-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-[18px] font-semibold text-[#000000] max-sm:text-[16px]">
                          {'New Subscription Plan'}
                        </div>
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
                                {'period'}
                              </div>
                              <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                                {field.period || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                                {'Reference Number'}
                              </div>
                              <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                                {field.reference_number || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
      {isModalOpen && (
        <AddSubscriptionModal toggleModal={closeModal} methods={methods} />
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

export default SubscriptionCreateView;
