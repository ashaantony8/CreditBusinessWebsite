import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RiUserSharedLine } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';

import { addReferralPostAPI } from '../../api/userServices';
import FieldRenderer from '../../components/commonInputs/FieldRenderer';
import Loader from '../../components/Loader';
import {
  loanFormCommonStyleConstant,
  referalformDetails
} from '../../utils/constants';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { ReferralAddFormchema } from '../../utils/Schema';
import { ReferralAddFormData } from '../../utils/types';

const Referalform = ({ closeModal }) => {
  const fieldRenderer = new FieldRenderer(
    referalformDetails,
    loanFormCommonStyleConstant,
    ReferralAddFormchema
  );
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ReferralAddFormData>({
    resolver: yupResolver(ReferralAddFormchema)
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ReferralAddFormData) => {
    setIsLoading(true);
    try {
      const response = await addReferralPostAPI(data);
      if (response.status_code >= 200 && response.status_code < 300) {
        closeModal();
        setTimeout(() => {
          showToast(response.status_message, {
            type: NotificationType.Success
          });
        }, 100);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const onError = async error => {
    console.log('error', error);
  };
  return (
    <FormProvider {...methods}>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
      >
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <div className="relative h-[450px] w-full max-w-md overflow-y-scroll">
          <div className="relative bg-white px-2 shadow">
            <div className="flex justify-end px-4 pt-6">
              <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-[#1A439A]">
                <RiUserSharedLine size={24} />
              </div>
              <p className="my-1 pl-2 text-[15px] font-medium">
                {'Referral Form'}
                <div className="text-[10.5px] text-[#656565]">
                  {'Get 40 Credit for each referral with Credit4business'}
                </div>
              </p>
              <button
                onClick={closeModal}
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
              >
                <RxCross2 size={24} />
              </button>
            </div>
            <div className="grid items-center">
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="px-2 pb-6 text-[#000000]"
                action="#"
              >
                <div className="py-4">
                  <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    <div className="">
                      {fieldRenderer.renderField(['first_name'])}
                    </div>
                    <div className="">
                      {fieldRenderer.renderField(['last_name'])}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['email'])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['phone_number'])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['business_name'])}
                  </div>

                  {/* Start of banking details section */}
                  <div className="px-2">
                    <h2 className="text-sm font-medium text-gray-700">
                      {'Referrer Details'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['bank_details.bank_name'])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['bank_details.account_number'])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField([
                      'bank_details.account_holder_name'
                    ])}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['bank_details.sort_code'])}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-2">
                  <button
                    type="submit"
                    className="w-full rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-blue-800"
                  >
                    {'SUBMIT'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Referalform;
