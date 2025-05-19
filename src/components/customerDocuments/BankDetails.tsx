import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { IoCheckmark } from 'react-icons/io5';
import { PiFilesLight } from 'react-icons/pi';

import {
  bankDetailsPostApi,
  gocardlessBankListApi
} from '../../api/loanServices';
import {
  loanFormBankDetails,
  loanFormCommonStyleConstant
} from '../../utils/constants';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { BankDetailsSchema } from '../../utils/Schema';
import { fileControllerProps } from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';

const BankDetails = ({ setIsBankDetailsAdded, loanId }) => {
  const { showToast } = useToast();

  const fieldRenderer = new FieldRenderer(
    loanFormBankDetails,
    loanFormCommonStyleConstant,
    BankDetailsSchema
  );

  const methods = useForm({
    resolver: yupResolver(BankDetailsSchema),
    defaultValues: {
      country_code: 'GB'
    }
  });
  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors }
  } = methods;

  const [bankList, setBankList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loanId) {
      fetchBankList();
    }
  }, [loanId]);

  const fetchBankList = async () => {
    setIsLoading(true);
    try {
      const { status_code, status_message, data } =
        await gocardlessBankListApi();
      if (status_code >= 200 && status_code < 300) {
        setBankList(data);
      } else {
        showToast(status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error fetching bank list:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      // setResultData([...resultData, data]);
      const formData = new FormData();
      if (data?.country_code) {
        formData.append('bank_country_code', data?.country_code);
      }
      if (data?.account_holder_name) {
        formData.append('account_holder_name', data?.account_holder_name);
      }
      if (data?.sort_code) {
        formData.append('bank_sort_code', data?.sort_code);
      }
      if (data?.account_number) {
        formData.append('bank_account_number', data?.account_number);
      }
      if (data?.bank_name) {
        formData.append('bank_name', data?.bank_name);
      }
      if (data?.business_account_statements) {
        data?.business_account_statements.forEach(file => {
          formData.append('business_account_statements', file);
        });
      }

      const response = await bankDetailsPostApi(formData, loanId);
      if (response.status_code >= 200 && response.status_code < 300) {
        setIsBankDetailsAdded(prevState => !prevState);
        showToast(response.status_message, { type: NotificationType.Success });
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    } finally {
      reset(); // reset form after submit
      setTimeout(() => {
        setIsLoading(false); // Reset loading state when done submitting
      }, 1500);
    }
  };

  const onError = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
  };

  const watchBusinessAccountStatement = watch(
    'business_account_statements',
    null
  );

  const FileUploadOption = ({ name, item, handleFileUpload, errors }) => (
    <div
      className={`flex w-full items-center justify-center ${
        errors[name] && 'border-red-500'
      }`}
    >
      <label
        className={`flex h-32 w-full flex-col border-[2px] border-dashed border-[#B7B7B7] ${
          errors[name] && 'border-red-500'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-7">
          <input
            type="file"
            multiple={
              (
                loanFormBankDetails.find(
                  i => i.type === 'file' && i.name === item.name
                ) as fileControllerProps
              ).isMultiple
            }
            accept={
              (
                loanFormBankDetails.find(
                  i => i.type === 'file' && i.name === item.name
                ) as fileControllerProps
              ).memTypes
            }
            onChange={e => handleFileUpload(e, item)}
            className="hidden"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 ${
              errors[name] ? 'text-red-500' : 'text-[#1A439A]'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600"></p>
          <p
            className={`text-[12px] ${
              errors[name] ? 'text-red-500' : 'text-[#1A449A]'
            } max-sm:text-[9px]`}
          >
            {'Upload Document'}
            {/* <a className="text-black"> or drag and drop </a> */}
          </p>
        </div>
      </label>
    </div>
  );

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
    // item: FundingFormFieldType
  ) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files); // Convert FileList to array
      setValue('business_account_statements', fileList); // Set the value to an array of files
      // setIsOpenIndex(-1);
      trigger('business_account_statements');
    }
  };

  const handleClose = (itemName, fileName, fileId) => {
    const values = watchBusinessAccountStatement;

    if (Array.isArray(values)) {
      if (typeof fileId === 'number') {
        values.splice(fileId, 1);
      } else {
        setValue(
          'business_account_statements',
          values.filter(file => file.name !== fileName)
        );
      }
    }

    setValue(itemName, values);
    trigger(itemName);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mt-2 px-4 max-sm:px-1"
      >
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Loader />
          </div>
        )}
        <div className="container mx-auto border bg-white p-4">
          <div className="grid grid-cols-1 gap-4 p-2">
            <div className="">
              {fieldRenderer.renderField(['bank_name'], {
                options: bankList.map(item => item.name)
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-2">
            <div className="">
              {fieldRenderer.renderField(['account_number'])}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-2">
            <div className="">{fieldRenderer.renderField(['sort_code'])}</div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-2">
            <div className="">
              {fieldRenderer.renderField(['account_holder_name'])}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-2">
            <div className="">
              {fieldRenderer.renderField(['country_code'])}
            </div>
          </div>

          {loanFormBankDetails.map((item, index) => {
            // Check if the item is "document_upload_self_declaration"
            if (item.name !== 'business_account_statements') {
              return null; // Skip rendering this item
            }

            return (
              <div className="w-full p-2" key={index}>
                <div
                  className={`accordion-title flex cursor-pointer justify-between py-2 ${
                    watchBusinessAccountStatement &&
                    watchBusinessAccountStatement.length > 0
                      ? errors?.[item?.name]
                        ? 'text-[#F44336]'
                        : 'border border-[#50C878] bg-[#EAF8EE] text-[#00CC08]'
                      : ''
                  } ${
                    // true // isOpenIndex === index
                    //   ? "border-t border-l  rounded-t-lg   border-r  mt-1"
                    //   : "border rounded-lg"

                    'mt-1 rounded-t-lg border-l border-r border-t'
                  }`}
                  onClick={() => {
                    // toggleAccordion(index);
                    // setIsOpenIndex(isOpenIndex === index ? null : index);
                  }}
                >
                  <span className="accordion flex gap-2 p-3.5 text-[14px] font-medium">
                    <div className="text-gray-400">
                      {item.icon && item.icon()}
                    </div>
                    <label>
                      {item.label}{' '}
                      {item.isRequired && (
                        <span className="text-red-500">{' *'}</span>
                      )}
                    </label>
                  </span>
                  {watchBusinessAccountStatement &&
                    watchBusinessAccountStatement.length > 0 &&
                    !errors?.[item?.name] && (
                      <span className="accordion-tick p-4">
                        <IoCheckmark />
                      </span>
                    )}
                </div>

                <div className="accordion-content rounded-b-lg border border-t-0 bg-white py-1">
                  <div className="flex flex-wrap gap-6 p-4 text-[12px] font-normal text-[#929292]">
                    {Array.isArray(watchBusinessAccountStatement) &&
                    watchBusinessAccountStatement.length > 0 ? (
                      watchBusinessAccountStatement.map((file, fileId) => {
                        return (
                          <span
                            key={fileId}
                            className="flex items-center gap-1"
                          >
                            <PiFilesLight
                              size={28}
                              color={
                                errors?.[item?.name]?.[fileId]
                                  ? '#F44336'
                                  : '#00CC08'
                              }
                            />
                            <span
                              className={
                                errors?.[item?.name]?.[fileId]
                                  ? 'text-red-500'
                                  : 'text-[#00CC08]'
                              }
                            >
                              {file.name}
                            </span>
                            <a
                              onClick={() =>
                                handleClose(item.name, file.name, fileId)
                              }
                            >
                              <IoMdClose
                                color="#000000"
                                className="font-medium"
                              />
                            </a>
                          </span>
                        );
                      })
                    ) : (
                      <FileUploadOption
                        name={item.name}
                        item={item}
                        handleFileUpload={handleFileUpload}
                        errors={errors}
                      />
                    )}
                  </div>
                </div>

                {Array.isArray(errors['business_account_statements']) ? (
                  <div className={loanFormCommonStyleConstant.file.errorClass}>
                    <p className="mb-[12px] border-b-2 border-red-500"></p>
                    <p>
                      {errors['business_account_statements'][0].message}
                    </p>{' '}
                    {/* Error message */}
                  </div>
                ) : (
                  errors[item.name] && (
                    <div
                      className={loanFormCommonStyleConstant.file.errorClass}
                    >
                      <p className="mb-[12px] border-b-2 border-red-500"></p>
                      <p>{errors[item.name].message}</p> {/* Error message */}
                    </div>
                  )
                )}
              </div>
            );
          })}

          <div className="grid grid-cols-1 gap-4 p-2">
            <button
              type="submit"
              className="bg-[#1A439A] px-5 py-3 font-medium uppercase text-white"
            >
              {'Add Bank Account'}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default BankDetails;
