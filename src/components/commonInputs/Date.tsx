import 'react-datepicker/dist/react-datepicker.css';

import React from 'react';
import DatePicker from 'react-datepicker';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { DateControllerProps } from '../../utils/types';

const DateController: React.FC<{ metaData: DateControllerProps }> = ({
  metaData
}) => {
  const {
    name,
    // label,
    placeholder,
    // type,
    isRequired = false,
    defaultValue,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500 text-[10px]  my-1',
    fieldClass = 'border p-2',
    // wrapperClass = "flex flex-col mb-4 ",
    min,
    max,
    excludeDateIntervals,
    icon,
    filterDates
  } = metaData;
  const { showToast } = useToast();

  const {
    control,
    formState: { errors },
    setValue,
    clearErrors,
    trigger
  } = useFormContext();
  // const fieldError = {message:"test messge"};

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return (
    <div className="rounded-lg bg-white">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
          field.value = field?.value ? new Date(field?.value) : field.value;
          return (
            <div className="relative bg-inherit">
              {icon && (
                <span className="absolute bottom-3 left-1 px-1 text-[#737373]">
                  {icon()}
                </span>
              )}
              <DatePicker
                {...field}
                selected={field.value}
                disabled={isDisabled}
                className={`${fieldClass} border-2 focus:outline-0 ${!isDisabled && 'border-[#1a459a33]'} peer focus-within:border-[#1A449A] ${
                  fieldError && 'border-2 border-red-500'
                }`}
                minDate={min}
                maxDate={max}
                peekNextMonth
                excludeDateIntervals={excludeDateIntervals}
                wrapperClassName="w-full "
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onChange={date => {
                  const selectedDate = new Date(date);
                  if (
                    name === 'start_trading_date' &&
                    selectedDate > sixtyDaysAgo
                  ) {
                    showToast(
                      'The start trading date must be at least 60 days ago.!',
                      { type: NotificationType.Error }
                    );
                    field.onChange(null);
                  } else {
                    clearErrors(name);
                    setValue(name, new Date(date));
                  }
                  trigger(name);
                }}
                filterDate={filterDates}
              />

              <label htmlFor={name} className={`${labelClass} `}>
                {placeholder}
                {isRequired && <span className="text-red-500">{' *'}</span>}
              </label>
            </div>
          );
        }}
      />

      {fieldError && (
        <p className={errorClass}>
          {fieldError ? (fieldError as FieldError)?.message : ''}
        </p>
      )}
    </div>
  );
};

export default DateController;
