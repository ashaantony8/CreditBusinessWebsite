import React from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { InputControllerProps } from '../../utils/types';

const InputController: React.FC<{ metaData: InputControllerProps }> = ({
  metaData
}) => {
  const {
    key,
    name,
    placeholder,
    type,
    isRequired = false,
    defaultValue,
    isDisabled = false,
    labelClass = '',
    errorClass = 'text-red-500 text-[10px]  my-1',
    fieldClass = ' ',
    isReadOnly = false,
    // wrapperClass = "flex flex-col mb-4 relative",
    min,
    max,
    icon,
    isFractional = false,
    events
  } = metaData;

  const {
    control,
    formState: { errors },
    setValue,
    trigger
  } = useFormContext();

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }

  return (
    <div className="rounded-lg bg-white">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div className="relative bg-inherit">
            {icon && (
              <span className="absolute bottom-3 left-1 px-1 text-[#737373]">
                {icon()}
              </span>
            )}
            <input
              key={key}
              id={name}
              {...field}
              placeholder=" "
              type={type}
              disabled={isDisabled}
              className={`${fieldClass} ${!isDisabled && 'border-[#1a459a33]'} ${fieldError && 'border-2 border-red-500'}`}
              min={min}
              max={max}
              readOnly={isReadOnly}
              step={isFractional ? 'any' : '1'}
              onChange={e => {
                setValue(name, e.target.value);
                trigger(name);
              }}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              {...events}
            />

            <label htmlFor={name} className={`${labelClass} `}>
              {placeholder}
              {isRequired && <span className="text-red-500">{' *'}</span>}
            </label>
          </div>
        )}
      />
      {fieldError && (
        <p className={errorClass}>
          {fieldError ? (fieldError as FieldError)?.message : ''}
        </p>
      )}
    </div>
  );
};

export default InputController;
