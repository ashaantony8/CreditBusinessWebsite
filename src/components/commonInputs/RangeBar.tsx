import React, { useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { RangeControllerProps } from '../../utils/types';

const RangeController: React.FC<{ metaData: RangeControllerProps }> = ({
  metaData
}) => {
  const {
    key,
    name,
    label,
    placeholder,
    type,
    isRequired = false,
    defaultValue,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500',
    fieldClass = 'border p-2',
    wrapperClass = 'flex flex-col mb-4 ',
    min,
    max,
    icon,
    showInput = false,
    isDecimal = false
  } = metaData;

  const {
    control,
    formState: { errors },
    setValue,
    trigger
  } = useFormContext();
  const [range, setRange] = useState<number | string>(min || 0);
  const { showToast } = useToast();

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }

  return (
    <div className="relative">
      <div className={wrapperClass}>
        <label htmlFor={name} className={labelClass}>
          {label} {isRequired && <span className="text-red-500">{' *'}</span>}
        </label>
        <a className="top-4 text-[12px] text-[#1A439A]">
          {'£ '}
          {range}
        </a>
        {icon && icon()}
        <div className="flex items-center">
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || min}
            render={({ field }) => {
              field.value = field.value || min;
              setRange(field.value);
              return (
                <>
                  <input
                    key={key}
                    {...field}
                    placeholder={placeholder}
                    type={type}
                    disabled={isDisabled}
                    min={min}
                    max={max}
                    className={`mr-2 ${fieldClass} w-full appearance-none rounded-full ${
                      fieldError ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                    onChange={e => {
                      const value = isDecimal
                        ? parseFloat(e.target.value)
                        : Math.floor(Number(e.target.value));
                      setValue(name, value);
                      setRange(value);
                      trigger(name);
                    }}
                    style={{
                      background: fieldError
                        ? `linear-gradient(to right, red 0%, red ${
                            ((field.value - min) / (max - min)) * 100
                          }%, red 100%)`
                        : `linear-gradient(to right, #1A439A 0%, #1A439A ${
                            ((field.value - min) / (max - min)) * 100
                          }%, #ADADAD ${
                            ((field.value - min) / (max - min)) * 100
                          }%, #ADADAD 100%)`
                    }}
                  />

                  {showInput && (
                    // <input
                    //   type={isDecimal ? "number" : "integer"}
                    //   value={range}
                    //   min={min}
                    //   max={max}
                    //   disabled={isDisabled}
                    //   className="border p-2 w-20 ml-2 text-center"
                    //   onChange={(e) => {
                    //     const value = isDecimal
                    //       ? Math.min(Math.max(parseFloat(e.target.value), min), max)
                    //       : Math.min(Math.max(Math.floor(Number(e.target.value)), min), max); // Ensure it’s a number
                    //     setValue(name, value);
                    //     setRange(value);
                    //     trigger(name);
                    //   }}
                    // />
                    <input
                      type={isDecimal ? 'number' : 'text'}
                      disabled={isDisabled}
                      value={range}
                      className="ml-2 w-20 border p-2 text-center"
                      onChange={e => {
                        const value = isDecimal
                          ? parseFloat(e.target.value)
                          : Math.floor(Number(e.target.value));
                        setValue(name, value);
                        setRange(value);
                      }}
                      onBlur={e => {
                        // Validate on blur to ensure it's >= 1000 after user is done typing
                        const value = isDecimal
                          ? parseFloat(e.target.value)
                          : Math.floor(Number(e.target.value));
                        if (
                          name === 'average_weekly_card_sales' &&
                          value < 1000
                        ) {
                          showToast('Range should start from 1000', {
                            type: NotificationType.Error
                          });
                          // Show validation message
                          setValue(name, 1000);
                          setRange(1000);
                        } else if (
                          name === 'average_monthly_turnover' &&
                          value < 4000
                        ) {
                          showToast('Range should start from 4000', {
                            type: NotificationType.Error
                          });
                          setValue(name, 4000);
                          setRange(4000);
                        }
                        trigger(name);
                      }}
                    />
                  )}
                </>
              );
            }}
          />
        </div>
        <style>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 1rem;
            height: 1rem;
            background-color: #ffffff;
            border: 1px solid #1a439a;
            border-radius: 50%;
          }
        `}</style>
      </div>

      {fieldError && (
        <p className={errorClass}>
          {fieldError ? (fieldError as FieldError)?.message : ''}
        </p>
      )}
    </div>
  );
};

export default RangeController;
