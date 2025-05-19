import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { postAffordabilityApi } from '../../../api/loanServices';
import { updateCurrentStage } from '../../../store/fundingStateReducer';
import {
  affordabilityApprovalFields,
  fieldClass,
  labelClass
} from '../../../utils/constants';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { affordabilityApprovalSchema } from '../../../utils/Schema';
import InputController from '../../commonInputs/Input';
import Loader from '../../Loader';

// Type for individual form fields
type AffordabilityApprovalField = {
  key: string;
  label: string;
  type: 'number' | 'text' | 'email' | 'tel' | 'range' | 'password' | 'date';
  autoFilled: boolean;
};

// Type for the form data
type FormData = {
  [key: string]: string | number; // Modify as needed to match the actual field types
};

// Component props type
type AffordabilityApprovalFormProps = {
  data: AffordabilityApprovalField; // Use the generated type for `data`
  loanId: string;
  setRef: (ref: React.RefObject<HTMLFormElement>) => void;
};
const AffordabilityApprovalForm = ({
  data,
  loanId,
  setRef
}: AffordabilityApprovalFormProps) => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);

  const methods = useForm<FormData>({
    resolver: yupResolver(affordabilityApprovalSchema)
  });

  const { setValue, handleSubmit } = methods;

  const setData = useCallback(() => {
    affordabilityApprovalFields.forEach((field: AffordabilityApprovalField) => {
      const value = data[field.key];
      if (field.type === 'number') {
        setValue(field.key, parseInt(value, 10));
      } else {
        setValue(field.key, value);
      }
    });
  }, [data, setValue]);

  const dispatch = useDispatch();

  // Form submission handler
  const onSubmit: SubmitHandler<FormData> = async formData => {
    setIsLoading(true);
    try {
      const response = await postAffordabilityApi(formData, loanId);

      if (response?.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });

        setTimeout(() => {
          dispatch(updateCurrentStage(11));
        }, 1500);
      } else {
        console.log('error', response.status_message);
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  // Effect to populate the form when data changes
  useEffect(() => {
    if (data) setData();
  }, [data, setData]);

  return (
    <div className="h-[70vh] overflow-auto max-lg:h-[60vh]">
      <p className="mb-4 px-[2%] text-[20px] font-semibold text-[#02002E]">
        {'Affordability Approval'}
      </p>
      <FormProvider {...methods}>
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <div className="max-sm:cols-1 grid grid-cols-3 gap-4 p-[2%] max-lg:grid-cols-1 max-sm:justify-center">
            {affordabilityApprovalFields.map(
              (field: AffordabilityApprovalField, index) => (
                <InputController
                  key={index}
                  metaData={{
                    fieldClass: `${fieldClass} ${field.autoFilled && 'bg-gray-200 text-gray-500 cursor-not-allowed'}`,
                    labelClass: labelClass,
                    key: field.key,
                    placeholder: field.label,
                    isRequired: !field.autoFilled,
                    name: field.key,
                    label: field.label,
                    type: field?.type,
                    isFractional: true,
                    isDisabled: field.autoFilled
                  }}
                />
              )
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AffordabilityApprovalForm;
