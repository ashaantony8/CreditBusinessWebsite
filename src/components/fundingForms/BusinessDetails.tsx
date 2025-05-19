import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm
} from 'react-hook-form';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import {
  businessDetailsGetAPI,
  businessDetailsPostAPI
} from '../../api/loanServices';
import directory from '../../assets/svg/directory.svg';
import user from '../../assets/svg/user.svg';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import { updateBusinessDetails } from '../../store/loanFormReducer';
import {
  loanFormBusinessDetails,
  loanFormCommonStyleConstant
} from '../../utils/constants';
import { convertDateString, updateFilledForms } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { BusinessDetailsSchema } from '../../utils/Schema';
import {
  BusinessDetailsType,
  FundingFormFieldType,
  LoanFromCommonProps
} from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';
import NotEligibleModal from './modals/NotEligibleModal';
import { BusinesTypeTextEnum } from '../../utils/enums';

const BusinessDetails: React.FC<LoanFromCommonProps> = ({
  setRef,
  loanId = null
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<
    Partial<BusinessDetailsType>
  >({});
  // const [numDirector, setNumDirectors] = useState(0);
  const fieldRenderer = new FieldRenderer(
    loanFormBusinessDetails,
    loanFormCommonStyleConstant,
    BusinessDetailsSchema
  );

  const methods = useForm({
    resolver: yupResolver(BusinessDetailsSchema),
    defaultValues: {
      average_monthly_turnover: 4000,
      accepts_card_payment: 'Yes'
    }
  });
  const { handleSubmit, watch, reset, trigger, control, setValue } = methods;
  const acceptsCardPaymentWatch = watch('accepts_card_payment', 'Yes');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'directors'
  });
  const [notEligibleModalOpen, setNotEligibleModalOpen] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [triggerCondition, setTriggerCondition] = useState('');

  const { authenticated } = useAuth();
  const dispatch = useDispatch();

  const fetchDataFromApi = async loanId => {
    try {
      const businessDetailsResponse = await businessDetailsGetAPI(loanId);
      if (businessDetailsResponse?.status_code === 200) {
        const businessDetailsData = businessDetailsResponse.data;
        if (businessDetailsData.accepts_card_payment === '') {
          businessDetailsData.accepts_card_payment = 'Yes';
        }
        if (businessDetailsData.accepts_card_payment === 'No') {
          delete businessDetailsData.average_weekly_card_sales;
        } else {
          if (businessDetailsData.average_weekly_card_sales === '') {
            businessDetailsData.average_weekly_card_sales = 1000;
          }
        }
        if (businessDetailsData.average_monthly_turnover === '') {
          businessDetailsData.average_monthly_turnover = 4000;
        }

        setBusinessDetails(businessDetailsData);
        reset(businessDetailsData);
      } else {
        showToast(businessDetailsResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (acceptsCardPaymentWatch === 'Yes') {
      setValue('average_weekly_card_sales', 1000, {
        shouldValidate: true
      });
    }
  }, [acceptsCardPaymentWatch]);

  useEffect(() => {
    if (authenticated && loanId) {
      fetchDataFromApi(loanId);
    }
  }, [loanId]);

  const onSubmit: SubmitHandler<BusinessDetailsType> = async data => {
    setIsLoading(true);
    try {
      if (data.has_started_trading === 'No') {
        setNotEligibleModalOpen(true);
      } else if (data.is_profitable === 'No') {
        setTriggerCondition('profit');
        setShowModal(true);
      } else if (data.accepts_card_payment === 'No') {
        setTriggerCondition('cardPayment');
        setShowModal(true);
      } else {
        data.start_trading_date = convertDateString(data.start_trading_date);
        dispatch(updateBusinessDetails(data));
        const response = await businessDetailsPostAPI(data, loanId);

        if (response.status_code >= 200 && response.status_code < 300) {
          // dispatch(updateBusinessDetails(data))
          showToast(response.status_message, {
            type: NotificationType.Success
          });
          updateFilledForms(loanId, {
            complete_business_detail: true
          }); // update filled forms
          setTimeout(() => {
            dispatch(updateCurrentStage(3));
          }, 1500);
        } else {
          showToast(response.status_message, { type: NotificationType.Error });
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

  const onError: SubmitErrorHandler<BusinessDetailsType> = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
    trigger();
  };
  const watchNumDirectors = watch('number_of_directors', 0);

  // to reset error when change number_of_directors (it is not working)
  // useEffect(() => {
  //   clearErrors()
  // },[watchNumDirectors])

  // const watchBusinessType = watch("business_type", "Limited Company");

  const watchBusinessSector = watch('business_sector', '');
  // const watchhas_started_trading = watch("has_started_trading", "");
  const watchAcceptCardPayment = watch('accepts_card_payment', 'Yes');

  useEffect(() => {
    if (businessDetails?.business_type === 'Sole Trader') {
      methods.setValue('number_of_directors', 1);
      // methods.setValue(
      //   "directors",[]);
      // reset();
      // dispatch(updateBusinessDetails({...businessDetails,directors:[]}));
    }
    // dispatch(updateAdditionalInformation({...additionalInformation,business_type:watchBusinessType}));

    // dispatch(updateDirectorOrProprietorDetails({}));
  }, [businessDetails]);

  useEffect(() => {
    const currentDirectorsCount = fields.length;
    if (watchNumDirectors > currentDirectorsCount) {
      for (let i = currentDirectorsCount; i < watchNumDirectors; i++) {
        append({ first_name: '', last_name: '', title: '' });
      }
    } else if (watchNumDirectors < currentDirectorsCount) {
      for (let i = currentDirectorsCount; i > watchNumDirectors; i--) {
        remove(i - 1);
      }
    }
  }, [watchNumDirectors, append, remove, fields.length]);

  const closeConfirmModal = () => {
    setNotEligibleModalOpen(false);
  };

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
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4 p-6"
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="">
            {businessDetails?.business_type !== 'Sole Trader' ? (
              <span className="">
                {fieldRenderer.renderField('number_of_directors')}
              </span>
            ) : (
              <>
                {' '}
                <div className="flex h-[3rem] items-center rounded-lg border p-2">
                  {' '}
                  <div className="w-5 pr-2 text-gray-400">
                    <img src={directory} />
                  </div>{' '}
                  <a className="text-[14px]">{`Number of ${BusinesTypeTextEnum['Sole Trader']} 1`}</a>
                </div>
              </>
            )}
          </div>{' '}
        </div>

        <div className=" ">
          {(watchNumDirectors > 0 ||
            businessDetails?.business_type === 'Sole Trader') && (
            // <div className="h-[200px] border rounded-lg overflow-y-scroll p-2">
            <div
              className={` ${
                watchNumDirectors >= 3
                  ? 'h-[180px]'
                  : `h-[${watchNumDirectors * 100}] `
              } mb-2 overflow-y-scroll rounded-lg border p-2 py-2`}
            >
              {[
                ...Array(
                  businessDetails?.business_type === 'Sole Trader'
                    ? 1
                    : parseInt(watchNumDirectors.toString())
                )
              ].map((_, index) => {
                const directorConst: FundingFormFieldType[] = [
                  {
                    type: 'dropdown',
                    options: ['Mr', 'Mrs', 'Miss'],
                    icon: () => {
                      return (
                        <div>
                          <img
                            src={user}
                            className="h-5 w-5 rtl:rotate-[270deg]"
                          />
                        </div>
                      );
                    },
                    placeholder: 'Title',
                    name: `directors[${index}].title`,

                    defaultValue:
                      index === 0
                        ? businessDetails?.directors?.[0]?.title
                        : undefined
                  },
                  {
                    type: 'text',
                    // label: "firstName",
                    placeholder: 'First Name',
                    icon: () => {
                      return (
                        <div>
                          <img
                            src={user}
                            className="h-5 w-5 rtl:rotate-[270deg]"
                          />
                        </div>
                      );
                    },
                    name: `directors[${index}].first_name`,
                    defaultValue:
                      index === 0
                        ? businessDetails?.directors?.[0]?.first_name
                        : undefined
                  },
                  {
                    type: 'text',
                    // label: "lastName",
                    placeholder: 'Last  Name',
                    name: `directors[${index}].last_name`,
                    icon: () => {
                      return (
                        <div>
                          <img
                            src={user}
                            className="h-5 w-5 rtl:rotate-[270deg]"
                          />
                        </div>
                      );
                    },
                    defaultValue:
                      index === 0
                        ? businessDetails?.directors?.[0]?.last_name
                        : undefined
                  }
                ];
                fieldRenderer.updateConstant([
                  ...fieldRenderer.getConstant(),
                  ...directorConst
                ]);

                return (
                  <div key={index}>
                    <div className="mb-2 px-2 text-[14px] font-medium text-black max-sm:text-[10px]">
                      {`${businessDetails?.business_type ? BusinesTypeTextEnum[businessDetails?.business_type] : BusinesTypeTextEnum['Limited Company']}
                       ${index + 1}`}
                    </div>

                    <div className="grid gap-4 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-2 max-sm:col-span-6">
                          {fieldRenderer.renderField(
                            `directors[${index}].title`
                          )}
                        </div>
                        <div className="col-span-4 max-sm:col-span-6">
                          {fieldRenderer.renderField(
                            `directors[${index}].first_name`
                          )}
                        </div>
                      </div>
                      <div className="">
                        {' '}
                        {fieldRenderer.renderField([
                          `directors[${index}].last_name`
                        ])}
                      </div>
                    </div>
                  </div>
                );
              })}{' '}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
          {' '}
          <div className="flex gap-2">
            <AiOutlineQuestionCircle size={20} color="1A439A" />
            <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
              {'Business started trading?'}
            </a>
          </div>{' '}
          <div> {fieldRenderer.renderField('has_started_trading')}</div>{' '}
        </div>

        <div className="grid grid-cols-1 gap-4 p-[2px]">
          {' '}
          <div className="flex gap-2">
            <AiOutlineQuestionCircle size={20} color="1A439A" />
            <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
              {'When did your business start trading?'}
            </a>
          </div>
          <div> {fieldRenderer.renderField(['start_trading_date'])} </div>{' '}
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
          {' '}
          <div className="flex gap-2">
            <AiOutlineQuestionCircle size={20} color="1A439A" />
            <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
              {'In the last 12 months has your business been profitable?'}
            </a>
          </div>
          {fieldRenderer.renderField(['is_profitable'])}{' '}
        </div>

        {/* <div className="pt-4">
          {" "}
          {fieldRenderer.renderField(["is_profitable"])}{" "}
        </div> */}

        <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
          {' '}
          <div className="flex gap-2">
            <AiOutlineQuestionCircle size={20} color="1A439A" />
            <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
              {'Does your business accept card payment?'}
            </a>
          </div>
          {fieldRenderer.renderField('accepts_card_payment')}
        </div>

        {/* <div className="pt-4">
          {fieldRenderer.renderField("accepts_card_payment")}
        </div> */}

        {watchAcceptCardPayment === 'Yes' && (
          <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
            {' '}
            <div className="flex gap-2">
              <AiOutlineQuestionCircle size={20} color="1A439A" />
              <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
                {'Average weekly card sales?'}
              </a>
            </div>
            {fieldRenderer.renderField('average_weekly_card_sales')}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
          {' '}
          <div className="flex gap-2">
            <AiOutlineQuestionCircle size={20} color="1A439A" />
            <a className="text-[14px] font-medium text-black max-sm:text-[10px]">
              {'Average monthly total turnover?'}
            </a>
          </div>
          {fieldRenderer.renderField('average_monthly_turnover')}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {fieldRenderer.renderField('business_sector')}
        </div>

        {watchBusinessSector === 'Other business' && (
          <div className="grid grid-cols-1 gap-4">
            {fieldRenderer.renderField('other_business_name')}
          </div>
        )}
      </form>
      <NotEligibleModal
        isOpen={notEligibleModalOpen}
        onClose={closeConfirmModal}
        head="Sorry, you are not eligible for this funding submission!"
        content="Unfortunately, you are not eligible as your business has not yet started trading."
      />
      <NotEligibleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setTriggerCondition('');
          // navigate(`/`);
        }}
        head="Sorry, you are not eligible for this funding submission!"
        content={
          triggerCondition === 'profit'
            ? 'Your business does not meet the profit criteria.'
            : triggerCondition === 'cardPayment'
              ? 'Your business needs to accept card payments to be eligible.'
              : ''
        }
      />
    </FormProvider>
  );
};

export default BusinessDetails;
