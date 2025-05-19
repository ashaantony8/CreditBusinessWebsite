import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LiaUsersCogSolid } from 'react-icons/lia';
import { RxCross2 } from 'react-icons/rx';

import { createCustomerApi } from '../../../api/userServices';
import {
  loanFormCommonStyleConstant,
  manageLead
} from '../../../utils/constants';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { ManageLeadSchema } from '../../../utils/Schema';
import { personalInformationType } from '../../../utils/types';
import FieldRenderer from '../../commonInputs/FieldRenderer';
import Loader from '../../Loader';

const AddLead = ({ isOpenAddLead, setIsOpenAddLead }) => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Partial<personalInformationType>>({
    resolver: yupResolver(ManageLeadSchema)
  });
  const { handleSubmit, reset } = methods;
  const { showToast } = useToast();
  const fieldRenderer = new FieldRenderer(
    manageLead,
    loanFormCommonStyleConstant,
    ManageLeadSchema
  );

  const toggleModal = () => {
    setIsOpenAddLead(prevState => !prevState);
  };

  const onSubmit = async (data: Partial<personalInformationType>) => {
    try {
      setIsLoading(true);
      const response = await createCustomerApi(data);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast('Lead created successfully', {
          type: NotificationType.Success
        });
        toggleModal();
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
      showToast('Failed to add lead', { type: NotificationType.Error });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpenAddLead) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      reset();
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpenAddLead, reset]);

  const onError = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
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
        <div className="relative w-full max-w-md md:h-auto">
          <div className="relative bg-white px-2 shadow">
            <div className="flex justify-end px-4 pt-6">
              <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-[#1A439A]">
                <LiaUsersCogSolid size={24} />
              </div>
              <p className="my-1 pl-4 text-[15px] font-medium">
                {'Create Lead Form'}
                <div className="text-[11px] text-[#656565]">
                  {'Hey! you can create a Lead from here!'}
                </div>
              </p>
              <button
                onClick={toggleModal}
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
              >
                <RxCross2 size={24} />
              </button>
            </div>
            <form
              className="px-2 pb-6 text-[#000000]"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <div className=" ">
                <div className="mt-4 grid grid-cols-1 gap-4 p-2">
                  {fieldRenderer.renderField(['email'])}
                </div>
                <div className="grid grid-cols-1 gap-4 p-2">
                  {fieldRenderer.renderField(['phone_number'])}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-2">
                <input
                  type="submit"
                  value="SUBMIT"
                  className="w-full rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-blue-800"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AddLead;
