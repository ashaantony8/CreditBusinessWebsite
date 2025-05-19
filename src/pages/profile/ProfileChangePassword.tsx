import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { IoIosArrowForward } from 'react-icons/io';
import { MdLockOutline } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

import FieldRenderer from '../../components/commonInputs/FieldRenderer';
import Loader from '../../components/Loader';
import {
  changePasswordInputs,
  loanFormCommonStyleConstant
} from '../../utils/constants';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { ChangePasswordSchema } from '../../utils/Schema';
interface ChangePasswordFormValues {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ProfileChangePassword: React.FC = () => {
  const [changePasswordApiError, setChangePasswordApiError] = useState<
    string | null
  >(null);
  const { changePassword } = useAuth();
  const { showToast } = useToast();

  const changePasswordMethods = useForm({
    resolver: yupResolver(ChangePasswordSchema)
  });

  const fieldRenderer = new FieldRenderer(
    changePasswordInputs,
    loanFormCommonStyleConstant,
    ChangePasswordSchema
  );

  const { handleSubmit, reset } = changePasswordMethods;
  const [isLoading, setIsLoading] = useState(false);

  const onChangePasswordSubmit: SubmitHandler<
    ChangePasswordFormValues
  > = async data => {
    try {
      setIsLoading(true);
      const resp = await changePassword({
        old_password: data.old_password,
        new_password: data.new_password
      });

      if (resp.status_code) {
        switch (resp.status_code) {
          case 200:
            showToast(resp.status_message, { type: NotificationType.Success });
            reset();
            closeModal();
            break;
          case 422:
          case 500:
          case 401:
            setChangePasswordApiError(resp.status_message);
            showToast(resp.status_message, { type: NotificationType.Error });
            break;
          default:
            break;
        }
      } else {
        setChangePasswordApiError(resp);
        showToast(resp, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(true);
    }
  };

  const onChangePasswordError: SubmitErrorHandler<
    ChangePasswordFormValues
  > = error => {
    console.log('error', error);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full px-4 lg:w-1/2">
        <div className="container mx-auto">
          <div className="flex justify-between rounded-sm border border-[#C5C5C5] bg-[#FFFFFF] p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-white">
                    <MdLockOutline size={24} color="blue" />
                  </div>
                </div>
              </div>
              <p className="px-4 font-medium text-[16x] max-sm:text-[10px]">
                {'Change Password'}
              </p>
            </div>
            <button
              className="flex items-center bg-[#1A439A] px-2.5 font-semibold text-white max-sm:text-[10px]"
              onClick={handleButtonClick}
            >
              <a className="max-sm:mb-[1px]">{'Change'}</a>
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FormProvider {...changePasswordMethods}>
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
            <div className="relative w-full max-w-md px-4 md:h-auto">
              <div className="relative bg-white p-6 shadow">
                <div className="flex items-center justify-end">
                  <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-[#1A439A]">
                    <MdLockOutline size={24} />
                  </div>
                  <p className="pl-4 text-[15px] font-medium">
                    {'Change Password'}
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
                    className="container"
                    onSubmit={handleSubmit(
                      onChangePasswordSubmit,
                      onChangePasswordError
                    )}
                  >
                    <div className="bg-[#FFFFFF] py-6">
                      <div className="grid gap-4">
                        {fieldRenderer.renderField(['old_password'])}
                        {changePasswordApiError && (
                          <span className="mb-2 block text-xs text-red-500 sm:mb-4 sm:text-sm">
                            {changePasswordApiError}
                          </span>
                        )}
                        {fieldRenderer.renderField(['new_password'])}

                        {fieldRenderer.renderField(['confirm_password'])}

                        {/* {changePasswordApiError && (
                          <span className="text-red-500 text-xs sm:text-sm mb-2 sm:mb-4 block">
                            {changePasswordApiError}
                          </span>
                        )} */}
                      </div>

                      <div className="flex justify-center pt-6">
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[16px] font-medium text-white hover:bg-blue-800"
                        >
                          {'SUBMIT'}
                          <IoIosArrowForward />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
      )}
    </>
  );
};

export default ProfileChangePassword;
