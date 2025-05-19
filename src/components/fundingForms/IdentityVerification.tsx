import React, { useEffect, useRef, useState } from 'react';
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CiMail } from 'react-icons/ci';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoCheckmark } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import { baseUrl } from '../../api/axios';
import {
  sendTrustIdGuestlinkApi,
  trustIdStatusApi
} from '../../api/loanServices';
import eye from '../../assets/svg/eye.svg';
import { authSelector } from '../../store/auth/userSlice';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import { loanFormCommonStyleConstant } from '../../utils/constants';
import { FundingFromCurrentStatus, Roles } from '../../utils/enums';
import { updateFilledForms } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
// import { useNavigate } from "react-router-dom";
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { LoanFromCommonProps, TrustIdStatusInterface } from '../../utils/types';
import Loader from '../Loader';
import FundingSuccessModal from './modals/FundingSuccessModal';

export const badgeClassesHead = [
  {
    name: 'false'
  },
  {
    name: 'true'
  }
];

const IdentityVerification: React.FC<LoanFromCommonProps> = ({
  setRef,
  loanId,
  fundingFormStatus
}) => {
  const { authenticated } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  if (setRef) {
    setRef(formRef);
  }
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const { role } = useSelector(authSelector);

  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isIdentityVerificationMailSend, setIsIdentityVerificationMailSend] =
    useState(false);
  const [kycStatus, setKycStatus] = useState(false);
  const [kycError, setKycError] = useState(null);

  const [trustIdStatus, setTrustIdStatus] = useState<
    Partial<TrustIdStatusInterface[]>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openKyc, setOpenKyc] = useState(false);

  const closeIdentityModal = () => {
    setIsIdentityModalOpen(false);
  };

  const handleButtonClick = async event => {
    setIsLoading(true);

    try {
      event.preventDefault();
      const response = await sendTrustIdGuestlinkApi(loanId);
      if (response.status_code >= 200 && response.status_code < 300) {
        // setIsIdentityModalOpen(true);
        setIsIdentityVerificationMailSend(response?.data[0].send_kyc_mail);
        setKycError(null);
        showToast(response.status_message, { type: NotificationType.Success });
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
    setIsLoading(false);
  };

  const fetchKycApi = async loanId => {
    try {
      const response = await trustIdStatusApi(loanId);

      if (response?.status_code === 200 && response.data.length > 0) {
        const data = response.data;
        setTrustIdStatus(data);
        const shouldSendMail = data.some(item => item.send_kyc_mail === false);
        const kycStatus = data.some(item => item.kyc_status === false);
        setIsIdentityVerificationMailSend(!shouldSendMail);
        setKycStatus(!kycStatus);
      }
      // else {
      //   showToast(response.status_message, { type: NotificationType.Error });
      // }
    } catch (error) {
      console.error('Exception', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (authenticated && loanId) {
      fetchKycApi(loanId);
    }
    setKycError(null);
  }, [isIdentityVerificationMailSend, loanId]);

  // const handleViewLinkClick = (link) => {
  //   if (link) {
  //     window.open(`https://credit.demoserver.work${link}`, "_blank");
  //   }
  // };

  const DirectorsList = () => {
    return (
      <div className="">
        <h2 className="mb-4 font-bold text-[#02002E]">
          {'KYC Status'}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {trustIdStatus.length > 0 ? (
            trustIdStatus?.map(kyc => (
              <div className="w-full">
                {kyc?.customer && (
                  <div className="mb-6 rounded-lg border border-gray-300 bg-white p-6 shadow-md">
                    {/* Header Section */}
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex flex-wrap items-center justify-between">
                        {/* Customer Name */}
                        <div className="flex items-center space-x-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold uppercase text-gray-700">
                            {kyc?.customer?.first_name?.[0]}
                            {kyc?.customer?.last_name?.[0]}
                          </div>
                          <div>
                            <p className="text-xl font-bold text-gray-800">
                              {`${kyc?.customer?.first_name} ${kyc?.customer?.last_name}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {kyc?.customer?.email}
                            </p>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-500">
                            {'KYC Status:'}
                          </span>
                          <span
                            className={`ml-2 rounded-full px-3 py-1 text-sm font-medium ${
                              kyc?.kyc_status
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {kyc?.kyc_status ? 'Completed' : 'Not Completed'}
                          </span>
                        </div>
                        {/* View Certificate */}
                        {![Roles.Customer, Roles.Leads].includes(
                          role as Roles
                        ) && (
                          <a
                            href={`${baseUrl}${kyc?.certificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:underline"
                          >
                            <img
                              src={eye}
                              alt="View Icon"
                              className="h-5 w-5"
                            />
                            <span>{'View Certificate'}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    {![Roles.Customer, Roles.Leads].includes(role as Roles) &&
                      kyc?.kyc_status && (
                        <div className="mt-6">
                          <h3 className="mb-3 text-lg font-semibold text-gray-800">
                            {'Verification Status'}
                          </h3>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                              {
                                label: 'Document Verification',
                                value: kyc?.document_Verification
                              },
                              {
                                label: 'Liveness Check',
                                value: kyc?.liveness_check
                              },
                              { label: 'Face Match', value: kyc?.face_match },
                              {
                                label: 'KYC/AML Check',
                                value: kyc?.kyc_aml_check
                              }
                            ].map((subStatus, idx) => (
                              <div
                                key={idx}
                                className={`rounded-lg px-4 py-3 text-center text-sm font-medium ${
                                  subStatus?.value === 'Passed' ||
                                  subStatus?.value === 'Live'
                                    ? 'bg-green-100 text-green-700'
                                    : subStatus?.value === 'Alert'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                }`}
                              >
                                <p className="font-semibold">
                                  {subStatus?.label}
                                </p>
                                <p>{subStatus?.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Contact Info Section */}
                    <div className="mt-6">
                      <h3 className="mb-3 text-lg font-semibold text-gray-800">
                        {'Contact Information'}
                      </h3>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">
                            {'Email Address'}
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {kyc?.customer?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {'Phone Number'}
                          </p>
                          <p className="text-sm font-medium text-gray-800">{`+44 ${kyc?.customer?.phone_number}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <>{'No data found'}</>
          )}
        </div>
      </div>
    );
  };
  const handleSubmit = async e => {
    setIsLoading(true);
    try {
      e.preventDefault();
      if (
        isIdentityVerificationMailSend ||
        (fundingFormStatus &&
          ![
            FundingFromCurrentStatus.Inprogress,
            FundingFromCurrentStatus.UnderwriterReturned
          ].includes(fundingFormStatus)) ||
        kycStatus
      ) {
        updateFilledForms(loanId, {
          identity_verified: true
        }); // update filled forms
        showToast('Identity Verification Updated successfully', {
          type: NotificationType.Success
        });
        setTimeout(() => {
          dispatch(updateCurrentStage(9));
        }, 1500);
        // setIsSubmitConfirmModal(true);
      } else {
        setKycError('please proceed with the kyc verification.');
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

  return (
    <>
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <form ref={formRef} className="mt-2 px-4" onSubmit={handleSubmit}>
        <div className="flex flex-col pb-8">
          <div
            className={`items-center rounded-lg border border-[#D4D4D4] px-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              kycError && 'w-[100%] border-b-2 border-red-500'
            }`}
          >
            <div
              className={`accordion-title flex h-[4rem] cursor-pointer items-center justify-between bg-white ${
                isIdentityVerificationMailSend ||
                (fundingFormStatus &&
                  ![
                    FundingFromCurrentStatus.Inprogress,
                    FundingFromCurrentStatus.UnderwriterReturned
                  ].includes(fundingFormStatus))
                  ? 'text-[#1A439A]'
                  : ''
              }`}
              onClick={() => setOpenKyc(prevProps => !prevProps)}
            >
              <div className="flex items-center justify-between">
                {isIdentityVerificationMailSend ||
                  (fundingFormStatus &&
                    ![
                      FundingFromCurrentStatus.Inprogress,
                      FundingFromCurrentStatus.UnderwriterReturned
                    ].includes(fundingFormStatus) && (
                      <span className="accordion-tick">
                        <IoCheckmark className="mx-2" />
                      </span>
                    ))}
                <span className="flex items-center gap-x-2 max-sm:text-[12px]">
                  {' '}
                  <CiMail className="mt-[1px] h-5 w-5" />{' '}
                  {'Identity Verification'}
                  {'send to email'}
                </span>
              </div>

              {fundingFormStatus &&
                ([
                  FundingFromCurrentStatus.Inprogress,
                  FundingFromCurrentStatus.UnderwriterReturned
                ].includes(fundingFormStatus) ? (
                  <span>
                    <button
                      type="button"
                      className="cursor-pointer bg-white text-[14px] font-semibold uppercase text-[#1A439A] max-sm:text-[10px]"
                      onClick={handleButtonClick}
                    >
                      {kycStatus || isIdentityVerificationMailSend
                        ? 'RESEND'
                        : 'SEND'}
                    </button>
                  </span>
                ) : (
                  <span className="accordion-arrow">
                    {openKyc ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                ))}
            </div>
          </div>
          {kycError && (
            <p className={loanFormCommonStyleConstant.text.errorClass}>
              {kycError}
            </p>
          )}
        </div>

        {(openKyc ||
          (fundingFormStatus &&
            [
              FundingFromCurrentStatus.Inprogress,
              FundingFromCurrentStatus.UnderwriterReturned
            ].includes(fundingFormStatus))) && <DirectorsList />}
      </form>

      <FundingSuccessModal
        isOpen={isIdentityModalOpen}
        onClose={closeIdentityModal}
        head="Identity Verification send!"
        content={`
    Identity Verification Email send to your email id please check!.`}
      />
    </>
  );
};

export default IdentityVerification;
