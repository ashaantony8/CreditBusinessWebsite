import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  approvePapPlan,
  cancelPapPlan,
  deletePapPlan,
  getPapPlanById,
  sendPapContractApi
} from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import { fieldClass, labelClass, PapFields } from '../../../utils/constants';
import { Roles } from '../../../utils/enums';
import { convertDateString } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { paymentArrangementPlanSchema } from '../../../utils/Schema';
import { arrayfield, paymentArrangementPlanType } from '../../../utils/types';
import InputController from '../../commonInputs/Input';
import DeleteConfirmationModal from '../../DeleteConfirmationModal';
import Loader from '../../Loader';
import ShowHandleApproveModal from './ShowHandleApproveModal';

const PapDetailView = () => {
  const methods = useForm({
    resolver: yupResolver(paymentArrangementPlanSchema)
  });

  const [approvedInfo, setApprovedInfo] = useState(null);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const { role } = useSelector(authSelector);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { planId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [showHandleApproveModal, setShowHandleApproveModal] = useState(false);
  const [pap, setPap] = useState(null);

  const { setValue, handleSubmit } = methods;

  const adjustment_plans = methods.getValues('adjustment_plans') || [];

  const fetchContractDetails = async id => {
    try {
      const response = await getPapPlanById(id);
      if (response.status_code === 200) {
        const { data } = response;
        setPap(data);
        setValue('contract_id', data.loan_number);

        PapFields.map(i => {
          setValue(i.key as keyof paymentArrangementPlanType, data[i.key], {
            shouldValidate: true
          });
        });
        if (data?.approved_by) {
          const info = {
            ...data?.approved_by,
            approved_date: data.approved_date
          };
          setApprovedInfo(info);
        }

        if (
          data?.adjustment_plans?.[0]?.signable_contract?.signed_pdf &&
          data?.adjustment_plans?.[0]?.signable_contract?.signed_pdf !== ''
        ) {
          setIsSigned(true);
        }
        setValue('adjustment_plans', data.adjustment_plans, {
          shouldValidate: true
        });
      } else {
        showToast('Something went wrong !', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const approved = true;
      const payload = {
        id: planId,
        approve: approved
      };
      const response = await approvePapPlan(payload);
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
        const basePath = window.location.pathname.split('/pap-details')[0];
        navigate(`${basePath}/pap`);
      } else {
        showToast('Something went wrong !', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {};

  const handleDelete = () => {
    setShowDeleteConfirmationModal(true);
  };

  const deletePap = async () => {
    try {
      const response = await deletePapPlan(planId);
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
        const basePath = window.location.pathname.split('/pap-details')[0];
        navigate(`${basePath}/pap`);
      } else {
        showToast('Something went wrong !', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    }
  };

  const handleCancel = async () => {
    try {
      const payload = {
        id: planId,
        cancel: true
      };
      const response = await cancelPapPlan(payload);
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
        const basePath = window.location.pathname.split('/pap-details')[0];
        navigate(`${basePath}/pap`);
      } else {
        showToast('Something went wrong !', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (planId) {
      setIsLoading(true);
      fetchContractDetails(planId);
    }
  }, [planId]);

  const handleSendContract = async () => {
    setIsLoading(true);
    try {
      const response = await sendPapContractApi(pap.contract_id);
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
      } else {
        showToast('Something went wrong !', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  // const isSigned= !!(adjustment_plans[0].signable_contract.signed_pdf?.signed_pdf&&adjustment_plans[0].signable_contract.signed_pdf!=="")

  const RenderButton = () => {
    //if approved show cancel

    if (pap?.is_canceled) {
      return <div></div>;
    } else if ([Roles.Admin, Roles.Manager].includes(role as Roles)) {
      return (
        <div className="flex flex-1 items-center gap-4">
          {isSigned ? (
            <button
              onClick={() => setShowHandleApproveModal(true)}
              disabled={!isSigned}
              className={`rounded-lg px-10 py-2 text-[14px] ${isSigned ? 'cursor-pointer bg-green-700' : 'bg-gray-700'} my-4 bg-color-text-secondary font-medium uppercase text-white hover:${isSigned ? 'bg-green-800' : 'bg-gray-700'}`}
            >
              {'Approve'}
            </button>
          ) : (
            <button
              onClick={() => handleSendContract()}
              className="my-4 cursor-pointer rounded-lg bg-color-text-secondary bg-green-700 px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-green-800"
            >
              {'Send Contract'}
            </button>
          )}
          <button
            onClick={handleDelete}
            className="my-4 rounded-lg bg-color-text-secondary px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-blue-800"
          >
            {'Delete'}
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-1 justify-between">
          <button
            onClick={handleDelete}
            className="my-4 rounded-lg bg-color-text-secondary px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-blue-800"
          >
            {'Delete'}
          </button>
        </div>
      );
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="sticky top-0 z-10 bg-white">
        <div
          onClick={() =>
            navigate(`${window.location.pathname.split('/pap-details')[0]}/pap`)
          }
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
        >
          <BiArrowBack className="text-lg" />
        </div>
        <div className="flex h-20 items-center justify-between px-4">
          <p className="pr-4 text-[18px] font-semibold text-[#000000] max-sm:text-[12px]">
            {'Payment Arrangement Plan'}
          </p>
          {approvedInfo ? (
            <div>
              <p className="text-[tomato]">
                {'Approved by : '}
                {approvedInfo?.first_name} {approvedInfo?.last_name}
                {' on'} {dayjs(approvedInfo?.approved_date).format('DD/MM/YY')}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex h-[75%] flex-1 flex-col overflow-y-auto rounded-lg border bg-white max-sm:h-[64vh]">
        <div className="max-sm:p-4">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap gap-8 p-[4%] max-sm:justify-center">
                <InputController
                  metaData={{
                    fieldClass: fieldClass,
                    labelClass: labelClass,
                    key: 'contract_id',
                    placeholder: 'Contract ID',
                    name: 'contract_id',
                    label: 'Contract ID',
                    type: 'text',
                    isDisabled: true
                  }}
                />
                {PapFields.map((i: arrayfield, index) => (
                  <InputController
                    key={index}
                    metaData={{
                      fieldClass: fieldClass,
                      labelClass: labelClass,
                      key: i.key,
                      placeholder: i.label,
                      name: i.key,
                      label: i.label,
                      type: 'text',
                      isDisabled: true
                    }}
                  />
                ))}
              </div>
              <div>
                <p className="px-4 pr-4">
                  <div className="flex justify-between">
                    <div className="text-[18px] font-semibold text-[#000000] max-sm:text-[16px]">
                      {'Adjustment Plan'}
                    </div>
                  </div>
                </p>

                {adjustment_plans.length > 0 &&
                  adjustment_plans.map((field, index) => {
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

        {showDeleteConfirmationModal ? (
          <DeleteConfirmationModal
            confirmDelete={() => deletePap()}
            closeModal={() => setShowDeleteConfirmationModal(false)}
          />
        ) : null}
      </div>
      {pap?.is_approved ? (
        <button
          onClick={() => handleCancel()}
          className="my-4 rounded-lg bg-amber-500 bg-green-700 px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-amber-800"
        >
          {'Cancel'}
        </button>
      ) : (
        <div className="sticky top-[100vh] flex items-center justify-between bg-white px-4 font-light max-lg:py-6 max-sm:pb-12 max-sm:pt-0">
          <RenderButton />
        </div>
      )}
      <ShowHandleApproveModal
        title="Confirmation"
        isOpen={showHandleApproveModal}
        onApprove={handleApprove}
        onClose={() => setShowHandleApproveModal(false)}
      />
    </div>
  );
};

export default PapDetailView;
