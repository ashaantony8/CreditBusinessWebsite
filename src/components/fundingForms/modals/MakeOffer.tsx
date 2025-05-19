import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  loanOfferApi,
  personalInformationGetAPI
} from '../../../api/loanServices';
import {
  fundingOffer,
  loanFormCommonStyleConstant
} from '../../../utils/constants';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { fundingOfferSchema } from '../../../utils/Schema';
import { MakeOfferProps } from '../../../utils/types';
import FieldRenderer from '../../commonInputs/FieldRenderer';

const MakeOffer: React.FC<MakeOfferProps> = ({ isOpen, onClose, loanId }) => {
  const [currentLoanAmount, setCurrentLoanAmount] = useState<string | null>(
    null
  );
  const [currentLoanWeeks, setCurrentLoanWeeks] = useState<string | null>(null);

  const fieldRenderer = new FieldRenderer(
    fundingOffer,
    loanFormCommonStyleConstant,
    fundingOfferSchema
  );
  const methods = useForm({
    resolver: yupResolver(fundingOfferSchema)
  });

  const { handleSubmit, reset } = methods;

  const { showToast } = useToast();

  const fetchDataFromApi = async (loanId: string) => {
    try {
      const personalInfoApiResponse = await personalInformationGetAPI(loanId);
      if (personalInfoApiResponse?.status_code === 200) {
        setCurrentLoanAmount(
          personalInfoApiResponse?.data?.fund_request_amount
        );
        setCurrentLoanWeeks(
          personalInfoApiResponse?.data?.fund_request_duration_weeks
        );
      } else {
        showToast(personalInfoApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (loanId) {
      fetchDataFromApi(loanId);
    }
  }, [loanId]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: {
    offer_amount: number;
    offer_number_of_weeks: number;
  }) => {
    try {
      const payload = {
        offer_amount: data.offer_amount,
        offer_number_of_weeks: data.offer_number_of_weeks
      };
      const loanOfferApiResponse = await loanOfferApi(payload, loanId);
      if (loanOfferApiResponse?.status_code === 200) {
        showToast('Offer submitted successfully!', {
          type: NotificationType.Success
        });
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        showToast(loanOfferApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  return (
    <FormProvider {...methods}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div className="block flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {'Make an Offer'}
                    </h3>
                    <div className="mt-2">
                      <p className="pb-4 text-sm text-gray-500">
                        {'Current Loan Amount: £'}
                        {currentLoanAmount}
                      </p>
                      <div className="rounded-lg bg-white">
                        {fieldRenderer.renderField(['offer_amount'])}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="pb-4 text-sm text-gray-500">
                        {'Current Loan Weeks: '}
                        {currentLoanWeeks}
                      </p>
                      <div className="rounded-lg bg-white">
                        <div className="rounded-lg bg-white">
                          {fieldRenderer.renderField(['offer_number_of_weeks'])}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={onClose}
                  type="button"
                  className="mr-4 cursor-pointer rounded-lg bg-[#1A439A] px-4 py-2 text-white"
                >
                  {'Close'}
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  type="button"
                  className="mr-4 cursor-pointer rounded-lg bg-[#1A439A] px-4 py-2 text-white"
                >
                  {'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
};

export default MakeOffer;
