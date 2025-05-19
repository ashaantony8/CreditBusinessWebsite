import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { useDispatch } from 'react-redux';

import {
  marketPreferenceGetAPI,
  marketPreferencePostAPI
} from '../../api/loanServices';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import {
  loanFormCommonStyleConstant,
  loanFormMarketingPreferences
} from '../../utils/constants';
import { updateFilledForms } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { MarketingPreferencesSchema } from '../../utils/Schema';
import {
  LoanFromCommonProps,
  MarketingPreferencesType
} from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';

const MarketingPreferences: React.FC<LoanFromCommonProps> = ({
  setRef,
  loanId = null
}) => {
  const { authenticated } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);
  const { showToast } = useToast();

  const fieldRenderer = new FieldRenderer(
    loanFormMarketingPreferences,
    loanFormCommonStyleConstant,
    MarketingPreferencesSchema
  );

  const dispatch = useDispatch();
  const [marketPreference, setMarketPreference] = useState<
    Partial<MarketingPreferencesType>
  >({});

  const methods = useForm({
    resolver: yupResolver(MarketingPreferencesSchema),
    defaultValues: marketPreference
  });
  const { handleSubmit, reset } = methods;
  const [isLoading, setIsLoading] = useState(false);

  const fetchDataFromApi = async loanId => {
    try {
      const marketPreferenceApiResponse = await marketPreferenceGetAPI(loanId);
      if (marketPreferenceApiResponse?.status_code == 200) {
        setMarketPreference(marketPreferenceApiResponse.data);

        reset(marketPreferenceApiResponse.data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (authenticated && loanId) {
      fetchDataFromApi(loanId);
    }
  }, [loanId]);

  const onSubmit: SubmitHandler<MarketingPreferencesType> = async data => {
    setIsLoading(true);
    try {
      const response = await marketPreferencePostAPI(data, loanId);
      if (response.status_code >= 200 && response.status_code < 300) {
        // dispatch(updateMarketPreference(data));
        showToast(response.status_message, { type: NotificationType.Success });
        updateFilledForms(loanId, {
          complete_marketing_preference: true
        }); // update filled forms
        setTimeout(() => {
          dispatch(updateCurrentStage(6));
        }, 1500);
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

  const onError: SubmitErrorHandler<MarketingPreferencesType> = error => {
    console.log('error', error);
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
        className="space-y-6 p-6"
      >
        <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
          {fieldRenderer.renderField(['receiving_marketing_info'])}
        </div>
        <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
          {fieldRenderer.renderField(['sending_marketing_information'])}
        </div>
        <div className="grid grid-cols-1 gap-4 rounded-lg border p-2">
          {fieldRenderer.renderField(['third_party_sharing'])}
        </div>
      </form>
    </FormProvider>
  );
};

export default MarketingPreferences;
