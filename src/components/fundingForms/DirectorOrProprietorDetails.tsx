import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useDispatch } from 'react-redux';

import {
  directorDetailsPutAPI,
  retrieveDirectorGetAPI
} from '../../api/loanServices';
import user from '../../assets/svg/user.svg';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import {
  loanFormCommonStyleConstant,
  loanFormDirectorOrProprietorDetails
} from '../../utils/constants';
import {
  convertDateString,
  StayContext,
  updateFilledForms
} from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { DirectorOrProprietorDetailsSchema } from '../../utils/Schema';
import {
  DirectorOrProprietorDetailsType,
  LoanFromCommonProps
} from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';
import Partner from './Partner';
import { BusinesTypeTextEnum } from '../../utils/enums';

const DirectorOrProprietorDetails: React.FC<LoanFromCommonProps> = ({
  setRef,
  loanId
}) => {
  const { authenticated } = useAuth();
  const [PartnerError, setPartnerError] = useState(null);
  const [openDirectorIndex, setOpenDirectorIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState('Limited Company');
  const [directorOrProprietorDetails, setDirectorOrProprietorDetails] =
    useState<Partial<DirectorOrProprietorDetailsType>>({});
  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);

  const fieldRenderer = new FieldRenderer(
    loanFormDirectorOrProprietorDetails,
    loanFormCommonStyleConstant,
    DirectorOrProprietorDetailsSchema
  );

  const dispatch = useDispatch();
  const { showToast } = useToast();

  const methods = useForm({
    resolver: yupResolver(DirectorOrProprietorDetailsSchema),
    defaultValues: directorOrProprietorDetails
  });

  const { handleSubmit, reset } = methods;

  const fetchDataFromApi = async loanId => {
    try {
      const directorOrProprietorDetailsResponse =
        await retrieveDirectorGetAPI(loanId);
      if (directorOrProprietorDetailsResponse?.status_code === 200) {
        setBusinessType(directorOrProprietorDetailsResponse.data.business_type);
        setDirectorOrProprietorDetails({
          directors: directorOrProprietorDetailsResponse.data.directors
        });
        reset({
          directors: directorOrProprietorDetailsResponse.data.directors
        });
      } else {
        showToast(directorOrProprietorDetailsResponse.status_message, {
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

  const onSubmit: SubmitHandler<
    DirectorOrProprietorDetailsType
  > = async data => {
    setIsLoading(true);
    let isValidStay = true;
    data.directors.forEach(director => {
      //first submission//first date ranges 's end date and last date range's start_date difference greater than 3 year
      if (!director?.stay_validated) {
        const lastStayDetails = director.stay[director.stay.length - 1];
        const firstStayDetails = director.stay[0];
        if (
          dayjs(firstStayDetails.end_date).diff(
            dayjs(lastStayDetails.start_date),
            'year'
          ) < 3
        ) {
          isValidStay = false;
          setIsLoading(false);
          showToast(
            `Please fill Stay details from 3 years before to current date for ${director?.title} ${director?.first_name}`,
            { type: NotificationType.Error }
          );
        }
      }
    });

    if (!isValidStay) return;
    try {
      data.directors.flatMap(dir =>
        dir.stay.map(stay => {
          stay.start_date = convertDateString(stay.start_date);
          stay.end_date = convertDateString(stay.end_date);
          return stay;
        })
      );

      const response = await directorDetailsPutAPI(
        { data: data.directors },
        loanId
      );
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        updateFilledForms(loanId, {
          director_detail: true
        }); // update filled forms
        setTimeout(() => {
          dispatch(updateCurrentStage(5));
        }, 1500);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
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

  const onError: SubmitErrorHandler<
    DirectorOrProprietorDetailsType
  > = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    setPartnerError(error);
    console.log('error', error);
  };

  const toggleAccordion = (index: number) => {
    setOpenDirectorIndex(openDirectorIndex === index ? -1 : index);
  };

  const stayDateRanges = directorOrProprietorDetails?.directors?.map(i => {
    const arr = i.stay.map(item => {
      return {
        excludeDateIntervals: [],
        start_date: item.start_date,
        end_date: item.end_date
      };
    });
    return arr.length > 0
      ? arr
      : [{ excludeDateIntervals: [], start_date: null, end_date: null }];
    // return [{ excludeDateIntervals: [], start_date: null, end_date: null }];
  });

  const [dateRanges, setDateRanges] = useState();

  return (
    <StayContext.Provider
      value={{
        dateRanges: dateRanges || stayDateRanges,
        setDateRanges,
        methods
      }}
    >
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
          className="relative p-4"
        >
          <div className="p-2 text-[16px] font-medium">
            {' '}
            {`Select the ${businessType && BusinesTypeTextEnum[businessType]}`}
          </div>
          {directorOrProprietorDetails?.directors?.map((director, index) => (
            <div
              key={index}
              // className={`w-full  ${
              //   openDirectorIndex !== index &&
              //   PartnerError &&
              //   PartnerError.directors[index] &&
              //   " border-b-2 border-blue-500 w-[100%]   "
              // } `}
            >
              <div className={PartnerError && 'pb-8'}>
                <div
                  className="accordion-title mb-4 flex cursor-pointer items-center justify-between rounded-lg border bg-white p-3"
                  onClick={() => toggleAccordion(index)}
                >
                  <span
                    className={`accordion flex gap-2 text-[14px] ${
                      openDirectorIndex === index
                        ? 'font-medium text-[#1A439A]'
                        : 'w-[100%] font-medium text-black'
                    }`}
                  >
                    <div className="">
                      <img src={user} className="h-5 w-5 rtl:rotate-[270deg]" />
                    </div>
                    {`${director.first_name} ${director.last_name}`}
                  </span>
                  <span className="accordion-arrow mb-2">
                    {openDirectorIndex === index ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                </div>
                <div
                  className="relative"
                  style={{
                    display: openDirectorIndex !== index ? 'block' : 'none'
                  }}
                >
                  <div
                    className={`w-full ${
                      PartnerError &&
                      PartnerError.directors[index] &&
                      'absolute w-[100%] border-red-500'
                    } `}
                  >
                    <p className="absolute mt-2 text-[10px] text-red-500">
                      {PartnerError &&
                        PartnerError.directors[index] &&
                        'Something went wrong please check partner details you are filled.'}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="accordion-content bg-white py-1"
                style={{
                  display: openDirectorIndex === index ? 'block' : 'none'
                }}
              >
                <Partner
                  currentDirectorIndex={index}
                  currentDirector={director}
                  fieldRenderer={fieldRenderer}
                  partnerType="directors"
                  PartnerError={PartnerError}
                />
              </div>
            </div>
          ))}
        </form>
      </FormProvider>
    </StayContext.Provider>
  );
};

export default DirectorOrProprietorDetails;
