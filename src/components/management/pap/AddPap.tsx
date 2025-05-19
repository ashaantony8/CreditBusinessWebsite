import { yupResolver } from '@hookform/resolvers/yup';
import {
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday
} from 'date-fns';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';

import {
  loanFormCommonStyleConstant,
  PapPlanFields
} from '../../../utils/constants';
import { dynamicPlanFieldsSchema } from '../../../utils/Schema';
import DateController from '../../commonInputs/Date';
import FieldRenderer from '../../commonInputs/FieldRenderer';
import Loader from '../../Loader';

const AddPap = ({ toggleModal, methods, pendingAmount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fieldRenderer = new FieldRenderer(
    PapPlanFields,
    loanFormCommonStyleConstant,
    dynamicPlanFieldsSchema
  );

  const dynamicPlanMethods = useForm({
    resolver: yupResolver(dynamicPlanFieldsSchema)
  });

  const {
    handleSubmit,
    watch,
    formState: { errors }
  } = dynamicPlanMethods;

  const onSubmit = data => {
    setIsLoading(true);
    const currentDynamicPlanFields =
      methods.getValues('adjustment_plans') || [];
    data.total_amount_collected = data.amount * data.no_of_installments;
    if (data.total_amount_collected > pendingAmount) {
      setError(
        'Exceeds pending amount , please check installments and amount entered !!'
      );
      setIsLoading(false);
      return;
    }

    const updatedDynamicPlanFields = [...currentDynamicPlanFields, data];

    methods.setValue('adjustment_plans', updatedDynamicPlanFields, {
      shouldValidate: true
    });
    setTimeout(() => {
      setIsLoading(false);
      toggleModal();
    }, 1000);
  };

  const onError = error => {
    console.log('error', error);
  };

  const dayFunctionMap = {
    monday: isMonday,
    tuesday: isTuesday,
    wednesday: isWednesday,
    thursday: isThursday,
    friday: isFriday,
    saturday: isSaturday,
    sunday: isSunday
  };

  const watchDynamicPlanFields = watch();

  const filterDates = date => {
    const dayFunction =
      dayFunctionMap[watchDynamicPlanFields.day_of_debit?.toLowerCase()];
    return dayFunction ? dayFunction(date) : false;
  };

  useEffect(() => {
    console.log(errors, 'errors');
  }, [errors]);

  return (
    <FormProvider {...dynamicPlanMethods}>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
      >
        {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
        <div className="relative w-full max-w-md md:h-auto">
          <div className="relative bg-white px-2 shadow">
            <div className="flex justify-end px-4 pt-6">
              <p className="my-1 text-[15px] font-medium">
                {'Add Plan Adjustment'}
              </p>
              <button
                onClick={toggleModal}
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
              >
                <RxCross2 size={24} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="px-4 pb-6 text-[#000000]"
            >
              <div className="grid grid-cols-1 gap-4 p-2">
                {fieldRenderer.renderField('day_of_debit')}
              </div>
              <div className="grid grid-cols-1 gap-4 p-2">
                {fieldRenderer.renderField('amount')}
              </div>
              <div className="grid grid-cols-1 gap-4 p-2">
                <DateController
                  key="start_date"
                  metaData={{
                    fieldClass: loanFormCommonStyleConstant.date.fieldClass,
                    labelClass: loanFormCommonStyleConstant.date.labelClass,
                    placeholder: 'Day of Debit',
                    isRequired: true,
                    name: `start_date`,
                    label: 'Day of Debit',
                    type: 'date',
                    min: new Date(),
                    filterDates: filterDates
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 p-2">
                {fieldRenderer.renderField('no_of_installments')}
              </div>
              <div>
                {error ? (
                  <p className="text-[12px] text-[tomato]">{error}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-4 py-2">
                <input
                  type="submit"
                  value="SUBMIT"
                  className="w-full rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-blue-800"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default AddPap;
