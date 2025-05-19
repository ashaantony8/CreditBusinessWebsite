import { yupResolver } from '@hookform/resolvers/yup';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { Dispatch } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  personalInformationGetAPI,
  personalInformationPostAPI
} from '../../api/loanServices';
import { resendOtpAPI, signUpAPI } from '../../api/userAuthServices';
import eye from '../../assets/svg/eye.svg';
import quest from '../../assets/svg/ph_question.svg';
import otps from '../../assets/svg/teenyicons_otp-outline.svg';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import {
  loanFormSliceSelector,
  updateBusinessDetails,
  updateIsSendOtp,
  updatePersonalInformation
} from '../../store/loanFormReducer';
import {
  declarationCheckboxStyle,
  loanFormCommonStyleConstant,
  loanFormPersonalInformation
} from '../../utils/constants';
import { ModeOfApplication } from '../../utils/enums';
import {
  chkCustNewLoan,
  fetchFilledForms,
  lookUpAddressFormatter,
  updateFilledForms
} from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { PersonalInformationSchema } from '../../utils/Schema';
import {
  LoanData,
  LoanFromCommonProps,
  personalInformationType
} from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';
import AddressLookup from './AddressLookup';
import NotEligibleModal from './modals/NotEligibleModal';

interface PersonalInformationProps extends LoanFromCommonProps {
  setLoan?: Dispatch<SetStateAction<Partial<LoanData>>>;
  setIsRepAssigned?: Dispatch<SetStateAction<Partial<boolean>>>;
  isRepAssigned?: boolean;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  setRef,
  loanId,
  setLoan,
  setIsRepAssigned
}) => {
  const [isEligibleNewLoan, setIsEligibleNewLoan] = useState<{
    isApplicableForNewLoan: boolean;
    loanCount: number;
  }>(null);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const eligibility = await chkCustNewLoan();
        setIsEligibleNewLoan(eligibility);
      } catch (error) {
        console.error('Failed to check eligibility:', error);
        setIsEligibleNewLoan(null); // or handle error state
      }
    };

    checkEligibility();
  }, []);

  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);
  const { isSendOtp } = useSelector(loanFormSliceSelector);
  const fieldRenderer = new FieldRenderer(
    loanFormPersonalInformation,
    loanFormCommonStyleConstant,
    PersonalInformationSchema
  );

  const [otpError, setOtpError] = useState(null);
  const [otp, setOtp] = useState(null);
  const [otpVerifyError, setOtpVerifyError] = useState(null);
  const [address, setAddress] = useState(undefined);
  const [personalInfo, setPersonalInfo] = useState<
    Partial<personalInformationType>
  >({});
  const [timeLeft, setTimeLeft] = useState(undefined);
  const timerDuration = 90; //10sec
  const [isLoading, setIsLoading] = useState(false);
  const [notEligibleModalOpen, setNotEligibleModalOpen] =
    useState<boolean>(false);
  const [isAssignedAgent, setIsAssignedAgent] = useState(false);
  const [isRepAssignedRemind, setIsRepAssignedRemind] = useState(false);

  const methods = useForm({
    resolver: yupResolver(PersonalInformationSchema),
    defaultValues: personalInfo
  });
  const { handleSubmit, watch, setValue, formState, trigger, reset } = methods;

  const { verifyOtp, authenticated } = useAuth();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    if (timeLeft) {
      const timer = setInterval(() => {
        if (timeLeft === 0) {
          clearInterval(timer);
        } else {
          setTimeLeft(timeLeft - 1);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const fetchDataFromApi = async (loanId: string) => {
    try {
      const PersonalInfoApiResponse = await personalInformationGetAPI(loanId);
      if (PersonalInfoApiResponse?.status_code === 200) {
        setPersonalInfo(PersonalInfoApiResponse.data);
      } else {
        showToast(PersonalInfoApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (authenticated && loanId) {
      fetchDataFromApi(loanId);
    }
  }, [loanId]);

  useEffect(() => {
    if (Object.keys(personalInfo).length > 0) {
      if (!otp) {
        reset(personalInfo);
      }
    }
  }, [personalInfo]);

  useEffect(() => {
    if (address) {
      const lookedUpData = lookUpAddressFormatter(address);
      setValue('pincode', lookedUpData.pincode);
      setValue('address', lookedUpData.addressText);
      trigger('address');
    }
  }, [address]);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<personalInformationType> = async data => {
    setIsLoading(true);
    try {
      if (
        data.company.business_type === 'Limited Company' &&
        data.company.company_status === 'Dissolved'
      ) {
        setNotEligibleModalOpen(true);
      } else {
        if (data.representatives === '') {
          delete data.representatives;
        }
        if (data.mode_of_application === 'Self') {
          delete data.representatives;
          delete data.agree_authorization;
          delete data.is_pending_threatened_or_recently;
        }
        if (data.company.funding_purpose !== 'Other (please specify)') {
          delete data.company.other_funding_purpose;
        }
        const personalInformationPostAPIResponse =
          await personalInformationPostAPI(data, loanId);
        if (
          personalInformationPostAPIResponse.status_code >= 200 &&
          personalInformationPostAPIResponse.status_code < 300
        ) {
          showToast(personalInformationPostAPIResponse.status_message, {
            type: NotificationType.Success
          });
          const filledForms = await fetchFilledForms(loanId);
          updateFilledForms(loanId, {
            complete_personal_detail: true
          }); // update filled forms
          setTimeout(async () => {
            if (
              data.mode_of_application === ModeOfApplication.Representative &&
              filledForms === 0
            ) {
              setIsRepAssignedRemind(true);
            } else {
              dispatch(updateCurrentStage(2));
            }
          }, 1500);
        } else {
          showToast(personalInformationPostAPIResponse.status_message, {
            type: NotificationType.Error
          });
        }
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Reset loading state when done submitting
      }, 1500);
    }
  };

  const onError: SubmitErrorHandler<personalInformationType> = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
  };

  // const watchFundRequest = watch("fund_request_amount", 0);
  // const watchDuration = watch("fund_request_duration_weeks", 0);
  const watchPhoneNumber = watch('phone_number', '');
  const watchEmail = watch('email', '');
  const watchPinCode = watch('pincode', personalInfo?.pincode || '');

  // const { rePaymentAmount, weeklyInstallments } = useCalculator(watchFundRequest, watchDuration);

  useEffect(() => {
    setOtpError(null);
    if (watchPhoneNumber) {
      dispatch(updateIsSendOtp(false));
    }
    if (otpError) {
      setOtpError(null);
    }
  }, [watchPhoneNumber, watchEmail]);

  const handleOtp = async () => {
    trigger('phone_number');
    trigger('email');

    setTimeout(async () => {
      if (
        !Object.keys(formState.errors).includes('email') &&
        !Object.keys(formState.errors).includes('phone_number') &&
        watchPhoneNumber &&
        watchEmail
      ) {
        setIsLoading(true);
        setTimeLeft(timerDuration);
        const resp = await signUpAPI({
          phone_number: watchPhoneNumber,
          email: watchEmail
        });

        if (resp.status_code >= 200 && resp.status_code < 300) {
          showToast(resp.status_message, { type: NotificationType.Success });
          dispatch(updateIsSendOtp(true));
          dispatch(
            updatePersonalInformation({
              email: watchEmail,
              phone_number: watchPhoneNumber
            })
          );
        } else {
          showToast(resp.status_message, { type: NotificationType.Error });
        }
        setIsLoading(false);
      }
    }, 10);
  };

  const handleVerifyClick = async () => {
    try {
      if (otp) {
        setIsLoading(true);
        const resp = await verifyOtp({
          phone_number: watchPhoneNumber,
          otp: otp
        });

        if (resp.status_code >= 200 && resp.status_code < 300) {
          dispatch(updateIsSendOtp(false));
          showToast(resp.status_message, { type: NotificationType.Success });
          setLoan(resp?.loan);
          setValue('is_otp_verified', true);
          dispatch(
            updatePersonalInformation({
              email: watchEmail,
              phone_number: watchPhoneNumber,
              is_otp_verified: true
            })
          );
        } else {
          showToast(resp.status_message, { type: NotificationType.Error });
        }
      } else {
        setOtpVerifyError("verify otp can't be empty ");
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (
      !Object.keys(formState.errors).includes('email') &&
      !Object.keys(formState.errors).includes('phone_number') &&
      watchPhoneNumber &&
      watchEmail
    ) {
      setIsLoading(true);
      setTimeLeft(timerDuration);

      const resp = await resendOtpAPI({
        phone_number: watchPhoneNumber
      });

      switch (resp.status_code) {
        case 200:
        case 201:
          dispatch(updateIsSendOtp(true));
          showToast(resp.status_message, { type: NotificationType.Success });
          break;
        case 422:
          showToast(resp.status_message, { type: NotificationType.Error });
          // setOtpError(resp.status_message);
          break;
        default:
          break;
      }
      setIsLoading(false);
    }
  };

  const closeConfirmModal = () => {
    setNotEligibleModalOpen(false);
  };

  const { businessDetails } = useSelector(loanFormSliceSelector);

  const watchModeOfApplication = watch(
    'mode_of_application',
    personalInfo.mode_of_application || undefined
  );
  const watchFundingPurpose = watch('company.funding_purpose', undefined);
  const watchBusinessType = watch(
    'company.business_type',
    personalInfo?.company?.business_type
  );

  // const watchCompany_Status = watch(
  //   "company.company_status",
  //   personalInfo?.company?.company_status || undefined
  // );

  useEffect(() => {
    if (
      personalInfo?.company?.business_type &&
      watchBusinessType !== personalInfo?.company?.business_type
    ) {
      setValue('company.company_name', '');
      setValue('company.company_status', '');
      setValue('company.company_number', '');
    }
    if (watchBusinessType === 'Sole Trader') {
      dispatch(
        updateBusinessDetails(
          businessDetails ? { ...businessDetails, directors: [] } : {}
        )
      );
    }
  }, [watchBusinessType]);
  const [companyName, setCompanyName] = useState(undefined);
  useEffect(() => {
    if (companyName) {
      const lookedUpData = lookUpAddressFormatter(companyName);
      setValue('company.company_name', lookedUpData.Company_Name);
      trigger('company.company_name');
    }
  }, [companyName]);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (setIsRepAssigned) {
      setIsRepAssigned(
        watchModeOfApplication === ModeOfApplication.Representative
      );
    }
    if (
      personalInfo.mode_of_application !== watchModeOfApplication &&
      watchModeOfApplication === ModeOfApplication.Representative
    ) {
      setIsAssignedAgent(true);
    } else {
      setIsAssignedAgent(false);
    }
  }, [watchModeOfApplication]);

  return (
    <FormProvider {...methods}>
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <form ref={formRef} onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="">
          <div className="space-y-6 p-6">
            <>
              <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-2 max-sm:col-span-6">
                    <div className="relative">
                      {fieldRenderer.renderField(['title'])}
                    </div>
                  </div>
                  <div className="col-span-4 max-sm:col-span-6">
                    <div className="relative">
                      {fieldRenderer.renderField(['first_name'])}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  {fieldRenderer.renderField(['last_name'])}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-6 xl:gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(
                      ['email'],
                      personalInfo.is_otp_verified || authenticated
                        ? { type: 'email', isDisabled: false }
                        : {}
                    )}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['is_major'])}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
                <div className="grid grid-cols-6">
                  <div
                    className={
                      isEligibleNewLoan?.loanCount ? 'col-span-6' : 'col-span-5'
                    }
                  >
                    {fieldRenderer.renderField(
                      ['phone_number'],
                      personalInfo.is_otp_verified || authenticated
                        ? isEligibleNewLoan?.loanCount
                          ? {
                              type: 'tel',
                              isDisabled: false,
                              fieldClass: `peer bg-transparent h-12 w-full rounded-lg 
                                      text-black  placeholder-transparent  px-8 
                                      focus:outline-none focus:border-gray-500 border border-stone-300`
                            }
                          : {
                              type: 'tel',
                              isDisabled: false,
                              fieldClass: `peer bg-transparent h-12 w-full rounded-l-lg 
                                      text-black  placeholder-transparent  px-8 
                                      focus:outline-none focus:border-gray-500 border border-stone-300`
                            }
                        : {
                            fieldClass: `peer bg-transparent h-12 w-full rounded-l-lg 
                                      text-black  placeholder-transparent  px-8 
                                      focus:outline-none focus:border-gray-500 border border-stone-300`
                          }
                    )}
                    <p className="text-[10px] text-red-500">
                      {otpError && otpError}
                    </p>
                  </div>
                  {!isEligibleNewLoan && (
                    <div className="col-span-1">
                      {/* <div
                      className={`h-[48px] text-center  py-3 rounded-r-lg $   ${
                        personalInfo?.is_otp_verified || authenticated
                          ? " cursor-not-allowed bg-[#D1D9EB]"
                          : "cursor-pointer bg-[#1A439A]"
                      }`}
                    > */}
                      {isSendOtp ? (
                        timeLeft && timeLeft >= 0 ? (
                          <div
                            className={`$ h-[48px] rounded-r-lg py-3 text-center ${
                              personalInfo?.is_otp_verified || authenticated
                                ? 'cursor-not-allowed bg-[#D1D9EB]'
                                : 'cursor-pointer bg-[#1A439A]'
                            }`}
                          >
                            <a className="px-2 text-[12px] text-white">
                              {personalInfo.is_otp_verified
                                ? ''
                                : formatTime(timeLeft)}
                            </a>
                          </div>
                        ) : (
                          <div
                            className={`$ h-[48px] rounded-r-lg py-3 text-center ${
                              personalInfo?.is_otp_verified || authenticated
                                ? 'cursor-not-allowed bg-[#D1D9EB]'
                                : 'cursor-pointer bg-[#1A439A]'
                            }`}
                            onClick={handleResendOtp}
                          >
                            <button
                              type="button"
                              className="cursor-pointer text-[12px] uppercase text-white"
                              disabled={
                                personalInfo.is_otp_verified || authenticated
                              }
                            >
                              {'resend'}
                            </button>
                          </div>
                        )
                      ) : (
                        <div
                          className={`$ h-[48px] rounded-r-lg py-3 text-center ${
                            personalInfo?.is_otp_verified || authenticated
                              ? 'cursor-not-allowed bg-[#D1D9EB]'
                              : 'cursor-pointer bg-[#1A439A]'
                          }`}
                          onClick={handleOtp}
                        >
                          <button
                            type="button"
                            className={`px-2 ${
                              personalInfo.is_otp_verified || authenticated
                                ? 'cursor-not-allowed text-[##1A439A]'
                                : 'cursor-pointer text-white'
                            } text-[12px] uppercase`}
                            disabled={
                              personalInfo.is_otp_verified || authenticated
                            }
                          >
                            {'send'}
                          </button>
                        </div>
                      )}
                      {/* </div> */}
                    </div>
                  )}
                </div>

                {!isEligibleNewLoan && (
                  <div className="grid grid-cols-6">
                    <div className="col-span-5 rounded-lg bg-white">
                      <div className="relative bg-inherit">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder=" "
                          className={`peer h-12 w-full rounded-l-lg border border-stone-300 bg-transparent px-8 text-black placeholder-transparent focus:border-gray-500 focus:outline-none ${
                            otpVerifyError && 'border-2 border-red-500'
                          }`}
                          disabled={personalInfo.is_otp_verified || !isSendOtp}
                          onChange={e => {
                            setOtpVerifyError(null);
                            setOtp(e.target.value);
                          }}
                        />
                        <span
                          className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <div className="w-6 pr-2 text-gray-400">
                              <img src={eye} />
                            </div>
                          ) : (
                            <div className="w-6 pr-2 text-gray-400"></div>
                          )}
                        </span>
                        <div className="pointer-events-none absolute left-2 top-7 h-4 w-4 -translate-y-1/2 transform text-gray-500">
                          <div className="w-6 pr-2 text-gray-400">
                            <img src={otps} />
                          </div>
                        </div>

                        <label className="absolute -top-3 start-8 mx-1 mt-1 cursor-text bg-inherit px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600">
                          {'OTP'}
                          <span className="text-red-500">{' *'}</span>
                        </label>
                      </div>
                      <p className="text-[10px] text-red-500">
                        {otpVerifyError && otpVerifyError}
                      </p>
                    </div>
                    <div className="">
                      {personalInfo.is_otp_verified || authenticated ? (
                        <div
                          className={`$ h-[48px] rounded-r-lg py-3 text-center ${
                            personalInfo.is_otp_verified || authenticated
                              ? 'cursor-not-allowed bg-[#1A439A]'
                              : `cursor-pointer bg-[#D1D9EB] ${
                                  isSendOtp ? 'bg-[#D1D9EB]' : 'bg-[#1A439A]'
                                }`
                          }`}
                        >
                          <span className=" ">
                            <button
                              type="button"
                              className={`text-[11px] uppercase ${
                                personalInfo.is_otp_verified || authenticated
                                  ? 'cursor-not-allowed text-white'
                                  : 'cursor-pointer text-[#1A439A]'
                              }`}
                            >
                              {'VERIFIED'}
                            </button>
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`$ h-[48px] rounded-r-lg py-3 text-center ${
                            personalInfo.is_otp_verified || authenticated
                              ? 'cursor-not-allowed bg-[#1A439A]'
                              : `cursor-pointer bg-[#D1D9EB] ${
                                  isSendOtp ? 'bg-[#D1D9EB]' : 'bg-[#1A439A]'
                                }`
                          }`}
                          onClick={handleVerifyClick}
                        >
                          <span className=" ">
                            <button
                              type="button"
                              className={`px-2 text-[11px] ${
                                !isSendOtp
                                  ? 'cursor-not-allowed text-white'
                                  : 'cursor-pointer text-[#1A439A]'
                              } text-[9.5px] uppercase`}
                              disabled={!isSendOtp}
                            >
                              {'VERIFY'}
                            </button>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-6 xl:gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    <AddressLookup
                      setAddress={setAddress}
                      value={watchPinCode || ''}
                      methods={methods}
                      pincodeKey="pincode"
                      error={formState.errors['pincode']}
                    />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['address'])}
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-6 xl:gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['fund_request_amount'])}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['fund_request_duration_weeks'])}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-6 xl:gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['repayment_day_of_week'])}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['company.business_type'])}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-6 xl:gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {watchBusinessType === 'Limited Company' ? (
                      <AddressLookup
                        setAddress={setCompanyName}
                        value={watch(
                          'company.company_name',
                          personalInfo?.company?.company_name
                        )}
                        methods={methods}
                        pincodeKey="company.company_name"
                        error={formState.errors['company.company_name']}
                        isCompanyLookup={true}
                      />
                    ) : (
                      fieldRenderer.renderField(['company.company_name'])
                    )}
                  </div>
                </div>
                {watchBusinessType === 'Limited Company' && (
                  <div className="col-span-6 sm:col-span-3">
                    <div className="relative">
                      {fieldRenderer.renderField(['company.company_number'], {
                        isDisabled: watchBusinessType === 'Limited Company'
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-6 xl:gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['company.trading_style'])}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <div className="relative">
                    {fieldRenderer.renderField(['company.funding_purpose'])}
                  </div>
                </div>
              </div>
            </>
            <div className="">
              {watchFundingPurpose === 'Other (please specify)' &&
                fieldRenderer.renderField('company.other_funding_purpose')}
            </div>
            <div> {fieldRenderer.renderField('mode_of_application')}</div>

            <div className="col-span-full block w-full rounded-lg border border-[#1A439A] bg-[#F3F5FA] p-4 text-[12px] text-[#1A439A]">
              {watchModeOfApplication === ModeOfApplication.Representative && (
                <div className="mb-8 px-2">
                  <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    <div className="flex items-center border-b-2">
                      <div className="w-5 pr-2 text-gray-400">
                        <img src={quest} />
                      </div>{' '}
                      <a className="text-[14px] text-[#929292]">
                        {'Enter The representatives id'}
                      </a>
                    </div>
                    <div className="bg-[#F3F5FA]">
                      {' '}
                      {fieldRenderer.renderField(['representatives'])}{' '}
                    </div>{' '}
                  </div>

                  {fieldRenderer.renderField(
                    [
                      'agree_authorization',
                      'is_pending_threatened_or_recently'
                    ],
                    { ...declarationCheckboxStyle }
                  )}
                </div>
              )}
              <div className="px-2">
                {fieldRenderer.renderField(
                  [
                    'agree_terms_and_conditions',
                    'agree_communication_authorization'
                  ],
                  { ...declarationCheckboxStyle }
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
      <NotEligibleModal
        isOpen={notEligibleModalOpen}
        onClose={closeConfirmModal}
        head="Sorry, you are not eligible for this funding submission!"
        content="Unfortunately, you do not meet the eligibility criteria for this funding submission."
      />

      <NotEligibleModal
        isOpen={isAssignedAgent}
        onClose={() => {
          setIsAssignedAgent(false);
        }}
        head="Notice"
        content="Once assigned to an agent, you can no longer continue with the application. Only the agent has the ability to fill out the form."
      />

      <NotEligibleModal
        isOpen={isRepAssignedRemind}
        onClose={() => {
          setIsRepAssignedRemind(false);
          navigate(`/`);
        }}
        head="Redirecting to Home"
        content="You have been assigned to an agent and can no longer continue with the application. Only the agent has the ability to fill out the form."
      />
    </FormProvider>
  );
};

export default PersonalInformation;
