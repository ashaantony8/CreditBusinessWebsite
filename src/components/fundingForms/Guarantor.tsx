import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { guarantorGetAPI, guarantorPostAPI } from '../../api/loanServices';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import {
  loanFormCommonStyleConstant,
  loanFormGuarantor
} from '../../utils/constants';
// import AddressLookup from "./AddressLookup";
import {
  convertDateString,
  StayContext,
  // lookUpAddressFormatter,
  updateFilledForms
} from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { GuarantorSchema } from '../../utils/Schema';
import { GuarantorType, LoanFromCommonProps } from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';
import Partner from './Partner';

const Guarantor: React.FC<LoanFromCommonProps> = ({ setRef, loanId }) => {
  const { authenticated } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);
  const { showToast } = useToast();
  const fieldRenderer = new FieldRenderer(
    loanFormGuarantor,
    loanFormCommonStyleConstant,
    GuarantorSchema
  );

  const dispatch = useDispatch();
  const [guarantorInfo, setGuarantorInfo] = useState<Partial<GuarantorType>>(
    {}
  );
  // const [address, setAddress] = useState(undefined);
  const [guarantorError, setGuarantorError] = useState(null);

  const methods = useForm({
    resolver: yupResolver(GuarantorSchema),
    defaultValues: guarantorInfo
  });

  // const { handleSubmit, watch, setValue, formState, trigger, reset } = methods;
  const { handleSubmit, reset } = methods;
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataFromApi = async loanId => {
    try {
      const guarantorApiResponse = await guarantorGetAPI(loanId);
      if (guarantorApiResponse?.status_code == 200) {
        setGuarantorInfo({ guarantors: [guarantorApiResponse.data] });
        reset({ guarantors: [guarantorApiResponse.data] });
      } else {
        showToast(guarantorApiResponse.status_message, {
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

  const onSubmit: SubmitHandler<GuarantorType> = async data => {
    setIsLoading(true);
    let isValidStay = true;
    data.guarantors.forEach(guarantor => {
      //first submission//first date ranges 's end date and last date range's start_date difference greater than 3 year
      if (!guarantor?.stay_validated) {
        const lastStayDetails = guarantor.stay[guarantor.stay.length - 1];
        const firstStayDetails = guarantor.stay[0];
        if (
          dayjs(firstStayDetails.end_date).diff(
            dayjs(lastStayDetails.start_date),
            'year'
          ) < 3
        ) {
          isValidStay = false;
          setIsLoading(false);
          showToast(
            `Please fill Stay details from 3 years before to current date for ${guarantor?.title} ${guarantor?.first_name}`,
            { type: NotificationType.Error }
          );
        }
      }
    });

    if (!isValidStay) return;
    try {
      data.guarantors.flatMap(dir =>
        dir.stay.map(stay => {
          stay.start_date = convertDateString(stay.start_date);
          stay.end_date = convertDateString(stay.end_date);
          return stay;
        })
      );

      const response = await guarantorPostAPI(data.guarantors[0], loanId);

      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        updateFilledForms(loanId, {
          complete_guarantor: true
        });
        setTimeout(() => {
          dispatch(updateCurrentStage(8));
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

  const onError: SubmitErrorHandler<GuarantorType> = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
    setGuarantorError(error);
  };

  const [dateRanges, setDateRanges] = useState();
  return (
    <StayContext.Provider
      value={{
        dateRanges: dateRanges,
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
          className="mt-2 px-4"
        >
          {guarantorInfo?.guarantors?.map((guarantor, index) => (
            <Partner
              currentDirectorIndex={index}
              currentDirector={guarantor}
              fieldRenderer={fieldRenderer}
              partnerType="guarantors"
              PartnerError={guarantorError}
            />
          ))}
        </form>
      </FormProvider>
    </StayContext.Provider>
  );
};

export default Guarantor;
