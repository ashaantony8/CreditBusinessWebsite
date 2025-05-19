import { useEffect, useState } from 'react';
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { CiMail } from 'react-icons/ci';
import { IoCheckmark } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import { baseUrl } from '../../../api/axios';
import {
  userSendTrustIdGuestlinkApi,
  userTrustIdStatusApi
} from '../../../api/loanServices';
import eye from '../../../assets/svg/eye.svg';
import { authSelector } from '../../../store/auth/userSlice';
import { managementSliceSelector } from '../../../store/managementReducer';
import { loanFormCommonStyleConstant } from '../../../utils/constants';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
// import { useNavigate } from "react-router-dom";
import useToast from '../../../utils/hooks/toastify/useToast';
import { TrustIdStatusInterface } from '../../../utils/types';
import FundingSuccessModal from '../../fundingForms/modals/FundingSuccessModal';
import Loader from '../../Loader';
import Header from '../common/Header';

export const badgeClassesHead = [
  {
    name: 'false'
  },
  {
    name: 'true'
  }
];

const CustomerIdentityVerification: React.FC<{ leadId?: string }> = ({
  leadId
}) => {
  const { role } = useSelector(authSelector);
  const customerUser = useSelector(authSelector);
  const managementUser = useSelector(managementSliceSelector).user;

  const user = [Roles.Customer, Roles.Leads].includes(role as Roles)
    ? customerUser
    : managementUser;

  const customerId = leadId || user?.id;
  const { showToast } = useToast();

  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isIdentityVerificationMailSend, setIsIdentityVerificationMailSend] =
    useState(false);
  const [kycError, setKycError] = useState(null);

  const [trustIdStatus, setTrustIdStatus] = useState<
    Partial<TrustIdStatusInterface>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [openKyc, setOpenKyc] = useState(false);

  // const navigate = useNavigate();

  const closeIdentityModal = () => {
    setIsIdentityModalOpen(false);
  };

  const handleButtonClick = async event => {
    setIsLoading(true);

    try {
      event.preventDefault();
      const response = await userSendTrustIdGuestlinkApi(customerId);
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

  const fetchKycApi = async () => {
    try {
      const trustIdStatusApiResponse = await userTrustIdStatusApi(customerId);
      if (trustIdStatusApiResponse?.data.length === 0) {
        return;
      } else if (
        trustIdStatusApiResponse.status_code >= 200 &&
        trustIdStatusApiResponse.status_code < 300
      ) {
        if (Array.isArray(trustIdStatusApiResponse.data)) {
          setTrustIdStatus(trustIdStatusApiResponse?.data?.[0]);
          setIsIdentityVerificationMailSend(
            trustIdStatusApiResponse?.data?.[0]?.send_kyc_mail
          );
        }
      } else {
        showToast(trustIdStatusApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    fetchKycApi();
  }, [isIdentityVerificationMailSend]);

  const handleViewLinkClick = link => {
    if (link) {
      window.open(`${baseUrl}${link}`, '_blank');
    }
  };

  const KycDetails = () => {
    return (
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold">{'Directors KYC Status'}</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="w-full">
            <div className="mb-2 border border-solid border-gray-300 p-2">
              <div className="flex justify-between border-b border-gray-300">
                {' '}
                <div className="text-gray-800">
                  <div className="flex flex-col md:flex-row md:space-x-2 md:space-y-0">
                    {/* <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        alt=""
                        className="self-center flex-shrink-0 h-12 w-12 border rounded-full md:justify-self-start bg-gray-500 border-gray-300 mb-3"
                      /> */}
                    <div className="flex flex-col">
                      <p className="text-center text-[14px] font-semibold md:text-left">
                        {`${trustIdStatus?.customer?.first_name} ${trustIdStatus?.customer?.last_name}`}
                      </p>
                      {/* <p className="text-gray-600 text-[10px] my-1">
                          {`+44 ${trustIdStatus?.director.phone_number}`}
                        </p> */}
                    </div>
                  </div>
                </div>
                <div>
                  <a className="mr-1 text-[12px]">{'KYC Status :'}</a>
                  <div
                    key={`${trustIdStatus?.kyc_status}`}
                    className={`mb-12 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-2 max-sm:px-2 ${
                      trustIdStatus?.kyc_status
                        ? 'bg-[#C7F2D4] text-[#22CB53]'
                        : 'bg-[#C7F2D4] text-[#22CB53]'
                    } }`}
                  >
                    {trustIdStatus?.kyc_status ? 'Completed' : 'Not Completed'}
                  </div>
                </div>
                <div className="flex items-center bg-white p-4">
                  {![Roles.Leads, Roles.Customer].includes(role as Roles) && (
                    <div className="flex max-sm:grid">
                      <p
                        className="flex pr-4 text-[12px] font-medium text-[#1A439A]"
                        onClick={() =>
                          handleViewLinkClick(trustIdStatus?.certificate)
                        }
                      >
                        <img src={eye} className="px-2" /> {'VIEW'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
                  <div className="text-[#929292]">{'Email Address'}</div>
                  <div className="pt-2 font-medium">
                    {trustIdStatus?.customer?.email}
                  </div>
                </div>

                {/* <div className="col-span-1 sm:col-span-1  p-4 text-[13px]">
                    <div className="text-[#929292]">Company Name</div>
                    <div className=" font-medium pt-2">LOtrem ipsum</div>
                  </div> */}

                <div className="col-span-1 p-4 text-[13px] sm:col-span-1">
                  <div className="text-[#929292]">{'Phone Number'}</div>
                  <div className="pt-2 font-medium">{`+44 ${trustIdStatus?.customer?.phone_number}`}</div>
                </div>
                {/*   
                  <div className="col-span-1 sm:col-span-1  p-4 text-[13px]">
                    <div className="text-[#929292]">Location</div>
                    <div className=" font-medium pt-2">6651 Lakeshore Rd</div>
                  </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-2 px-4">
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <Header
          title="Identity Verification"
          // onFilterChange={handleFilterChange}
          // dropdownData={dropdownData}
          // initialFilters={initialFilters}
          // onSearch={handleSearch}
          // onAdd={handleAdd}
        />
        <div className="flex flex-col pb-8 max-sm:mt-8">
          <div
            className={`items-center rounded-lg border border-[#D4D4D4] px-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              kycError && 'w-[100%] border-b-2 border-red-500'
            }`}
          >
            <div
              className={`accordion-title flex h-[4rem] cursor-pointer items-center justify-between bg-white ${
                isIdentityVerificationMailSend ? 'text-[#1A439A]' : ''
              }`}
              onClick={() => setOpenKyc(prevProps => !prevProps)}
            >
              <div className="flex items-center justify-between">
                {isIdentityVerificationMailSend && (
                  <span className="accordion-tick">
                    <IoCheckmark className="mx-2" />
                  </span>
                )}
                <span className="flex items-center gap-x-2 max-sm:text-[12px]">
                  {' '}
                  <CiMail className="mt-[1px] h-5 w-5" />{' '}
                  {'Identity Verification'}
                  {'send to email'}
                </span>
              </div>
              {/* {isIdentityVerificationMailSend ? (
                <span className="accordion-arrow  ">
                  {openKyc ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
              ) : ( */}
              <span>
                <button
                  type="button"
                  className="cursor-pointer bg-white text-[14px] font-semibold uppercase text-[#1A439A] max-sm:text-[10px]"
                  onClick={handleButtonClick}
                >
                  {!trustIdStatus?.[0]?.kyc_status &&
                    (isIdentityVerificationMailSend ? 'RESEND' : 'SEND')}
                </button>
              </span>
              {/* )} */}
            </div>
          </div>
          {kycError && (
            <p className={loanFormCommonStyleConstant.text.errorClass}>
              {kycError}
            </p>
          )}
        </div>

        {Object.keys(trustIdStatus).length > 0 && openKyc && <KycDetails />}
      </div>
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

export default CustomerIdentityVerification;
