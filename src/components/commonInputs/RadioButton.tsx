import React from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { RadioButtonControllerProps } from '../../utils/types';

const RadioButtonController: React.FC<{
  metaData: RadioButtonControllerProps;
}> = ({ metaData }) => {
  const {
    name,
    label,
    // isRequired = false,
    isDisabled = false,
    options,
    icon,
    labelClass = 'mb-2',
    errorClass = 'text-red-500',
    fieldClass = 'mr-4',
    wrapperClass = 'flex mb-4',
    optionLabelClass = 'flex mb-4 '
  } = metaData;

  const {
    control,
    formState: { errors },
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

  return (
    <>
      <div
        className={`${wrapperClass} ${
          fieldError && 'w-[100%] border-b-2 border-red-500 text-red-500'
        }`}
      >
        <label htmlFor={name} className={labelClass}>
          <span>{icon && icon()}</span>
          {label}

          {/* {isRequired && <span style={{ color: "red" }}> *</span>} */}
        </label>
        <div className={optionLabelClass}>
          {options?.map((option, index) => (
            <label
              key={index}
              htmlFor={`${name}-${index}`}
              className={fieldClass}
            >
              <Controller
                name={name}
                control={control}
                // defaultValue={option}
                render={({ field }) => (
                  <input
                    type="radio"
                    id={`${name}-${index}`}
                    name={name}
                    value={option}
                    checked={field.value === option}
                    onChange={e => {
                      field.onChange(e.target.value);
                      trigger(name);
                    }}
                    disabled={isDisabled}
                  />
                )}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      {fieldError && (
        <p className={errorClass}>
          {fieldError ? (fieldError as FieldError)?.message : ''}
        </p>
      )}
    </>
  );
};

export default RadioButtonController;
