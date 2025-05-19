import React from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { fileControllerProps } from '../../utils/types';

const FileInputController: React.FC<{ metaData: fileControllerProps }> = ({
  metaData
}) => {
  const {
    key,
    name,
    label,
    isRequired = false,
    isMultiple = false,
    fieldClass = 'border p-2',
    labelClass = 'mb-2',
    errorClass = 'text-red-500',
    wrapperClass = 'flex flex-col mb-4 '
  } = metaData;

  const {
    control,
    formState: { errors },
    trigger
  } = useFormContext();

  return (
    <div className={wrapperClass}>
      <label htmlFor={name} className={labelClass}>
        {label} {isRequired && <span className="text-red-500">{' *'}</span>}
      </label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <input
              id={key}
              key={key}
              {...field}
              onChange={event => {
                const files = event.target.files;
                if (isMultiple) {
                  field.onChange(() => {
                    trigger(name);
                    return [...files];
                  });
                } else {
                  field.onChange(() => {
                    trigger(name);
                    return files[0];
                  });
                }
              }}
              type="file"
              multiple={isMultiple}
              accept="image/jpeg,image/png,application/pdf"
              className={fieldClass}
            />
          );
        }}
      />

      {errors[name] && (
        <p className={errorClass}>{(errors[name] as FieldError)?.message}</p>
      )}
    </div>
  );
};

export default FileInputController;
