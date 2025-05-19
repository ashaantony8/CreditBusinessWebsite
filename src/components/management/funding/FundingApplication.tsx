import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdChatBubbleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import {
  approveLoanApi,
  customerLoanApi,
  getContractApi,
  rejectLoanApi,
  submitLoanApi,
  uwVerifyGetApi,
  uwVerifyPostApi
} from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import {
  fundingStateSliceSelector,
  resetFundingState,
  updateCurrentStage
} from '../../../store/fundingStateReducer';
import { managementSliceSelector } from '../../../store/managementReducer';
import {
  declarationCheckboxStyle,
  LoanWizardStages
} from '../../../utils/constants';
import {
  ApplicationStatusBadgeClasses,
  buttonStyles,
  fieldMappings
} from '../../../utils/data';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum,
  FundingFromUpcomingStatus,
  ModeOfApplication,
  Roles
} from '../../../utils/enums';
import {
  AffordabilityNextTab,
  AffordabilityPrevTab,
  updateFilledForms
} from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { UwVerifyProps } from '../../../utils/types';
import BusinessDetails from '../../fundingForms/BusinessDetails';
import BusinessPremiseDetails from '../../fundingForms/BusinessPremiseDetails';
import CustomerContract from '../../fundingForms/Contract';
import DirectorOrProprietorDetails from '../../fundingForms/DirectorOrProprietorDetails';
import DocumentationUploads from '../../fundingForms/DocumentationUploads';
import GoCardless from '../../fundingForms/GoCardless';
import Guarantor from '../../fundingForms/Guarantor';
import IdentityVerification from '../../fundingForms/IdentityVerification';
import MarketingPreferences from '../../fundingForms/MarketingPreferences';
import FundingComments from '../../fundingForms/modals/Comments';
import FundingApproveOrRejectModal from '../../fundingForms/modals/FundingApproveOrRejectModal';
import FundingSuccessModal from '../../fundingForms/modals/FundingSuccessModal';
import MakeOffer from '../../fundingForms/modals/MakeOffer';
import FundingRemarks from '../../fundingForms/modals/Remarks';
import PersonalInformation from '../../fundingForms/PersonalInformation';
import ProgressCircle from '../../fundingForms/StepProgressCircle';
import CustomerAffordability from '../affordability/CustomerAffordability';
import DisbursementAdvice from '../dashboard/DisbursementAdvice';
import FundingTab from './FundingTab';

const ManagementFundingApplication = () => {
  const { role } = useSelector(authSelector);
  const { loan } = useSelector(managementSliceSelector);
  const [loanId, setLoanId] = useState(undefined);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const maxFormsByRole = {
    [Roles.FieldAgent]: 9,
    [Roles.FinanceManager]: 9,
    [Roles.UnderWriter]: 10,
    [Roles.Manager]: 12,
    [Roles.Admin]: 12
  };
  const NumberOfForms = [Roles.Admin, Roles.Manager].includes(role)
    ? 12
    : [Roles.UnderWriter].includes(role)
      ? 10
      : 9;

  const [fundingFormStatus, setFundingFormStatus] =
    useState<FundingFromCurrentStatus>(FundingFromCurrentStatus.Inprogress);
  const [fundingUpcomingFormStatus, setFundingUpcomingFormStatus] =
    useState<FundingFromUpcomingStatus>(
      FundingFromUpcomingStatus.GocardlessConsentWaiting
    );
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const { currentStage, isContractSend } = useSelector(
    fundingStateSliceSelector
  );
  const [isSubmitConfirmModal, setIsSubmitConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApproveConfirmModal, setIsApproveConfirmModal] = useState(false);
  const [isDisperseConfirmModal, setIsDisperseConfirmModal] = useState(false);
  const [isRejectConfirmModal, setIsRejectConfirmModal] = useState(false);
  const [isReturnConfirmModal, setIsReturnConfirmModal] = useState(false);
  const [isMakeOfferConfirmModal, setIsMakeOfferConfirmModal] = useState(false);
  const [rateOfInterest, setRateOfInterest] = useState(12);
  const [isApproved, setIsApproved] = useState(false);
  const [isDisburse, setIsDisbursed] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isReturned, setIsReturned] = useState(false);
  const [isRemarksOpen, setIsRemarksOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [remark, setRemark] = useState(null);
  const [statueUpdate, setStatueUpdate] = useState(false);
  const [contractResponse, setContractResponse] = useState(null);
  const [affordabilityActiveStage, setAffordabilityActiveStage] =
    useState('general_form');
  const [uwVerifyData, setUwVerifyData] = useState<Record<string, boolean>>({});

  const isSigned = !!(
    contractResponse?.signed_pdf && contractResponse?.signed_pdf !== ''
  );

  useEffect(() => {
    if ([Roles.Admin, Roles.Manager].includes(role)) {
      fetchContractApi(loanId || loan.id);
    }
  }, []);

  useEffect(() => {
    if (currentStage) {
      setActiveStage(currentStage);
    }
  }, [currentStage]);

  useEffect(() => {
    if (activeStage) {
      dispatch(updateCurrentStage(activeStage));
    }
  }, [activeStage]);

  useEffect(() => {
    fetchCustomerLoans(loan.id);
  }, [loan, isDisburse, isRejected, isSubmitted, isApproved, isReturned]);

  useEffect(() => {
    fetchCustomerLoansOnly(loan.id);
  }, [statueUpdate]);

  useEffect(() => {
    return () => {
      dispatch(resetFundingState());
    };
  }, []);

  useEffect(() => {
    if (loanId && activeStage && Roles.UnderWriter === role) {
      fetchUwVerify();
    }
  }, [loanId, activeStage]);
  const fetchContractApi = async loanId => {
    try {
      const getContractApiResponse = await getContractApi(loanId);
      if (
        getContractApiResponse.status_code >= 200 &&
        getContractApiResponse.status_code < 300
      ) {
        setContractResponse(getContractApiResponse.data);
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

  const fetchCustomerLoansOnly = async loanId => {
    // temprory fix for afordability tab not appear
    try {
      const loanGetApiResponse = await customerLoanApi(loanId);
      if (loanGetApiResponse.status_code === 200) {
        setLoanId(loanGetApiResponse?.data?.id);
        setFundingFormStatus(
          loanGetApiResponse?.data?.loan_status?.current_status == ''
            ? FundingFromCurrentStatus.Inprogress
            : (loanGetApiResponse?.data?.loan_status
                ?.current_status as FundingFromCurrentStatus)
        );
        setFundingUpcomingFormStatus(
          loanGetApiResponse?.data?.loan_status?.upcoming_status == ''
            ? FundingFromUpcomingStatus.GocardlessConsentWaiting
            : (loanGetApiResponse?.data?.loan_status
                ?.upcoming_status as FundingFromUpcomingStatus)
        );
      } else {
        showToast(loanGetApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  const fetchCustomerLoans = async loanId => {
    try {
      const loanGetApiResponse = await customerLoanApi(loanId);
      if (loanGetApiResponse.status_code === 200) {
        setLoanId(loanGetApiResponse?.data?.id);
        setFundingFormStatus(
          loanGetApiResponse?.data?.loan_status?.current_status == ''
            ? FundingFromCurrentStatus.Inprogress
            : (loanGetApiResponse?.data?.loan_status
                ?.current_status as FundingFromCurrentStatus)
        );
        setFundingUpcomingFormStatus(
          loanGetApiResponse?.data?.loan_status?.upcoming_status == ''
            ? FundingFromUpcomingStatus.GocardlessConsentWaiting
            : (loanGetApiResponse?.data?.loan_status
                ?.upcoming_status as FundingFromUpcomingStatus)
        );

        let filledForms =
          loanGetApiResponse?.data?.loan_status?.filled_forms_count;
        const maxForms = maxFormsByRole[role];
        filledForms = Math.min(filledForms, maxForms);
        const NextForm = Math.min(filledForms + 1, NumberOfForms);
        setActiveStage(NextForm);
        dispatch(updateCurrentStage(NextForm));
      } else {
        showToast(loanGetApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  const handleStageChange = (stage: number) => {
    if (stage <= NumberOfForms) {
      dispatch(updateCurrentStage(stage));
      setActiveStage(stage);
    }
  };

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const wizardTabs = [Roles.Admin, Roles.Manager].includes(role)
    ? LoanWizardStages
    : Roles.UnderWriter === role
      ? LoanWizardStages.slice(0, -2) // hide contract tab and disbursement tab
      : LoanWizardStages.slice(0, -3); //  hide contract tab and disbursement tab affordability tab

  const submitApiCall = async (remark: string) => {
    setIsSubmitConfirmModal(false);
    const payload = { remarks: remark };
    const response = await submitLoanApi(loanId, payload);
    if (response.status_code >= 200 && response.status_code < 300) {
      setIsSubmitted(true);
    } else {
      showToast(response.status_message, { type: NotificationType.Error });
    }
  };

  const approveApiCall = async () => {
    const payload: Record<string, boolean | number> = { remarks: remark };

    if (role === Roles.Manager) {
      payload.approve = true;
      updateFilledForms(loanId, {
        complete_disbursement_advice: true
      });
      if (rateOfInterest) {
        payload.update_rate_of_interest = rateOfInterest;
      }
    }

    if (role === Roles.Admin) {
      payload.approve = true;
      payload.disperse = true;
    }

    setIsApproveConfirmModal(false);

    try {
      const response = await approveLoanApi(payload, loanId);

      if (response.status_code >= 200 && response.status_code < 300) {
        if (
          [FundingFromUpcomingStatus.UnderwriterSubmissionWaiting].includes(
            fundingUpcomingFormStatus
          )
        ) {
          setIsSubmitConfirmModal(false);
          setIsSubmitted(true);
        } else {
          setIsApproved(true);
        }
      } else {
        throw new Error(response.status_message);
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    }
  };

  const disperseApiCall = async () => {
    const payload = {
      approve: true,
      remarks: remark,
      disperse: true
    };
    setIsDisperseConfirmModal(false);
    const response = await approveLoanApi(payload, loanId);
    if (response.status_code >= 200 && response.status_code < 300) {
      setIsDisbursed(true);
    } else {
      showToast(response.status_message, { type: NotificationType.Error });
    }
  };

  const RejectApiCall = async () => {
    setIsRejectConfirmModal(false);
    const response = await rejectLoanApi({ reject_reason: remark }, loanId);
    if (response.status_code >= 200 && response.status_code < 300) {
      setIsRejected(true);
    } else {
      showToast(response.status_message, { type: NotificationType.Error });
    }
  };

  const ReturnApiCall = async () => {
    setIsReturnConfirmModal(false);
    const response = await rejectLoanApi({ return_reason: remark }, loanId);
    if (response.status_code >= 200 && response.status_code < 300) {
      setIsReturned(true);
    } else {
      showToast(response.status_message, { type: NotificationType.Error });
    }
  };

  const handleSubmitFundingForm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (
      [
        FundingFromUpcomingStatus.AgentSubmissionWaiting,
        FundingFromUpcomingStatus.SubmissionWaiting
      ].includes(fundingUpcomingFormStatus)
    ) {
      setIsSubmitConfirmModal(false);
      submitApiCall(remark);
    } else {
      approveApiCall();
    }
  };

  const closeConfirmModal = () => {
    setIsSubmitConfirmModal(false);
  };

  const toggleRemarks = () => {
    setIsRemarksOpen(prevState => !prevState);
  };

  const toggleComments = () => {
    setIsCommentsOpen(prevState => !prevState);
  };

  const renderTabContent = () => {
    switch (activeStage) {
      case 1:
        return <PersonalInformation setRef={setFormRef} loanId={loanId} />;
      case 2:
        return <BusinessDetails setRef={setFormRef} loanId={loanId} />;
      case 3:
        return <BusinessPremiseDetails setRef={setFormRef} loanId={loanId} />;
      case 4:
        return (
          <DirectorOrProprietorDetails setRef={setFormRef} loanId={loanId} />
        );
      case 5:
        return <MarketingPreferences setRef={setFormRef} loanId={loanId} />;
      case 6:
        return <DocumentationUploads setRef={setFormRef} loanId={loanId} />;
      case 7:
        return <Guarantor setRef={setFormRef} loanId={loanId} />;
      case 8:
        return (
          <IdentityVerification
            setRef={setFormRef}
            loanId={loanId}
            fundingFormStatus={fundingFormStatus}
          />
        );
      case 9:
        return (
          <GoCardless
            setRef={setFormRef}
            loanId={loanId}
            setStatueUpdate={setStatueUpdate}
            fundingFormStatus={fundingFormStatus}
          />
        );
      case 10:
        return (
          <CustomerAffordability
            loanId={loanId}
            affordabilityActiveStage={affordabilityActiveStage}
            setAffordabilityActiveStage={setAffordabilityActiveStage}
            setRef={setFormRef}
            setStatueUpdate={setStatueUpdate}
          />
        );
      case 11:
        return <DisbursementAdvice setRef={setFormRef} loanId={loanId} />;
      case 12:
        return (
          <CustomerContract
            loanId={loanId}
            fundingFormStatus={fundingFormStatus}
          />
        );
      default:
        return <h1>{'Empty!'}</h1>;
    }
  };

  const renderButton = () => {
    const commonProps = (onClick?: () => void, disabled?: boolean) => ({
      type: 'submit',
      className: disabled ? buttonStyles.disable : buttonStyles.submit,
      disabled: disabled,
      onClick
    });

    const renderSubmitButton = (
      value: string,
      onClick?: () => void,
      disabled?: boolean
    ) => <input {...commonProps(onClick, disabled)} value={value} />;

    const renderActionButtons = (
      actions: {
        value: string;
        onClick: () => void;
        style: keyof typeof buttonStyles;
        disabled?: boolean;
      }[]
    ) => (
      <div className="mt-4 flex px-4 py-3">
        {actions.map(({ value, onClick, style, disabled }, index) => {
          if (value === 'Next') {
            return (
              <button
                key={value + index} // passing unique key prop
                type="button"
                className={`mr-4 flex items-center px-4 py-3 text-white max-sm:text-[10px] ${
                  disabled ? 'bg-[#BABABA]' : 'cursor-pointer bg-[#1A439A]'
                }`}
                onClick={onClick}
                disabled={disabled}
              >
                {activeStage === 1 ? 'Save & Continue' : 'Next'}
                {activeStage !== 1 && (
                  <FiChevronRight className="ml-2 h-5 w-5" />
                )}
              </button>
            );
          }
          return (
            <input
              key={value}
              type="submit"
              value={value}
              disabled={disabled}
              className={`${
                disabled ? buttonStyles['disable'] : buttonStyles[style]
              }`}
              onClick={onClick}
            />
          );
        })}
      </div>
    );

    const handleUwSubmit = () => {
      const allTrue = Object.entries(uwVerifyData)
        .filter(([key]) => key !== 'complete_contract') // Exclude complete_contract
        .every(([, value]) => value === true);

      if (!allTrue) {
        showToast('Please verify the forms.', {
          type: NotificationType.Error
        });
      } else {
        setIsSubmitConfirmModal(true);
      }
    };

    const handleAdminDisbursal = () => {
      if (!isSigned) {
        showToast('Waiting for customer to sign the contract !', {
          type: NotificationType.Info
        });
      } else {
        setIsDisperseConfirmModal(true);
      }
    };

    switch (fundingFormStatus) {
      case FundingFromCurrentStatus.Inprogress:
      case FundingFromCurrentStatus.UnderwriterReturned:
        if (
          loan.customer.mode_of_application === ModeOfApplication.Representative
        ) {
          switch (role) {
            case Roles.FieldAgent:
            case Roles.UnderWriter:
            case Roles.Manager:
            case Roles.Admin:
              if (activeStage === 9) {
                return renderActionButtons([
                  {
                    value: 'Submit',
                    onClick: () => setIsSubmitConfirmModal(true),
                    style: 'submit',
                    disabled: ![
                      FundingFromUpcomingStatus.SubmissionWaiting
                    ].includes(fundingUpcomingFormStatus)
                  }
                ]);
              }
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => formRef.current.requestSubmit(),
                  style: 'next'
                }
              ]);
            default:
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () =>
                    handleStageChange(
                      NumberOfForms > activeStage
                        ? activeStage + 1
                        : NumberOfForms
                    ),
                  style: 'next'
                }
              ]);
          }
        } else {
          switch (role) {
            case Roles.UnderWriter:
            case Roles.Manager:
            case Roles.Admin:
              if (activeStage >= 9) {
                return renderActionButtons([
                  {
                    value: 'Next',
                    onClick: () => formRef.current.requestSubmit(),
                    style: 'next',
                    disabled: true
                  }
                ]);
              }
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => formRef.current.requestSubmit(),
                  style: 'next'
                }
              ]);
            default:
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () =>
                    handleStageChange(
                      NumberOfForms > activeStage
                        ? activeStage + 1
                        : NumberOfForms
                    ),
                  style: 'next'
                }
              ]);
          }
        }

      case FundingFromCurrentStatus.Submitted:
        if (
          loan.customer.mode_of_application === ModeOfApplication.Representative
        ) {
          switch (role) {
            case Roles.FieldAgent:
            case Roles.UnderWriter:
            case Roles.Manager:
            case Roles.Admin:
              if (activeStage === 9) {
                return renderActionButtons([
                  {
                    value: 'Submit',
                    onClick: () => setIsSubmitConfirmModal(true),
                    style: 'submit'
                  }
                ]);
              }
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => formRef.current.requestSubmit(),
                  style: 'next'
                }
              ]);
            default:
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () =>
                    handleStageChange(
                      NumberOfForms > activeStage
                        ? activeStage + 1
                        : NumberOfForms
                    ),
                  style: 'next'
                }
              ]);
          }
        } else {
          switch (role) {
            case Roles.UnderWriter:
              if (activeStage === 10) {
                switch (affordabilityActiveStage) {
                  case 'general_form':
                  case 'gross_form':
                    return renderActionButtons([
                      {
                        value: 'Next',
                        onClick: () => formRef.current.requestSubmit(),
                        style: 'next',
                        disabled: ![
                          FundingFromUpcomingStatus.UnderwriterGocardlessSortingWaiting,
                          FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
                          FundingFromUpcomingStatus.UnderwriterSubmissionWaiting
                        ].includes(fundingUpcomingFormStatus)
                      },
                      {
                        value: 'Return',
                        onClick: () => setIsReturnConfirmModal(true),
                        style: 'reject'
                      }
                    ]);
                  case 'affordability_completed':
                    return renderActionButtons([
                      {
                        value: 'Submit',
                        onClick: () => handleUwSubmit(),
                        style: 'submit',
                        disabled: ![
                          FundingFromUpcomingStatus.UnderwriterSubmissionWaiting
                        ].includes(fundingUpcomingFormStatus)
                      },
                      {
                        value: 'Return',
                        onClick: () => setIsReturnConfirmModal(true),
                        style: 'reject'
                      }
                    ]);
                  default:
                    return renderActionButtons([
                      {
                        value: 'Next',
                        onClick: () =>
                          handleStageChange(
                            NumberOfForms > activeStage
                              ? activeStage + 1
                              : NumberOfForms
                          ),
                        style: 'next'
                      },
                      {
                        value: 'Return',
                        onClick: () => setIsReturnConfirmModal(true),
                        style: 'reject'
                      }
                    ]);
                }
              }
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => formRef.current.requestSubmit(),
                  style: 'next'
                },
                {
                  value: 'Return',
                  onClick: () => setIsReturnConfirmModal(true),
                  style: 'reject'
                }
              ]);
            case Roles.Manager:
              if (activeStage === NumberOfForms) {
                return renderActionButtons([
                  {
                    value: 'Make Offer',
                    onClick: () => setIsMakeOfferConfirmModal(true),
                    style: 'submit',
                    disabled: true
                  },
                  {
                    value: 'Approve',
                    onClick: () => setIsApproveConfirmModal(true),
                    style: 'approve',
                    disabled: true
                  },
                  {
                    value: 'Reject',
                    onClick: () => setIsRejectConfirmModal(true),
                    style: 'reject',
                    disabled: true
                  }
                ]);
              }
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => formRef.current.requestSubmit(),
                  style: 'next'
                }
              ]);
            case Roles.Admin:
              if (activeStage === NumberOfForms) {
                return renderActionButtons([
                  {
                    value: 'Disburse',
                    onClick: () => handleAdminDisbursal(),
                    style: 'approve',
                    disabled: true
                  }
                ]);
              }
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => formRef.current.requestSubmit(),
                  style: 'next'
                }
              ]);

            default:
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () =>
                    handleStageChange(
                      NumberOfForms > activeStage
                        ? activeStage + 1
                        : NumberOfForms
                    ),
                  style: 'next'
                }
              ]);
          }
        }
      case FundingFromCurrentStatus.AgentSubmitted:
      case FundingFromCurrentStatus.ManagerRejected:
        switch (role) {
          case Roles.FieldAgent:
            if (activeStage === NumberOfForms) {
              return renderSubmitButton('Submitted', null, true);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.UnderWriter:
            if (activeStage === 10) {
              switch (affordabilityActiveStage) {
                case 'general_form':
                case 'gross_form':
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () => formRef.current.requestSubmit(),
                      style: 'next',
                      disabled: ![
                        FundingFromUpcomingStatus.UnderwriterGocardlessSortingWaiting,
                        FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
                        FundingFromUpcomingStatus.UnderwriterSubmissionWaiting
                      ].includes(fundingUpcomingFormStatus)
                    },
                    {
                      value: 'Return',
                      onClick: () => setIsReturnConfirmModal(true),
                      style: 'reject'
                    }
                  ]);
                case 'affordability_completed':
                  return renderActionButtons([
                    {
                      value: 'Submit',
                      onClick: () => handleUwSubmit(),
                      style: 'submit',
                      disabled: ![
                        FundingFromUpcomingStatus.UnderwriterSubmissionWaiting
                      ].includes(fundingUpcomingFormStatus)
                    },
                    {
                      value: 'Return',
                      onClick: () => setIsReturnConfirmModal(true),
                      style: 'reject'
                    }
                  ]);
                default:
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () =>
                        handleStageChange(
                          NumberOfForms > activeStage
                            ? activeStage + 1
                            : NumberOfForms
                        ),
                      style: 'next'
                    },
                    {
                      value: 'Return',
                      onClick: () => setIsReturnConfirmModal(true),
                      style: 'reject'
                    }
                  ]);
              }
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () => formRef.current.requestSubmit(),
                style: 'next'
              },
              {
                value: 'Return',
                onClick: () => setIsReturnConfirmModal(true),
                style: 'reject'
              }
            ]);

          case Roles.Manager:
            if (activeStage === 10) {
              switch (affordabilityActiveStage) {
                case 'general_form':
                case 'gross_form':
                case 'approval_form':
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () => formRef.current.requestSubmit(),
                      style: 'next',
                      disabled: ![
                        FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
                        FundingFromUpcomingStatus.UnderwriterSubmissionWaiting,
                        FundingFromUpcomingStatus.ManagerDisbursementWaiting,
                        FundingFromUpcomingStatus.ManagerApprovalWaiting
                      ].includes(fundingUpcomingFormStatus)
                    }
                  ]);
                default:
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () =>
                        handleStageChange(
                          NumberOfForms > activeStage
                            ? activeStage + 1
                            : NumberOfForms
                        ),
                      style: 'next'
                    }
                  ]);
              }
            }
            if (activeStage === NumberOfForms) {
              return renderActionButtons([
                {
                  value: 'Make Offer',
                  onClick: () => setIsMakeOfferConfirmModal(true),
                  style: 'submit',
                  disabled: ![
                    FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
                    FundingFromUpcomingStatus.UnderwriterGocardlessSortingWaiting
                  ].includes(fundingUpcomingFormStatus)
                },
                {
                  value: 'Approve',
                  onClick: () => setIsApproveConfirmModal(true),
                  style: 'approve',
                  disabled: ![
                    FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
                    FundingFromUpcomingStatus.UnderwriterGocardlessSortingWaiting
                  ].includes(fundingUpcomingFormStatus)
                },
                {
                  value: 'Reject',
                  onClick: () => setIsRejectConfirmModal(true),
                  style: 'reject',
                  disabled: ![
                    FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
                    FundingFromUpcomingStatus.UnderwriterGocardlessSortingWaiting
                  ].includes(fundingUpcomingFormStatus)
                }
              ]);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () => formRef.current.requestSubmit(),
                style: 'next'
              }
            ]);
          // setAffordabilityActiveStage(AffordabilityNextTab(affordabilityActiveStage))
          case Roles.Admin:
            if (activeStage === 10) {
              switch (affordabilityActiveStage) {
                case 'general_form':
                case 'gross_form':
                case 'approval_form':
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () => formRef.current.requestSubmit(),
                      style: 'next',
                      disabled: ![
                        FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
                        FundingFromUpcomingStatus.UnderwriterSubmissionWaiting,
                        FundingFromUpcomingStatus.ManagerDisbursementWaiting,
                        FundingFromUpcomingStatus.ManagerApprovalWaiting
                      ].includes(fundingUpcomingFormStatus)
                    }
                  ]);
                default:
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () =>
                        handleStageChange(
                          NumberOfForms > activeStage
                            ? activeStage + 1
                            : NumberOfForms
                        ),
                      style: 'next'
                    }
                  ]);
              }
            }
            if (activeStage === NumberOfForms) {
              return renderActionButtons([
                {
                  value: 'Disburse',
                  onClick: () => handleAdminDisbursal(),
                  style: 'approve',
                  disabled: true
                }
              ]);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () => formRef.current.requestSubmit(),
                style: 'next'
              }
            ]);

          default:
            if (activeStage === 10) {
              switch (affordabilityActiveStage) {
                case 'general_form':
                case 'gross_form':
                case 'approval_form':
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () =>
                        setAffordabilityActiveStage(
                          AffordabilityNextTab(affordabilityActiveStage)
                        ),
                      style: 'next'
                    }
                  ]);
                default:
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () =>
                        handleStageChange(
                          NumberOfForms > activeStage
                            ? activeStage + 1
                            : NumberOfForms
                        ),
                      style: 'next'
                    }
                  ]);
              }
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
        }
      case FundingFromCurrentStatus.UnderwriterSubmitted:
        switch (role) {
          case Roles.FieldAgent:
            if (activeStage === NumberOfForms) {
              return renderSubmitButton('Submitted', null, true);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.UnderWriter:
            if (activeStage === NumberOfForms) {
              if (affordabilityActiveStage === 'gross_form') {
                return renderSubmitButton('Submitted', null, true);
              } else {
                return renderActionButtons([
                  {
                    value: 'Next',
                    onClick: () =>
                      setAffordabilityActiveStage(
                        affordabilityActiveStage === 'gross_form'
                          ? 'gross_form'
                          : AffordabilityNextTab(affordabilityActiveStage)
                      ),
                    style: 'next'
                  }
                ]);
              }
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.Manager:
            if (activeStage === 10) {
              switch (affordabilityActiveStage) {
                case 'general_form':
                case 'gross_form':
                case 'approval_form':
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () => formRef.current.requestSubmit(),
                      style: 'next',
                      disabled: ![
                        FundingFromUpcomingStatus.ManagerAffordabilityWaiting,
                        FundingFromUpcomingStatus.ManagerDisbursementWaiting,
                        FundingFromUpcomingStatus.ManagerApprovalWaiting
                      ].includes(fundingUpcomingFormStatus)
                    },
                    {
                      value: 'Reject',
                      onClick: () => setIsRejectConfirmModal(true),
                      style: 'reject'
                    }
                  ]);
                default:
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () =>
                        handleStageChange(
                          NumberOfForms > activeStage
                            ? activeStage + 1
                            : NumberOfForms
                        ),
                      style: 'next'
                    },
                    {
                      value: 'Reject',
                      onClick: () => setIsRejectConfirmModal(true),
                      style: 'reject'
                    }
                  ]);
              }
            }
            if (activeStage === NumberOfForms) {
              return renderActionButtons([
                {
                  value: 'Make Offer',
                  onClick: () => setIsMakeOfferConfirmModal(true),
                  style: 'submit'
                },
                {
                  value: 'Approve',
                  onClick: () => setIsApproveConfirmModal(true),
                  style: 'approve',
                  disabled: !isSigned
                },
                {
                  value: 'Reject',
                  onClick: () => setIsRejectConfirmModal(true),
                  style: 'reject'
                }
              ]);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () => formRef.current.requestSubmit(),
                style: 'next'
              },
              {
                value: 'Reject',
                onClick: () => setIsRejectConfirmModal(true),
                style: 'reject'
              }
            ]);

          case Roles.Admin:
            if (activeStage === 10) {
              switch (affordabilityActiveStage) {
                case 'general_form':
                case 'gross_form':
                case 'approval_form':
                  return renderActionButtons([
                    {
                      value: 'Next',
                      onClick: () => formRef.current.requestSubmit(),
                      style: 'next',
                      disabled: ![
                        FundingFromUpcomingStatus.ManagerAffordabilityWaiting,
                        FundingFromUpcomingStatus.ManagerDisbursementWaiting,
                        FundingFromUpcomingStatus.ManagerApprovalWaiting
                      ].includes(fundingUpcomingFormStatus)
                    }
                  ]);
                default:
                  return <></>;
              }
            }
            if (activeStage === NumberOfForms) {
              return renderActionButtons([
                {
                  value: 'Disburse',
                  onClick: () => handleAdminDisbursal(),
                  style: 'approve',
                  disabled: true
                }
              ]);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () => formRef.current.requestSubmit(),
                style: 'next'
              }
            ]);

          default:
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
        }

      case FundingFromCurrentStatus.ManagerApproved:
        switch (role) {
          case Roles.FieldAgent:
            if (activeStage === NumberOfForms) {
              return renderSubmitButton('Submitted', null, true);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.UnderWriter:
            if (activeStage === NumberOfForms) {
              if (affordabilityActiveStage === 'gross_form') {
                return renderSubmitButton('Submitted', null, true);
              } else {
                return renderActionButtons([
                  {
                    value: 'Next',
                    onClick: () =>
                      setAffordabilityActiveStage(
                        affordabilityActiveStage === 'gross_form'
                          ? 'gross_form'
                          : AffordabilityNextTab(affordabilityActiveStage)
                      ),
                    style: 'next'
                  }
                ]);
              }
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.Manager:
            if (activeStage === 10) {
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => {
                    if (affordabilityActiveStage === 'approval_form') {
                      setAffordabilityActiveStage('approval_form');
                      handleStageChange(11);
                    } else {
                      setAffordabilityActiveStage(
                        AffordabilityNextTab(affordabilityActiveStage)
                      );
                    }
                  },
                  style: 'next'
                }
              ]);
            }
            if (activeStage === NumberOfForms) {
              return renderSubmitButton('Approved', null, true);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);

          case Roles.Admin:
            if (activeStage === 10) {
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => {
                    if (affordabilityActiveStage === 'approval_form') {
                      setAffordabilityActiveStage('approval_form');
                      handleStageChange(11);
                    } else {
                      setAffordabilityActiveStage(
                        AffordabilityNextTab(affordabilityActiveStage)
                      );
                    }
                  },
                  style: 'next'
                }
              ]);
            }
            if (activeStage === NumberOfForms) {
              return renderActionButtons([
                {
                  value: 'Disburse',
                  onClick: () => handleAdminDisbursal(),
                  style: 'approve',
                  disabled: !isContractSend
                }
              ]);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);

          default:
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
        }

      case FundingFromCurrentStatus.AdminCashDisbursed:
        switch (role) {
          case Roles.FieldAgent:
            if (activeStage === NumberOfForms) {
              return renderSubmitButton('Submitted', null, true);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.UnderWriter:
            if (activeStage === NumberOfForms) {
              if (affordabilityActiveStage === 'gross_form') {
                return renderSubmitButton('Submitted', null, true);
              } else {
                return renderActionButtons([
                  {
                    value: 'Next',
                    onClick: () =>
                      setAffordabilityActiveStage(
                        affordabilityActiveStage === 'gross_form'
                          ? 'gross_form'
                          : AffordabilityNextTab(affordabilityActiveStage)
                      ),
                    style: 'next'
                  }
                ]);
              }
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.Manager:
            if (activeStage === 10) {
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => {
                    if (affordabilityActiveStage === 'approval_form') {
                      setAffordabilityActiveStage('approval_form');
                      handleStageChange(11);
                    } else {
                      setAffordabilityActiveStage(
                        AffordabilityNextTab(affordabilityActiveStage)
                      );
                    }
                  },
                  style: 'next'
                }
              ]);
            }
            if (activeStage === NumberOfForms) {
              return renderSubmitButton('Approved', null, true);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.Admin:
            if (activeStage === 10) {
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => {
                    if (affordabilityActiveStage === 'approval_form') {
                      setAffordabilityActiveStage('approval_form');
                      handleStageChange(11);
                    } else {
                      setAffordabilityActiveStage(
                        AffordabilityNextTab(affordabilityActiveStage)
                      );
                    }
                  },
                  style: 'next'
                }
              ]);
            }
            if (activeStage === NumberOfForms) {
              return renderSubmitButton('Disbursed', null, true);
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          default:
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
        }
      default:
        switch (role) {
          case Roles.FieldAgent:
            if (activeStage === NumberOfForms) {
              return null;
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.UnderWriter:
            if (activeStage === NumberOfForms) {
              if (affordabilityActiveStage === 'gross_form') {
                return null;
              } else {
                return renderActionButtons([
                  {
                    value: 'Next',
                    onClick: () =>
                      setAffordabilityActiveStage(
                        affordabilityActiveStage === 'gross_form'
                          ? 'gross_form'
                          : AffordabilityNextTab(affordabilityActiveStage)
                      ),
                    style: 'next'
                  }
                ]);
              }
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          case Roles.Manager:
          case Roles.Admin:
            if (activeStage === 10) {
              return renderActionButtons([
                {
                  value: 'Next',
                  onClick: () => {
                    if (affordabilityActiveStage === 'approval_form') {
                      setAffordabilityActiveStage('approval_form');
                      handleStageChange(11);
                    } else {
                      setAffordabilityActiveStage(
                        AffordabilityNextTab(affordabilityActiveStage)
                      );
                    }
                  },
                  style: 'next'
                }
              ]);
            }
            if (activeStage === NumberOfForms) {
              return null;
            }
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
          default:
            return renderActionButtons([
              {
                value: 'Next',
                onClick: () =>
                  handleStageChange(
                    NumberOfForms > activeStage
                      ? activeStage + 1
                      : NumberOfForms
                  ),
                style: 'next'
              }
            ]);
        }
    }
  };

  const handleApiResponse = (response, onSuccess: () => void) => {
    if (response.status_code === 200) {
      onSuccess();
    } else {
      showToast(response.status_message, { type: NotificationType.Error });
    }
  };

  const fetchUwVerify = async () => {
    try {
      const response = await uwVerifyGetApi(loanId);
      handleApiResponse(response, () => {
        setUwVerifyData(response?.data?.underwriter_verified_forms || {});
      });
    } catch (error) {
      console.error('Fetch UwVerify Error:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  const UwVerify: React.FC<UwVerifyProps> = ({ loanId, activeStage }) => {
    const currentMapping = fieldMappings[activeStage - 1] || {
      field: '',
      verifyField: '',
      success: '',
      unverified: ''
    };
    const {
      field: fieldName,
      verifyField: verifyFieldName,
      success: successMessage,
      unverified: unverifiedMessage
    } = currentMapping;

    const handleCheckboxChange = async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const isChecked = e.target.checked;
      try {
        const response = await uwVerifyPostApi(loanId, {
          [verifyFieldName]: isChecked
        });
        handleApiResponse(response, () => {
          setUwVerifyData(prevState => ({
            ...prevState,
            [fieldName]: isChecked
          }));
          showToast(isChecked ? successMessage : unverifiedMessage, {
            type: NotificationType.Success
          });
        });
      } catch (error) {
        console.error('Checkbox Change Error:', error);
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    };

    const totalFields = fieldMappings.length;
    const verifiedFields = Object.keys(uwVerifyData).filter(
      key => uwVerifyData[key]
    ).length;

    return (
      <div className="grid grid-cols-6 items-center gap-4">
        {activeStage <= 9 &&
          [
            FundingFromUpcomingStatus.UnderwriterAffordabilityWaiting,
            FundingFromUpcomingStatus.UnderwriterGocardlessSortingWaiting,
            FundingFromUpcomingStatus.UnderwriterSubmissionWaiting
          ].includes(fundingUpcomingFormStatus) && (
            <div className="col-span-4 max-sm:col-span-6">
              <div className="flex items-center space-x-2">
                <div className="mr-8 mt-4 flex items-center">
                  <label
                    htmlFor={fieldName}
                    className={`flex cursor-pointer items-center ${declarationCheckboxStyle.wrapperClass}`}
                  >
                    <input
                      id={fieldName}
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      checked={!!uwVerifyData[fieldName]}
                      className={`mr-2 ${declarationCheckboxStyle.fieldClass}`}
                    />
                    <span className={`${declarationCheckboxStyle.labelClass}`}>
                      {'Verify'}
                    </span>
                  </label>
                </div>
                <ProgressCircle
                  currentStep={verifiedFields}
                  totalSteps={totalFields}
                />
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="h-full p-2">
      <div className="mt-2 flex items-center justify-between px-[2%] max-sm:px-[5%]">
        <span className="mx-[1%] max-sm:mx-[2.5%] max-sm:mb-4">
          <ProgressCircle
            currentStep={activeStage}
            totalSteps={NumberOfForms}
          />
        </span>
        <span className="flex items-center gap-6 max-sm:gap-2">
          <a
            className="flex cursor-pointer items-center gap-1 font-semibold text-gray-900"
            onClick={toggleComments}
          >
            <MdChatBubbleOutline
              className="cursor-pointer max-sm:mt-[2px] max-sm:text-[10px]"
              onClick={toggleComments}
            />
            <a className="max-sm:text-[10px]">{' Comment'}</a>
          </a>
          <a
            className="flex cursor-pointer items-center gap-1 font-semibold text-red-900"
            onClick={toggleRemarks}
          >
            <MdChatBubbleOutline
              className="cursor-pointer max-sm:mt-[2px] max-sm:text-[10px]"
              onClick={toggleRemarks}
            />
            <a className="max-sm:text-[10px]">{' Remark '}</a>
          </a>
          <span
            className={`inline-flex rounded-full px-3 text-xs leading-5 max-sm:px-2 ${ApplicationStatusBadgeClasses[fundingFormStatus]}`}
          >
            <a className="max-sm:text-[10px]">
              {' '}
              {FundingFromStatusEnum?.[fundingFormStatus]}{' '}
            </a>
          </span>
        </span>
      </div>
      <div className="px-[1%] max-sm:px-[4%]">
        <FundingTab
          tabs={wizardTabs}
          activeTab={activeStage}
          setActiveTab={setActiveStage}
        />
      </div>
      {isLaptop && loanId && (
        <>
          <div className="flex justify-end">
            {' '}
            {Roles.UnderWriter === role && (
              <UwVerify loanId={loanId} activeStage={activeStage} />
            )}
          </div>

          <div
            className="overflow-y-scroll"
            style={{ height: 'calc(100vh - 58vh)' }}
          >
            {renderTabContent()}
          </div>
        </>
      )}{' '}
      {isTablet && loanId && (
        <div
          className="overflow-y-scroll"
          style={{ height: 'calc(100vh - 48vh)' }}
        >
          {renderTabContent()}
        </div>
      )}
      {isMobile && loanId && (
        <div
          className="overflow-y-scroll"
          style={{ height: 'calc(100vh - 40vh)' }}
        >
          {renderTabContent()}
        </div>
      )}
      <div className="sticky top-[100vh] mb-2">
        <div className="flex items-center justify-between px-4">
          <div>
            <button
              type="button"
              className="mr-4 mt-4 flex cursor-pointer items-center bg-[#1A439A] px-4 py-3 text-white"
              onClick={() => {
                if (
                  activeStage === 10 &&
                  affordabilityActiveStage !== 'general_form'
                ) {
                  setAffordabilityActiveStage(
                    AffordabilityPrevTab(affordabilityActiveStage)
                  );
                } else {
                  handleStageChange(1 < activeStage - 1 ? activeStage - 1 : 1);
                  if (
                    activeStage === 10 &&
                    [Roles.UnderWriter, Roles.Manager].includes(role)
                  ) {
                    setAffordabilityActiveStage('general_form');
                  }
                }
              }}
            >
              <FiChevronLeft className="h-5 w-5" />
              <a className="max-sm:text-[10px]">{'Previous'}</a>
            </button>
          </div>

          {[5, 6, 7].includes(activeStage) && (
            <div>
              <button
                type="button"
                className="mr-4 mt-4 flex cursor-pointer items-center bg-[#1A439A] px-4 py-3 text-white"
                onClick={() => {
                  const updates = {
                    5: { complete_marketing_preference: true },
                    6: { complete_documents: true },
                    7: { complete_guarantor: true }
                  };

                  if (updates[activeStage]) {
                    updateFilledForms(loan.id, updates[activeStage]);
                  }

                  handleStageChange(activeStage + 1);
                }}
              >
                <a className="max-sm:text-[10px]">{' Skip'}</a>
              </button>
            </div>
          )}
          <div>
            {/* {((isAdmin && isLastThreeStages) || (isManager && activeStage === NumberOfForms - 1) || (isUnderWriter||isAgent && activeStage === NumberOfForms)) ?  */}
            {renderButton()}
            {/* :(
                <button
                  type="button"
                  className={`flex  rounded-lg text-white px-4 py-2  ${ isButtonDisabledForGocardlessGrouped?"bg-[#BABABA]" : "bg-[#1A439A] cursor-pointer"}`}
                  onClick={handleButtonClick}
                  disabled={
                    isButtonDisabledForGocardlessGrouped
                  }
                >
                Next
                <FiChevronRight className="h-5 w-5 ml-2" />
              </button>
              )} */}
          </div>
        </div>
      </div>
      <FundingRemarks
        isOpen={isRemarksOpen}
        onClose={toggleRemarks}
        loanId={loanId}
      />
      <FundingComments
        isOpen={isCommentsOpen}
        onClose={toggleComments}
        loanId={loanId}
      />
      <MakeOffer
        isOpen={isMakeOfferConfirmModal}
        onClose={() => {
          setIsMakeOfferConfirmModal(false);
        }}
        loanId={loanId}
      />
      {isApproveConfirmModal && (
        <FundingApproveOrRejectModal
          role={role}
          isApprove={isApproveConfirmModal}
          onClose={() => {
            setIsApproveConfirmModal(false);
          }}
          onReject={RejectApiCall}
          onApprove={approveApiCall}
          head="Approval Confirmation!"
          content="Are you sure to Approve the Application"
          setRateOfInterest={setRateOfInterest}
          rateOfInterest={rateOfInterest}
          setRemarks={setRemark}
          remarks={remark}
        />
      )}
      {isDisperseConfirmModal && (
        <FundingApproveOrRejectModal
          role={role}
          isApprove={isDisperseConfirmModal}
          onClose={() => {
            setIsDisperseConfirmModal(false);
          }}
          onReject={RejectApiCall}
          onApprove={disperseApiCall}
          head="Disburse Amount Confirmation!"
          content="Are you sure to Disburse the Amount"
          setRemarks={setRemark}
          remarks={remark}
        />
      )}
      {isRejectConfirmModal && (
        <FundingApproveOrRejectModal
          role={role}
          onClose={() => {
            setIsRejectConfirmModal(false);
          }}
          onReject={RejectApiCall}
          onApprove={approveApiCall}
          head="Rejection confirmation!"
          content="Are you sure to Reject the Application"
          setRemarks={setRemark}
          remarks={remark}
        />
      )}
      {isReturnConfirmModal && (
        <FundingApproveOrRejectModal
          role={role}
          onClose={() => {
            setIsReturnConfirmModal(false);
          }}
          onReject={ReturnApiCall}
          onApprove={approveApiCall}
          head="Return confirmation!"
          content="Are you sure to Return the Application"
          setRemarks={setRemark}
          remarks={remark}
        />
      )}
      <FundingSuccessModal
        isOpen={isSubmitConfirmModal}
        onClose={closeConfirmModal}
        onSubmit={handleSubmitFundingForm}
        setRemark={setRemark}
        head="Submit confirmation!"
        content={`Are you sure to continue submitting this application ${
          [Roles.Admin, Roles.Manager, Roles.UnderWriter].includes(role) &&
          [
            FundingFromUpcomingStatus.AgentSubmissionWaiting,
            FundingFromUpcomingStatus.SubmissionWaiting
          ].includes(fundingUpcomingFormStatus)
            ? 'behalf of agent'
            : ''
        }?`}
      />
      <FundingSuccessModal
        isOpen={isSubmitted}
        onClose={() => {
          setIsSubmitted(false);
        }}
        head="Funding Successfully Submitted!"
        content={`
            Funding application has been successfully
            submitted.`}
      />
      <FundingSuccessModal
        isOpen={isApproved}
        onClose={() => {
          setIsApproved(false);
        }}
        head="Funding Successfully Approved!"
        content={`Funding application has been successfully
                      Approved.`}
      />
      <FundingSuccessModal
        isOpen={isDisburse}
        onClose={() => {
          setIsDisbursed(false);
        }}
        head="Funding Successfully Disbursed!"
        content="Funding application has been successfully Disbursed."
      />
      <FundingSuccessModal
        isOpen={isRejected}
        onClose={() => {
          setIsRejected(false);
        }}
        head="Funding Application Rejected!"
        content="Funding application has been Rejected."
      />
      <FundingSuccessModal
        isOpen={isReturned}
        onClose={() => {
          setIsReturned(false);
        }}
        head="Funding Application Returned!"
        content="Funding application has been Returned."
      />
    </div>
  );
};

export default ManagementFundingApplication;
