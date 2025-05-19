import React, { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdChatBubbleOutline, MdOutlineHome } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import {
  customerLoanApi,
  personalInformationGetAPI,
  submitLoanApi
} from '../../api/loanServices';
import {
  fundingStateSliceSelector,
  updateCurrentStage
} from '../../store/fundingStateReducer';
import { loanFormSliceSelector } from '../../store/loanFormReducer';
import { LoanWizardStages } from '../../utils/constants';
import { ApplicationStatusBadgeClasses } from '../../utils/data';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum,
  FundingFromUpcomingStatus,
  ModeOfApplication
} from '../../utils/enums';
import { updateFilledForms } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { LoanData } from '../../utils/types';
import FormTestinomial from '../login/FormTestinomial';
import BusinessDetails from './BusinessDetails';
import BusinessPremiseDetails from './BusinessPremiseDetails';
import DirectorOrProprietorDetails from './DirectorOrProprietorDetails';
import DocumentationUploads from './DocumentationUploads';
import Gocardless from './GoCardless';
import Guarantor from './Guarantor';
import IdentityVerification from './IdentityVerification';
import MarketingPreferences from './MarketingPreferences';
import FundingComments from './modals/Comments';
import FundingSuccessModal from './modals/FundingSuccessModal';
import NotEligibleModal from './modals/NotEligibleModal';
import PersonalInformation from './PersonalInformation';
import ProgressCircle from './StepProgressCircle';

const CustomerFundingApplication: React.FC = ({
  backHandler
}: {
  backHandler?: () => void;
}) => {
  const { showToast } = useToast();
  const { authenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const NumberOfForms = 9;
  const { query_params_loanId } = useParams();

  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const { currentStage } = useSelector(fundingStateSliceSelector);
  const { personalInformation } = useSelector(loanFormSliceSelector);
  const [isSubmitConfirmModal, setIsSubmitConfirmModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loan, setLoan] = useState<Partial<LoanData>>(undefined);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [statueUpdate, setStatueUpdate] = useState(false);
  const [isRepAssigned, setIsRepAssigned] = useState(false);
  const [isRepAssignedRemind, setIsRepAssignedRemind] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [fundingFormStatus, setFundingFormStatus] =
    useState<FundingFromCurrentStatus>(FundingFromCurrentStatus.Inprogress);
  const [fundingUpcomingFormStatus, setFundingUpcomingFormStatus] =
    useState<FundingFromUpcomingStatus>(
      FundingFromUpcomingStatus.GocardlessConsentWaiting
    );

  const fetchCustomerLoans = async query_params_loanId => {
    try {
      const loanGetApiResponse = await customerLoanApi(query_params_loanId);

      if (loanGetApiResponse.status_code === 200) {
        const firstLoan = query_params_loanId
          ? loanGetApiResponse?.data
          : loanGetApiResponse?.data?.[0]; //customer with out query_params_loanId as query params consider the first funding
        setLoan(firstLoan);
        setFundingUpcomingFormStatus(
          firstLoan?.loan_status?.upcoming_status == ''
            ? FundingFromUpcomingStatus.GocardlessConsentWaiting
            : (firstLoan?.loan_status
                ?.upcoming_status as FundingFromUpcomingStatus)
        );
        setFundingFormStatus(
          firstLoan?.loan_status?.current_status == ''
            ? FundingFromCurrentStatus.Inprogress
            : (firstLoan?.loan_status
                ?.current_status as FundingFromCurrentStatus)
        );
        const filledFormsCount =
          firstLoan?.loan_status?.filled_forms_count >= NumberOfForms
            ? NumberOfForms
            : firstLoan?.loan_status?.filled_forms_count;
        const isRepAssignedOrNot = await fetchDataFromApi(firstLoan?.id);
        const NextForm = Math.min(
          isRepAssignedOrNot ? filledFormsCount : filledFormsCount + 1,
          NumberOfForms
        );
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

  const fetchCustomerLoansOnly = async query_params_loanId => {
    try {
      const loanGetApiResponse = await customerLoanApi(query_params_loanId);

      if (loanGetApiResponse.status_code === 200) {
        const firstLoan = query_params_loanId
          ? loanGetApiResponse?.data
          : loanGetApiResponse?.data?.[0]; //customer with out query_params_loanId as query params consider the first funding
        setLoan(firstLoan);
        setFundingUpcomingFormStatus(
          firstLoan?.loan_status?.upcoming_status == ''
            ? FundingFromUpcomingStatus.GocardlessConsentWaiting
            : (firstLoan?.loan_status
                ?.upcoming_status as FundingFromUpcomingStatus)
        );
        setFundingFormStatus(
          firstLoan?.loan_status?.current_status == ''
            ? FundingFromCurrentStatus.Inprogress
            : (firstLoan?.loan_status
                ?.current_status as FundingFromCurrentStatus)
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

  useEffect(() => {
    if (authenticated) {
      // if(query_params_loanId){
      fetchCustomerLoans(query_params_loanId);
      // }else{
      //   dispatch(resetFundingState())
      // }
    }
  }, [query_params_loanId, isModalOpen, authenticated]);

  useEffect(() => {
    if (authenticated) {
      fetchCustomerLoansOnly(query_params_loanId);
    }
  }, [query_params_loanId, isModalOpen, authenticated, statueUpdate]);
  useEffect(() => {
    if (currentStage) {
      setActiveStage(currentStage === 0 ? 1 : currentStage);
    }
  }, [currentStage]);

  const handleSubmitFundingForm = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsSubmitConfirmModal(false);
    const response = await submitLoanApi(loan?.id);
    if (response.status_code >= 200 && response.status_code < 300) {
      setIsModalOpen(true);
      // showToast(response.status_message, { type: NotificationType.Success });
    } else {
      showToast(response.status_message, { type: NotificationType.Error });
    }
  };

  const closeConfirmModal = () => {
    setIsSubmitConfirmModal(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handleButtonClick();
    // navigate(`/`);
  };

  const handleStageChange = (stage: number) => {
    if (stage <= NumberOfForms) {
      dispatch(updateCurrentStage(stage)); // update stage to redux appropriate form change
      setActiveStage(stage);
    }
  };

  const fetchDataFromApi = async (loanId: string) => {
    try {
      const PersonalInfoApiResponse = await personalInformationGetAPI(loanId);
      if (PersonalInfoApiResponse?.status_code === 200) {
        if (
          PersonalInfoApiResponse.data.mode_of_application ===
          ModeOfApplication.Representative
        ) {
          setIsRepAssigned(
            PersonalInfoApiResponse.data.mode_of_application ===
              ModeOfApplication.Representative
          );
          return true;
        }
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

  const handleButtonClick = async () => {
    const isFinalStage = activeStage >= NumberOfForms;
    const isInprogressOrReturned = [
      FundingFromCurrentStatus.Inprogress,
      FundingFromCurrentStatus.UnderwriterReturned
    ].includes(fundingFormStatus);
    const isSubmissionWaiting =
      fundingUpcomingFormStatus === FundingFromUpcomingStatus.SubmissionWaiting;
    const filledforms = Math.min(
      loan.loan_status.filled_forms_count,
      NumberOfForms
    );

    if (isRepAssigned) {
      //is representative assigned then skip step
      if (filledforms === 0) {
        formRef.current.requestSubmit();
      } else if (filledforms === activeStage) {
        setIsRepAssignedRemind(true);
      } else if (filledforms > activeStage) {
        handleStageChange(activeStage + 1);
      }
    } else {
      if (isFinalStage) {
        if (isInprogressOrReturned && isSubmissionWaiting) {
          setIsSubmitConfirmModal(true);
        } else {
          handleStageChange(NumberOfForms);
          navigate(`/`);
        }
      } else {
        if (isInprogressOrReturned) {
          formRef.current.requestSubmit();
        } else {
          handleStageChange(activeStage + 1);
        }
      }
    }
  };

  const toggleComments = () => {
    setIsCommentsOpen(prevState => !prevState);
  };

  const handleSubmitButtonText = () => {
    const isFinalStage = activeStage >= NumberOfForms;
    const isInprogressOrReturned = [
      FundingFromCurrentStatus.Inprogress,
      FundingFromCurrentStatus.UnderwriterReturned
    ].includes(fundingFormStatus);
    const isConsentWaiting =
      fundingUpcomingFormStatus ===
      FundingFromUpcomingStatus.GocardlessConsentWaiting;
    const isDisabled = !authenticated || (isFinalStage && isConsentWaiting);

    const buttonText =
      isFinalStage && isInprogressOrReturned
        ? 'Submit'
        : isFinalStage
          ? 'Go to home.'
          : 'Next';
    const buttonClasses = `flex items-center mr-4 px-4 py-2 text-white cursor-pointer  mt-4 ${
      isDisabled
        ? 'cursor-not-allowed bg-[#BABABA]'
        : 'cursor-pointer bg-[#1A439A]'
    }`;

    return (
      <button
        type="button"
        disabled={isDisabled}
        className={buttonClasses}
        onClick={handleButtonClick}
      >
        {buttonText}
        {!isFinalStage && <FiChevronRight className="ml-2 h-5 w-5" />}
      </button>
    );
  };

  const renderStageComponent = loanId => {
    switch (activeStage) {
      case 1:
        return (
          <PersonalInformation
            setRef={setFormRef}
            loanId={loanId}
            setLoan={setLoan}
            setIsRepAssigned={setIsRepAssigned}
          />
        );
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
          <Gocardless
            setRef={setFormRef}
            loanId={loanId}
            fundingFormStatus={fundingFormStatus}
            setStatueUpdate={setStatueUpdate}
          />
        );
      default:
        return <h1>{'Empty!'}</h1>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 max-sm:grid-cols-1">
        <div className="">
          <FormTestinomial />
        </div>

        <div className="flex h-screen flex-col bg-white">
          <div className="sticky top-0 z-10 border-b bg-white px-[1%] lg:col-span-2">
            {isLaptop && (
              <span className="mr-2 flex items-center justify-between gap-4 px-4">
                <div className="flex gap-8">
                  <div className="-mt-2 ml-2">
                    {' '}
                    <ProgressCircle currentStep={activeStage} totalSteps={9} />
                  </div>

                  <p className="my-2 text-[14px] font-light text-[#1A439A] sm:mb-4">
                    {activeStage <= 9 && (
                      <a className="ml-1 font-bold text-[#02002E]">
                        {'Application Form -'}
                      </a>
                    )}
                    {LoanWizardStages.find(e => e.id === activeStage).label}
                  </p>
                </div>
                <span className="mx-[1%] flex items-center gap-2 sm:mb-4">
                  {authenticated && (
                    <a
                      onClick={toggleComments}
                      className="flex cursor-pointer items-center gap-1 font-semibold text-gray-900"
                    >
                      {' '}
                      <MdChatBubbleOutline
                        className="mt-1 cursor-pointer"
                        onClick={toggleComments}
                      />
                      {'Comment'}
                    </a>
                  )}
                  {authenticated && (
                    <div>
                      <span
                        className={`ml-2 inline-flex rounded-full px-4 text-xs leading-5 max-sm:px-2 ${ApplicationStatusBadgeClasses[fundingFormStatus]}`}
                      >
                        {FundingFromStatusEnum?.[fundingFormStatus]}
                      </span>
                    </div>
                  )}
                  <div className="mt-6">
                    <NavLink to="/" className="">
                      <div
                        className={`flex items-center gap-1 rounded-lg border border-[#1A439A] p-1 font-medium text-[#1A439A] sm:mb-4 ${
                          !backHandler && ''
                        }`}
                      >
                        <MdOutlineHome size={20} />
                        <a className="text-[13px] font-semibold uppercase max-lg:hidden max-sm:hidden">
                          {'Home'}
                        </a>
                      </div>
                    </NavLink>
                  </div>
                </span>
              </span>
            )}

            {(isTablet || isMobile) && (
              <>
                <div className="flex items-center justify-between px-4">
                  <span className="ml-2 mt-3">
                    {' '}
                    <ProgressCircle currentStep={activeStage} totalSteps={9} />
                  </span>

                  <span className="ml-4 mt-4 text-[14px] font-light text-[#1A439A] max-sm:text-[10px]">
                    {activeStage <= 9 && (
                      <a className="font-bold text-[#02002E]">
                        {'Application Form -'}
                      </a>
                    )}
                    {LoanWizardStages.find(e => e.id === activeStage).label}
                  </span>
                  <span className="mt-6">
                    <NavLink to="/" className="">
                      <div
                        className={`rounded-lg border border-[#1A439A] p-1 text-[#1A439A] ${
                          !backHandler && ''
                        }`}
                      >
                        <MdOutlineHome size={20} />
                      </div>
                    </NavLink>
                  </span>
                </div>
                <span className="mx-[1%] my-2 flex items-center justify-end gap-2">
                  {authenticated && (
                    <a
                      onClick={toggleComments}
                      className="flex cursor-pointer items-center gap-1 font-semibold text-gray-900 max-lg:text-[11px] max-sm:text-[10px]"
                    >
                      {' '}
                      <MdChatBubbleOutline
                        className="mt-1 cursor-pointer"
                        onClick={toggleComments}
                      />
                      {'Comment'}
                    </a>
                  )}
                  {authenticated && (
                    <div>
                      <span
                        className={`ml-2 inline-flex rounded-full px-4 text-xs leading-5 max-sm:px-2 ${ApplicationStatusBadgeClasses[fundingFormStatus]}`}
                      >
                        {FundingFromStatusEnum?.[fundingFormStatus]}
                      </span>
                    </div>
                  )}
                </span>{' '}
              </>
            )}
          </div>

          <div className="hide-scrollbar flex-1 overflow-auto">
            {renderStageComponent(loan?.id)}
          </div>

          <div className="sticky bottom-0 z-10 mb-4 bg-white">
            {activeStage === 1 ? (
              <div className="flex justify-end p-4 px-4">
                <input
                  type="submit"
                  value="Save & Continue"
                  disabled={
                    !personalInformation?.is_otp_verified && !authenticated
                  }
                  className={`mt-1 cursor-pointer bg-[#1A439A] px-4 py-2 text-[12px] uppercase text-white ${
                    personalInformation?.is_otp_verified || authenticated
                      ? 'cursor-pointer bg-[#1A439A]'
                      : 'cursor-not-allowed bg-[#BABABA]'
                  }`}
                  onClick={handleButtonClick}
                />
              </div>
            ) : (
              <div className="flex justify-between px-4 pb-8">
                <div>
                  <button
                    type="button"
                    className="mr-4 mt-4 flex cursor-pointer items-center bg-[#1A439A] px-4 py-2 text-white"
                    onClick={() => {
                      handleStageChange(
                        1 < activeStage - 1 ? activeStage - 1 : 1
                      );
                    }}
                  >
                    <FiChevronLeft className="mr-2 h-5 w-5" />
                    {'Previous'}
                  </button>
                </div>
                {[5, 6, 7].includes(activeStage) && (
                  <div>
                    <button
                      type="button"
                      className="mr-4  mt-4 flex cursor-pointer items-center bg-[#1A439A] px-4 max-sm:px-1.5 py-2 text-white"
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
                      {'Skip'}
                    </button>
                  </div>
                )}
                <div>{handleSubmitButtonText()}</div>
              </div>
            )}
          </div>
        </div>
        <FundingComments
          isOpen={isCommentsOpen}
          onClose={toggleComments}
          loanId={loan?.id}
        />

        <FundingSuccessModal
          isOpen={isSubmitConfirmModal}
          onClose={closeConfirmModal}
          onSubmit={handleSubmitFundingForm}
          head="Submit confirmation!"
          content="Are you sure to continue submitting this application?."
        />
      </div>
      <FundingSuccessModal
        isOpen={isModalOpen}
        onClose={closeModal}
        head="Funding Successfully Submitted!"
        content={`
          Your Funding application has been successfully
          submitted. ${
            loan?.customer?.mode_of_application ==
            ModeOfApplication.Representative
              ? "After the agent confirmation we'll proceed further and "
              : "We'll "
          } get back to you soon.`}
      />
      <NotEligibleModal
        isOpen={isRepAssignedRemind}
        onClose={() => {
          setIsRepAssignedRemind(false);
        }}
        head="Notice"
        content="You assigned to an agent, you can no longer continue with the application. Only the agent has the ability to fill out the form."
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
    </>
  );
};

export default CustomerFundingApplication;
