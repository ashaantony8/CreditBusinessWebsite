import { useEffect, useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoCheckmark } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import {
  getContractApi,
  reSendContractEmailApi,
  sendContractEmailApi
} from '../../api/loanServices';
import eye from '../../assets/svg/eye.svg';
import { authSelector } from '../../store/auth/userSlice';
import { updateIsContractSend } from '../../store/fundingStateReducer';
import { managementSliceSelector } from '../../store/managementReducer';
import { loanFormCommonStyleConstant } from '../../utils/constants';
import {
  contractStatus,
  FundingFromCurrentStatus,
  Roles
} from '../../utils/enums';
import { updateFilledForms } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
// import { useNavigate } from "react-router-dom";
import useToast from '../../utils/hooks/toastify/useToast';
import { LoanFromCommonProps } from '../../utils/types';
import Loader from '../Loader';
import ContractSignConfirmation from './modals/ContractSignConfirmationModal';

export const badgeClassesHead = [
  {
    name: 'false'
  },
  {
    name: 'true'
  }
];

const Contract: React.FC<LoanFromCommonProps> = ({
  loanId,
  fundingFormStatus
}) => {
  const { showToast } = useToast();

  const { loan } = useSelector(managementSliceSelector);
  const { role } = useSelector(authSelector);
  const [contractError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractSend, setIsContractSend] = useState(false);
  const [openContract, setOpenContract] = useState(false);
  const [rateOfInterest, setRateOfInterest] = useState(null);
  const [isContractSendConfirmModal, setIsContractSendConfirmModal] =
    useState(false);
  // const [contractPdf, setContractPdf] = useState(null);
  const [contractResponse, setContractResponse] = useState(null);
  const dispatch = useDispatch();

  const isSigned = !!(
    contractResponse?.signed_pdf && contractResponse?.signed_pdf !== ''
  );

  const fetchContractApi = async loanId => {
    try {
      const getContractApiResponse = await getContractApi(loanId);
      if (
        getContractApiResponse.status_code >= 200 &&
        getContractApiResponse.status_code < 300
      ) {
        if (
          [
            contractStatus.opened,
            contractStatus.sent,
            contractStatus.resent,
            contractStatus.processing,
            contractStatus.signed,
            contractStatus.signedByAll
          ].includes(getContractApiResponse.data.envelope_status)
        ) {
          setContractResponse(getContractApiResponse.data);

          setIsContractSend(!!getContractApiResponse.data);
          // if (getContractApiResponse.data.envelope_status === contractStatus.signedByAll) {
          //   setContractPdf(getContractApiResponse.data.signed_pdf);
          //   // window.open(link, "_blank");
          //   // setIsContractSend(getContractApiResponse.data)
          // }
        }
      } else {
        showToast(getContractApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  const handleSignContract = async () => {
    setIsContractSendConfirmModal(false);

    try {
      // if(envelopeStatus !== contractStatus.signedByAll){
      //   showToast("Need to sign Contract!", { type: NotificationType.Error });
      // }
      setIsLoading(true);
      if (
        isContractSend ||
        (contractResponse &&
          [contractStatus.resent, contractStatus.sent].includes(
            contractResponse.envelope_status
          ))
      ) {
        const reSendContractEmailApiResponse = await reSendContractEmailApi(
          loanId || loan.id
        );

        if (
          reSendContractEmailApiResponse.status_code >= 200 &&
          reSendContractEmailApiResponse.status_code < 300
        ) {
          setIsContractSend(true);
          showToast(reSendContractEmailApiResponse.status_message, {
            type: NotificationType.Success
          });
          updateFilledForms(loanId, {
            complete_contract: true
          }); // update filled forms
        } else {
          showToast(reSendContractEmailApiResponse.status_message, {
            type: NotificationType.Error
          });
        }
      } else {
        const sendContractEmailApiResponse = await sendContractEmailApi(
          loanId || loan.id
        );

        if (
          sendContractEmailApiResponse.status_code >= 200 &&
          sendContractEmailApiResponse.status_code < 300
        ) {
          showToast(sendContractEmailApiResponse.status_message, {
            type: NotificationType.Success
          });
          setIsContractSend(true);
          updateFilledForms(loanId, {
            complete_contract: true
          }); // update filled forms
        } else {
          showToast(sendContractEmailApiResponse.status_message, {
            type: NotificationType.Error
          });
        }
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (role !== Roles.FieldAgent) {
      fetchContractApi(loanId || loan.id);
    }
  }, []);

  useEffect(() => {
    dispatch(updateIsContractSend(isContractSend));
  }, [isContractSend]);

  const ViewContract = () => {
    return (
      <div className="p-4">
        {isSigned && (
          <div className="flex">
            <h2 className="mb-4 text-[16px] font-bold">{'Contract'}</h2>
            <div>
              <p
                className="flex pr-4 text-[12px] font-medium text-[#1A439A]"
                onClick={() => {
                  window.open(contractResponse?.signed_pdf, '_blank');
                }}
              >
                <img src={eye} alt="eye" className="px-2" /> {'VIEW'}
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4"></div>
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
        {[Roles.Admin, Roles.Manager].includes(role as Roles) && (
          <div className="flex flex-col pb-8">
            <div
              className={`items-center rounded-lg border border-[#D4D4D4] px-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                contractError && 'w-[100%] border-b-2 border-red-500'
              }`}
            >
              <div
                className={`accordion-title flex h-[4rem] cursor-pointer items-center justify-between bg-white ${
                  isContractSend ? 'text-[#1A439A]' : ''
                }`}
                onClick={() => setOpenContract(prevProps => !prevProps)}
              >
                <div className="flex items-center justify-between">
                  {isContractSend && (
                    <span className="accordion-tick">
                      <IoCheckmark className="mx-2" />
                    </span>
                  )}
                  <span className="flex items-center gap-x-2 max-sm:text-[12px]">
                    {' '}
                    <CiMail className="mt-[1px] h-5 w-5" />
                    {isContractSend || isSigned
                      ? 'Contract'
                      : 'Send Contract Sign Email'}
                  </span>
                </div>
                {isContractSend || isSigned ? (
                  isSigned ? (
                    <span className="accordion-arrow">
                      {openContract ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className={`bg-white ${[FundingFromCurrentStatus.UnderwriterSubmitted].includes(fundingFormStatus) ? 'text-[#1A439A]' : 'text-[#BABABA]'} cursor-pointer text-[14px] font-semibold uppercase max-sm:text-[10px]`}
                      disabled={
                        ![
                          FundingFromCurrentStatus.UnderwriterSubmitted
                        ].includes(fundingFormStatus)
                      }
                      onClick={() => {
                        setIsContractSendConfirmModal(true);
                      }}
                    >
                      {'RESEND'}
                    </button>
                  )
                ) : (
                  <span>
                    <button
                      type="button"
                      className={`bg-white ${[FundingFromCurrentStatus.UnderwriterSubmitted].includes(fundingFormStatus) ? 'text-[#1A439A]' : 'text-[#BABABA]'} cursor-pointer text-[14px] font-semibold uppercase max-sm:text-[10px]`}
                      disabled={
                        ![
                          FundingFromCurrentStatus.UnderwriterSubmitted
                        ].includes(fundingFormStatus)
                      }
                      onClick={() => {
                        setIsContractSendConfirmModal(true);
                      }}
                    >
                      {'SEND'}
                    </button>
                  </span>
                )}
              </div>
            </div>

            {contractError && (
              <p className={loanFormCommonStyleConstant.text.errorClass}>
                {contractError}
              </p>
            )}
          </div>
        )}
        {[Roles.Admin, Roles.Manager].includes(role as Roles) &&
          isSigned &&
          openContract && <ViewContract />}
      </div>

      <ContractSignConfirmation
        isOpen={isContractSendConfirmModal}
        onClose={() => {
          setIsContractSendConfirmModal(false);
        }}
        onApprove={handleSignContract}
        head="Send Contract Mail!"
        content="Are you sure send contract mail?"
        setUpdateRateOfInterest={setRateOfInterest}
        InterestOld={12}
        InterestNew={rateOfInterest}
      />
    </>
  );
};

export default Contract;
