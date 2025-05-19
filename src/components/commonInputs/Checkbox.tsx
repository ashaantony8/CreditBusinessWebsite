import React from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { CheckBoxControllerProps } from '../../utils/types';

const CheckBoxController: React.FC<{ metaData: CheckBoxControllerProps }> = ({
  metaData
}) => {
  const {
    name,
    label,
    placeholder,
    type,
    isRequired = false,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500',
    fieldClass = 'border p-2',
    wrapperClass = 'flex mb-4 ',
    onChange
  } = metaData;

  const {
    control,
    formState: { errors },
    trigger
  } = useFormContext();

  const isError = errors[name];

  let fieldError = null;
  try {
    fieldError = Object.keys(errors).length > 0 && eval(`errors.${name}`);
  } catch (error) {
    console.log(error);
    fieldError = null;
  }
  //const fieldError = {message:"test messge"};
  return (
    <>
      <div
        className={`${wrapperClass} ${
          fieldError && 'w-[100%] border-b-2 border-red-500'
        }`}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              defaultChecked={field.value}
              placeholder={placeholder}
              type={type}
              onClick={e => {
                const target = e.target as HTMLInputElement;
                if (onChange) {
                  onChange(target.checked);
                }
                field.onChange(target.checked);
                trigger(name);
              }}
              disabled={isDisabled}
              className={fieldClass}
            />
          )}
        />
        <label htmlFor={name} className={labelClass}>
          {label} {isRequired && <span style={{ color: 'red' }}>{' *'}</span>}
        </label>
      </div>
      {errors[name] && (
        <p className={errorClass}>
          {isError ? (errors[name] as FieldError)?.message : ''}
        </p>
      )}
    </>
  );
};

export default CheckBoxController;
