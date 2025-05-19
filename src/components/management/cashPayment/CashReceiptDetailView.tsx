import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { approveReceipt, getReceiptById } from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import { fieldClass, labelClass, PapFields } from '../../../utils/constants';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { cashReceiptSchema } from '../../../utils/Schema';
import { arrayfield, cashReceiptType } from '../../../utils/types';
import InputController from '../../commonInputs/Input';

const CashReceiptDetailView = () => {
  const methods = useForm({
    resolver: yupResolver(cashReceiptSchema)
  });

  const [approvedInfo, setApprovedInfo] = useState(null);
  const [cashPayment, setCashPayment] = useState(null);

  const { role } = useSelector(authSelector);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { id } = useParams();
  const { setValue, handleSubmit } = methods;

  const failed_mandates = methods.getValues('failed_mandates') || [];

  const fetchContractDetails = async id => {
    const response = await getReceiptById(id);
    if (response.status_code === 200) {
      const { data } = response;
      setCashPayment(data);
      setValue('contract_id', data.loan_number);
      PapFields.map(i => {
        setValue(i.key as keyof cashReceiptType, data[i.key], {
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
      setValue('failed_mandates', data.failed_mandates, {
        shouldValidate: true
      });
    }
  };

  const handleApprove = async () => {
    try {
      const approved = true;
      const payload = {
        id: id,
        approve: approved
      };
      const response = await approveReceipt(payload);
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
        const basePath = window.location.pathname.split('/cash-receipt')[0];
        navigate(`${basePath}/cash-receipt`);
      } else {
        showToast('Something went wrong !!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    }
  };

  const onSubmit = data => {
    console.log(data, 'submit');
  };

  const deletePap = async () => {
    const basePath = window.location.pathname.split('/cash-receipt')[0];
    navigate(`${basePath}/cash-receipt`);

    // try {
    //   const response = await deletePapPlan(planId)
    //   console.log(response, 'res')
    //   if (response.status_code === 200) {
    //     showToast(response.status_message, { type: NotificationType.Success })
    //     navigate('/cash-receipt')
    //   } else {
    //     showToast('Something went wrong !!', { type: NotificationType.Error })
    //   }
    // } catch (error) {
    //   showToast(error.message, { type: NotificationType.Error })
    // }
  };

  useEffect(() => {
    if (id) {
      fetchContractDetails(id);
    }
  }, [id]);

  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <div
          onClick={() =>
            navigate(
              `${window.location.pathname.split('/cash-receipt')[0]}/cash-receipt`
            )
          }
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
        >
          <BiArrowBack className="text-lg" />
        </div>
        <div className="flex h-20 items-center justify-between px-4">
          <p className="pr-4 text-[18px] font-semibold text-[#000000] max-sm:text-[12px]">
            {'Cash Receipt'}
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
                      {'Receipts'}
                    </div>
                  </div>
                </p>

                {failed_mandates.length > 0 &&
                  failed_mandates.map((field, index) => {
                    return (
                      <div className="my-4 px-[2%]">
                        <div className="rounded-lg border p-3">
                          <div
                            key={index}
                            className="grid grid-cols-1 gap-8 pt-5 md:grid-cols-3 lg:grid-cols-5"
                          >
                            <div>
                              <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                                {'Contract Id'}
                              </div>
                              <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                                {field.loan_number || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                                {'Date'}
                              </div>
                              <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                                {dayjs(field.date).format('DD-MM-YY') || 'N/A'}
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
                                {'Status'}
                              </div>
                              <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                                {field.status || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                                {'Receieved Date'}
                              </div>
                              <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                                {dayjs(field.received_date).format(
                                  'DD-MM-YY'
                                ) || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="left-3 top-0 text-[12px] font-normal text-[#929292]">
                                {'Receieved Amount'}
                              </div>
                              <div className="false peer border-none py-1 text-[14px] font-semibold focus-within:border-none focus:outline-none focus:outline-0 max-lg:text-[11px]">
                                {field.received_amount || 'N/A'}
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
      {cashPayment?.is_approved ? null : (
        <div className="sticky top-[100vh] flex items-center justify-between bg-white px-4 font-light max-lg:py-6 max-sm:pb-12 max-sm:pt-0">
          {[Roles.Admin, Roles.Manager].includes(role as Roles) ? (
            <div className="flex flex-1 justify-between">
              <button
                onClick={() => handleApprove()}
                className="my-4 rounded-lg bg-color-text-secondary bg-green-700 px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-green-800"
              >
                {'Approve'}
              </button>
              <button
                onClick={deletePap}
                className="my-4 rounded-lg bg-color-text-secondary px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-blue-800"
              >
                {'Delete'}
              </button>
            </div>
          ) : (
            <div className="flex flex-1 justify-between">
              <button
                onClick={deletePap}
                className="my-4 rounded-lg bg-color-text-secondary px-10 py-2 text-[14px] font-medium uppercase text-white hover:bg-blue-800"
              >
                {'Delete'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CashReceiptDetailView;
