import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { IoCheckmark } from 'react-icons/io5';
import { PiFilesLight } from 'react-icons/pi';
import { useDispatch } from 'react-redux';

import {
  documentUploadGetAPI,
  documentUploadPostAPI
} from '../../api/loanServices';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import {
  declarationCheckboxStyle,
  loanFormCommonStyleConstant,
  loanFormDocumentationUploads
} from '../../utils/constants';
import { fetchAndConvertFiles, updateFilledForms } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { DocumentationUploadsSchema } from '../../utils/Schema';
import {
  DocumentationUploadsType,
  fileControllerProps,
  FundingFormFieldType,
  LoanFromCommonProps
} from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';

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
              loanFormDocumentationUploads.find(
                i => i.type === 'file' && i.name === item.name
              ) as fileControllerProps
            ).isMultiple
          }
          accept={
            (
              loanFormDocumentationUploads.find(
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

const DocumentationUploads: React.FC<LoanFromCommonProps> = ({
  setRef,
  loanId = null
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);
  // const { documentationUploads } = useSelector(loanFormSliceSelector);
  const fieldRenderer = new FieldRenderer(
    loanFormDocumentationUploads,
    loanFormCommonStyleConstant,
    DocumentationUploadsSchema
  );
  const [personalInfo, setPersonalInfo] = useState<
    Partial<DocumentationUploadsType>
  >({});

  const { authenticated } = useAuth();
  const [isOpenIndex, setIsOpenIndex] = useState(-1);

  const [loading, setLoading] = useState(false);

  const toggleAccordion = (index: number) => {
    setIsOpenIndex(isOpenIndex === index ? -1 : index);
  };

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const methods = useForm({
    resolver: yupResolver(DocumentationUploadsSchema),
    defaultValues: personalInfo
  });
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = methods;

  console.log('errors', errors);

  const fetchDataFromUploadGetApi = async loanId => {
    try {
      const response = await documentUploadGetAPI(loanId);
      if (response.status_code >= 200 && response.status_code < 300) {
        const modifiedData = await fetchAndConvertFiles(response.data);
        setPersonalInfo(modifiedData);
        reset(modifiedData);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
        console.error('Error fetching data from API:', response.error);
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (authenticated && loanId) {
      fetchDataFromUploadGetApi(loanId);
    }
  }, [loanId]);

  const onSubmit: SubmitHandler<DocumentationUploadsType> = async data => {
    setLoading(true);

    try {
      const formData = new FormData();
      if (data?.photo?.[0]) {
        formData.append('photo', data?.photo?.[0]);
      }
      if (data?.passport?.[0]) {
        formData.append('passport', data?.passport?.[0]);
      }
      if (data?.driving_license?.[0]) {
        formData.append('driving_license', data?.driving_license?.[0]);
      }
      if (data?.utility_bill?.[0]) {
        formData.append('utility_bill', data?.utility_bill?.[0]);
      }
      if (data?.council_tax?.[0]) {
        formData.append('council_tax', data?.council_tax?.[0]);
      }
      if (data?.lease_deed?.[0]) {
        formData.append('lease_deed', data?.lease_deed?.[0]);
      }
      // if (data?.business_account_statements) {
      //   data?.business_account_statements.forEach((file) => {
      //     formData.append("business_account_statements", file);
      //   });
      // }
      if (data?.other_files) {
        data?.other_files.forEach(file => {
          formData.append('other_files', file);
        });
      }
      if (data?.document_upload_self_declaration) {
        formData.append(
          'document_upload_self_declaration',
          JSON.stringify(data?.document_upload_self_declaration)
        );
      }
      const response = await documentUploadPostAPI(formData, loanId);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        updateFilledForms(loanId, {
          complete_documents: true
        }); // update filled forms
        setTimeout(() => {
          dispatch(updateCurrentStage(7));
        }, 1500);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    } finally {
      setTimeout(() => {
        setLoading(false); // Reset loading state when done submitting
      }, 1500);
    }
  };

  const onError: SubmitErrorHandler<DocumentationUploadsType> = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
  };

  const watchPhoto = watch('photo', null);
  const watchPassport = watch('passport', null);
  const watchDrivingLicense = watch('driving_license', null);
  const watchCouncilTax = watch('council_tax', null);
  const watchUtilityBill = watch('utility_bill', null);
  const watchLeaseDeed = watch('lease_deed', null);
  // const watchBusinessAccountStatement = watch(
  //   "business_account_statements",
  //   null
  // );
  const watchOtherFiles = watch('other_files', null);
  const watchSelfDeclaration = watch('document_upload_self_declaration', null);

  useEffect(() => {}, [watchPhoto]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: FundingFormFieldType
  ) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files); // Convert FileList to array

      setValue(item.name as keyof DocumentationUploadsType, fileList); // Set the value to an array of files
      setIsOpenIndex(-1);

      trigger(item.name as keyof DocumentationUploadsType);
    }
  };

  const watchedFieldValues = {
    photo: watchPhoto,
    passport: watchPassport,
    driving_license: watchDrivingLicense,
    utility_bill: watchUtilityBill,
    council_tax: watchCouncilTax,
    lease_deed: watchLeaseDeed,
    // business_account_statements: watchBusinessAccountStatement,
    other_files: watchOtherFiles,
    document_upload_self_declaration: watchSelfDeclaration
  };

  const handleClose = (itemName, fileName, fileId) => {
    const values = watchedFieldValues[itemName];

    if (Array.isArray(values)) {
      if (typeof fileId === 'number') {
        values.splice(fileId, 1);
      } else {
        watchedFieldValues[itemName] = values.filter(
          file => file.name !== fileName
        );
      }
    }

    setValue(itemName, values);
    trigger(itemName);
  };

  return (
    <FormProvider {...methods}>
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mt-2 px-4"
      >
        {loanFormDocumentationUploads.map((item, index) => {
          // Check if the item is "document_upload_self_declaration"
          if (item.name === 'document_upload_self_declaration') {
            return null; // Skip rendering this item
          }

          return (
            <div className="w-full p-2" key={index}>
              <div
                className={`accordion-title flex cursor-pointer justify-between py-2 ${
                  watchedFieldValues[item.name] &&
                  watchedFieldValues[item.name].length > 0
                    ? errors?.[item?.name]
                      ? 'text-[#F44336]'
                      : 'border border-[#50C878] bg-[#EAF8EE] text-[#00CC08]'
                    : ''
                } ${
                  isOpenIndex === index
                    ? 'mt-1 rounded-t-lg border-l border-r border-t'
                    : 'rounded-lg border'
                }`}
                onClick={() => {
                  toggleAccordion(index);
                  setIsOpenIndex(isOpenIndex === index ? null : index);
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
                {watchedFieldValues[item.name] &&
                  watchedFieldValues[item.name].length > 0 &&
                  !errors?.[item?.name] && (
                    <span className="accordion-tick p-4">
                      <IoCheckmark />
                    </span>
                  )}
              </div>
              {isOpenIndex === index && (
                <div className="accordion-content rounded-b-lg border border-t-0 bg-white py-1">
                  <div className="flex flex-wrap gap-6 p-4 text-[12px] font-normal text-[#929292]">
                    {Array.isArray(watchedFieldValues[item.name]) &&
                    watchedFieldValues[item.name].length > 0 ? (
                      watchedFieldValues[item.name].map((file, fileId) => {
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
                              {file?.name}
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
              )}

              {Array.isArray(errors[item.name]) ? (
                <div className={loanFormCommonStyleConstant.file.errorClass}>
                  <p className="mb-[12px] border-b-2 border-red-500"></p>
                  <p>{errors[item.name][0].message}</p> {/* Error message */}
                </div>
              ) : (
                errors[item.name] && (
                  <div className={loanFormCommonStyleConstant.file.errorClass}>
                    <p className="mb-[12px] border-b-2 border-red-500"></p>
                    <p>{errors[item.name].message}</p> {/* Error message */}
                  </div>
                )
              )}
            </div>
          );
        })}
        <div className="p-2">
          <div className="col-span-full block w-full rounded-lg border border-[#1A439A] bg-[#F3F5FA] p-4 text-[12px] text-[#1A439A]">
            {fieldRenderer.renderField(
              'document_upload_self_declaration',
              declarationCheckboxStyle
            )}
          </div>
        </div>
        {loading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )}
      </form>
    </FormProvider>
  );
};
export default DocumentationUploads;
