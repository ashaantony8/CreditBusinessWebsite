import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import closedEye from '../../assets/images/close-eye.png';
import openedEye from '../../assets/images/open-eye.png';
import useAuth from '../../utils/hooks/useAuth';
import { ChangePasswordSchema } from '../../utils/Schema';

interface ChangePasswordFormValues {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword: React.FC = () => {
  const [changePasswordApiError, setChangePasswordApiError] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword } = useAuth();

  const navigate = useNavigate();

  const changePasswordMethods = useForm({
    resolver: yupResolver(ChangePasswordSchema)
  });

  const {
    handleSubmit: handleChangePasswordSubmit,
    formState: { errors: changePasswordErrors },
    register: changePasswordRegister
  } = changePasswordMethods;

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onChangePasswordSubmit: SubmitHandler<
    ChangePasswordFormValues
  > = async data => {
    const resp = await changePassword({
      old_password: data.old_password,
      new_password: data.new_password
    });

    if (resp.status_code) {
      switch (resp.status_code) {
        case 200:
        case 201:
          navigate('/');
          break;
        case 422:
        case 500:
        case 401:
          setChangePasswordApiError(resp.status_message);
          break;
        default:
          break;
      }
    } else {
      setChangePasswordApiError(resp);
    }
  };

  const onChangePasswordError: SubmitErrorHandler<
    ChangePasswordFormValues
  > = error => {
    console.log('error', error);
  };

  return (
    <FormProvider {...changePasswordMethods}>
      <div className="flex min-h-screen items-center justify-center bg-opacity-50 bg-gradient-to-br from-blue-800 to-blue-500">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-lg bg-white p-4 shadow-md sm:p-8"
        >
          <h2 className="mb-4 text-center text-3xl font-semibold text-gray-800 sm:mb-6 sm:text-4xl">
            {'Change Password'}
          </h2>
          <form
            onSubmit={handleChangePasswordSubmit(
              onChangePasswordSubmit,
              onChangePasswordError
            )}
          >
            <div className="relative mb-4 sm:mb-6">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 sm:text-base"
              >
                {'Old Password'}
              </label>
              <input
                type={showOldPassword ? 'text' : 'password'}
                id="oldPassword"
                {...changePasswordRegister('old_password')}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                placeholder="Enter your old password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 transform focus:outline-none"
                onClick={toggleShowOldPassword}
              >
                {showOldPassword ? (
                  <img
                    src={openedEye}
                    alt="Show Password"
                    className="h-6 w-6 text-gray-500"
                  />
                ) : (
                  <img
                    src={closedEye}
                    alt="Hide Password"
                    className="h-6 w-6 text-gray-500"
                  />
                )}
              </button>
              {changePasswordErrors.old_password && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">
                  {changePasswordErrors.old_password.message}
                </span>
              )}
            </div>
            <div className="relative mb-4 sm:mb-6">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 sm:text-base"
              >
                {'New Password'}
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                {...changePasswordRegister('new_password', {
                  required: 'New Password is required'
                })}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 transform focus:outline-none"
                onClick={toggleShowNewPassword}
              >
                {showNewPassword ? (
                  <img
                    src={openedEye}
                    alt="Show Password"
                    className="h-6 w-6 text-gray-500"
                  />
                ) : (
                  <img
                    src={closedEye}
                    alt="Hide Password"
                    className="h-6 w-6 text-gray-500"
                  />
                )}
              </button>
              {changePasswordErrors.new_password && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">
                  {changePasswordErrors.new_password.message}
                </span>
              )}
            </div>
            <div className="relative mb-4 sm:mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 sm:text-base"
              >
                {'Confirm Password'}
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...changePasswordRegister('confirm_password', {
                  required: 'Confirm Password is required'
                })}
                className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 transform focus:outline-none"
                onClick={toggleShowConfirmPassword}
              >
                {showConfirmPassword ? (
                  <img
                    src={openedEye}
                    alt="Show Password"
                    className="h-6 w-6 text-gray-500"
                  />
                ) : (
                  <img
                    src={closedEye}
                    alt="Hide Password"
                    className="h-6 w-6 text-gray-500"
                  />
                )}
              </button>
              {changePasswordErrors.confirm_password && (
                <span className="mt-1 text-xs text-red-500 sm:text-sm">
                  {changePasswordErrors.confirm_password.message}
                </span>
              )}
            </div>
            {changePasswordApiError && (
              <span className="mb-2 block text-xs text-red-500 sm:mb-4 sm:text-sm">
                {changePasswordApiError}
              </span>
            )}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full rounded-md bg-blue-900 px-4 py-2 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-6 sm:py-3"
              >
                {'Change Password'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </FormProvider>
  );
};

export default ChangePassword;
