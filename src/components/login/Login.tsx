import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { MdOutlineHome } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { authSelector } from '../../store/auth/userSlice';
import { loanFormCommonStyleConstant, loginForm } from '../../utils/constants';
import { Roles } from '../../utils/enums';
import useAuth from '../../utils/hooks/useAuth';
import { LoginSchema } from '../../utils/Schema';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';
import ForgotPassword from './ForgotPassword';
import FormTestinomial from './FormTestinomial';

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = ({ backHandler }: { backHandler?: () => void }) => {
  const { role } = useSelector(authSelector);
  const [loginApiError, setLoginApiError] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { signIn } = useAuth();

  const fieldRenderer = new FieldRenderer(
    loginForm,
    loanFormCommonStyleConstant,
    LoginSchema
  );

  const loginMethods = useForm({
    resolver: yupResolver(LoginSchema)
  });

  const { handleSubmit: handleLoginSubmit, watch } = loginMethods;

  const watchUsername = watch('username', null);
  const watchPassword = watch('password', null);

  useEffect(() => {
    setLoginApiError(null);
  }, [watchUsername, watchPassword]);

  const onLoginSubmit: SubmitHandler<LoginFormValues> = async data => {
    try {
      setIsLoading(true);
      const resp = await signIn({
        username: data.username,
        password: data.password
      });

      if (resp.status_code) {
        switch (resp.status_code) {
          case 200:
          case 201:
            if (
              [
                Roles.FieldAgent,
                Roles.Manager,
                Roles.Admin,
                Roles.UnderWriter,
                Roles.FinanceManager
              ].includes(role as Roles)
            ) {
              navigate('/dashboard');
            } else {
              navigate('/');
            }
            break;
          case 422:
          case 500:
          case 401:
            setLoginApiError(resp.status_message);
            break;
          default:
            break;
        }
      } else {
        setLoginApiError(resp);
      }
    } catch (error) {
      setLoginApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginError: SubmitErrorHandler<LoginFormValues> = error => {
    console.log('error', error);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="bg-cover">
        <div className="grid grid-cols-2 max-sm:grid-cols-1">
          <div className="">
            <FormTestinomial />
          </div>
          <div className="place-self-center max-sm:mt-20">
            <NavLink to="/" className="absolute right-4 top-4">
              <div
                className={`rounded-lg border border-[#1A439A] p-1 text-[#1A439A] ${
                  !backHandler && ''
                }`}
              >
                <span className="flex gap-1">
                  <MdOutlineHome size={20} />{' '}
                  <a className="text-[13px] font-semibold uppercase max-lg:hidden max-sm:hidden">
                    {'Home'}
                  </a>
                </span>
              </div>
            </NavLink>

            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-white p-4 sm:p-8"
            >
              <p className="mb-4 flex text-center text-[24px] text-[#02002E] sm:text-4xl">
                {showLoginForm ? 'Sign in Your Account' : 'Forgot Password?'}
                {/* <NavLink
                to="/"
                className="flex items-center py-2 px-1 md:mr-auto mx-auto md:mx-0 "
              >
                <div
                  className={`px-2 p-1 rounded-lg  font-medium flex gap-2 bg-[#DDE3F0] " text-[#1A439A] ${
                    !backHandler && "ml-12"
                  }`}
                >
                  <MdHomeFilled size={22} />
                </div>
              </NavLink> */}
              </p>
              {showLoginForm ? (
                <FormProvider {...loginMethods}>
                  <form
                    onSubmit={handleLoginSubmit(onLoginSubmit, onLoginError)}
                    className="h-[355px]"
                  >
                    <div className="mb-8">
                      <div className="mb-8 pt-6">
                        {' '}
                        {fieldRenderer.renderField(['username'])}
                      </div>

                      <div className="mb-8 pb-6">
                        {' '}
                        {fieldRenderer.renderField(['password'])}
                      </div>

                      {loginApiError && (
                        <span className="block text-[10px] text-red-500">
                          {loginApiError}
                        </span>
                      )}
                      <div className="mb-4 mt-8 flex items-center justify-between sm:mb-6">
                        {fieldRenderer.renderField(['remember_me'])}
                        <button
                          type="button"
                          onClick={() => setShowLoginForm(false)}
                          className="text-xs text-[#1A449A] sm:text-[12px]"
                        >
                          {'Forgot Password?'}
                        </button>
                      </div>
                      <div className="mt-12 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="w-full bg-[#1A449A] px-4 py-2 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-6 sm:py-3"
                        >
                          {'Sign In'}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              ) : (
                <ForgotPassword setShowLoginForm={setShowLoginForm} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
