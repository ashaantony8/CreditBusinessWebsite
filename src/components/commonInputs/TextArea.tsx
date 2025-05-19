import React from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { TextAreaControllerProps } from '../../utils/types';

const TextAreaController: React.FC<{ metaData: TextAreaControllerProps }> = ({
  metaData
}) => {
  const {
    name,
    // label,
    placeholder,
    rows = 4,
    isRequired = false,
    defaultValue,
    isDisabled = false,
    labelClass = 'mb-2',
    errorClass = 'text-red-500',
    fieldClass = 'border p-2',
    // wrapperClass = "flex flex-col mb-4 ",
    icon
  } = metaData;

  const {
    control,
    formState: { errors }
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
            <textarea
              {...field}
              id={name}
              placeholder=""
              disabled={isDisabled}
              className={`${fieldClass} ${
                fieldError && 'border-2 border-red-500'
              }`}
              rows={rows}
            />
            {icon && (
              <div className="pointer-events-none absolute left-2 top-5 h-4 w-4 -translate-y-1/2 transform text-gray-500">
                {icon()}
              </div>
            )}
            <label htmlFor={name} className={` ${labelClass}`}>
              {placeholder}{' '}
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

export default TextAreaController;
