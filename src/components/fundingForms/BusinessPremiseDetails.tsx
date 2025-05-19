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
  businessPremiseDetailsGetAPI,
  businessPremiseDetailsPostAPI
} from '../../api/loanServices';
import camera from '../../assets/svg/camera.svg';
import { updateCurrentStage } from '../../store/fundingStateReducer';
import {
  loanFormBusinessPremiseDetails,
  loanFormCommonStyleConstant
} from '../../utils/constants';
import {
  convertDateString,
  convertImageLinkToFile,
  lookUpAddressFormatter,
  updateFilledForms
} from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import useAuth from '../../utils/hooks/useAuth';
import { BusinessPremiseDetailsSchema } from '../../utils/Schema';
import {
  BusinessPremiseDetailsType,
  fileControllerProps,
  LoanFromCommonProps
} from '../../utils/types';
import FieldRenderer from '../commonInputs/FieldRenderer';
import Loader from '../Loader';
import AddressLookup from './AddressLookup';

const BusinessPremiseDetails: React.FC<LoanFromCommonProps> = ({
  setRef,
  loanId = null
}) => {
  const { authenticated } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  setRef(formRef);

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [businessPremiseDetails, setBusinessPremiseDetails] = useState<
    Partial<BusinessPremiseDetailsType>
  >({});

  const fieldRenderer = new FieldRenderer(
    loanFormBusinessPremiseDetails,
    loanFormCommonStyleConstant,
    BusinessPremiseDetailsSchema
  );
  const [registeredAddress, setRegisteredAddress] = useState(undefined);
  const [tradingAddress, setTradingAddress] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(BusinessPremiseDetailsSchema),
    defaultValues: businessPremiseDetails
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState,
    trigger,
    reset,
    getValues
  } = methods;

  const watchTradingAddressDoc = watch(
    'trading_address.document' as keyof BusinessPremiseDetailsType,
    []
  );

  const watchRegisteredAddressDoc = watch('registered_address.document', []);

  const watchedFieldValues = {
    'trading_address.document': watchTradingAddressDoc,
    'registered_address.document': watchRegisteredAddressDoc
  };

  const handleClose = (itemName, fileName) => {
    const file = watchedFieldValues[itemName].filter(
      word => word.name !== fileName
    );
    setValue(itemName, file);
  };

  // Helper function to convert leasehold document
  const convertLeaseholdDocument = async address => {
    try {
      if (address?.document) {
        const file = await convertImageLinkToFile(address?.document);
        address.document = [file];
      }
      return address;
    } catch (error) {
      throw new Error(error);
    }
  };

  const fetchDataFromApi = async (loanId: string) => {
    try {
      const BusinessPremiseDetailsApiResponse =
        await businessPremiseDetailsGetAPI(loanId);
      if (BusinessPremiseDetailsApiResponse?.status_code === 200) {
        const data = BusinessPremiseDetailsApiResponse.data;
        if (Object.keys(data)?.length > 0) {
          data.registered_address = {
            ...data.registered_address,
            ...data.registered_address?.leasehold
          };
          delete data.registered_address?.leasehold;
          data.trading_address = {
            ...data.trading_address,
            ...data.trading_address?.leasehold
          };
          delete data.trading_address?.leasehold;

          // Convert leasehold document for trading address and registered address
          const modifiedTradingAddress = await convertLeaseholdDocument(
            data.trading_address
          );
          const modifiedRegisteredAddress = await convertLeaseholdDocument(
            data.registered_address
          );

          // Update data with modified addresses
          const modifiedData = {
            ...data,
            trading_address: modifiedTradingAddress,
            registered_address: modifiedRegisteredAddress
          };
          // Set business premise details and reset form
          setBusinessPremiseDetails(modifiedData);
        }

        reset(BusinessPremiseDetailsApiResponse.data);
      } else {
        showToast(BusinessPremiseDetailsApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (authenticated && loanId) {
      fetchDataFromApi(loanId);
    }
  }, [loanId]);

  useEffect(() => {
    if (registeredAddress) {
      const lookedUpData = lookUpAddressFormatter(registeredAddress);
      setValue('registered_address.post_code', lookedUpData.pincode);
      setValue('registered_address.address_line', lookedUpData.addressText);
      trigger('registered_address.address_line');
    }
    if (tradingAddress) {
      const lookedUpData = lookUpAddressFormatter(tradingAddress);

      setValue(
        'trading_address.post_code' as keyof BusinessPremiseDetailsType,
        lookedUpData.pincode
      );

      setValue(
        'trading_address.address_line' as keyof BusinessPremiseDetailsType,
        lookedUpData.addressText
      );

      trigger(
        'trading_address.address_line' as keyof BusinessPremiseDetailsType
      );
    }
  }, [registeredAddress, tradingAddress]);

  const onSubmit: SubmitHandler<BusinessPremiseDetailsType> = async data => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (!data.trading_same_as_registered) {
        data.trading_same_as_registered = false;
      }
      formData.append(
        'registered_address.address_line',
        data.registered_address.address_line
      );
      formData.append(
        'registered_address.post_code',
        data.registered_address.post_code
      );
      formData.append(
        'registered_address.premise_type',
        data.registered_address.premise_type
      );
      formData.append(
        'trading_same_as_registered',
        JSON.stringify(data.trading_same_as_registered)
      );

      if (data?.registered_address?.premise_type === 'Leasehold') {
        formData.append(
          'registered_address.leasehold.start_date',
          convertDateString(data.registered_address.start_date)
        );
        formData.append(
          'registered_address.leasehold.end_date',
          convertDateString(data.registered_address.end_date)
        );
        formData.append(
          'registered_address.leasehold.document',
          data.registered_address.document[0]
        );
      }
      if (data.trading_same_as_registered === false) {
        formData.append(
          'trading_address.address_line',
          data.trading_address.address_line
        );
        formData.append(
          'trading_address.post_code',
          data.trading_address.post_code
        );
        formData.append(
          'trading_address.premise_type',
          data.trading_address.premise_type
        );
        if (data?.trading_address?.premise_type === 'Leasehold') {
          formData.append(
            'trading_address.leasehold.start_date',
            convertDateString(data.trading_address.start_date)
          );
          formData.append(
            'trading_address.leasehold.end_date',
            convertDateString(data.trading_address.end_date)
          );
          formData.append(
            'trading_address.leasehold.document',
            data.trading_address.document[0]
          );
        }
      }

      const response = await businessPremiseDetailsPostAPI(formData, loanId);
      if (response.status_code >= 200 && response.status_code < 300) {
        // dispatch(updateBusinessPremiseDetails(data));
        showToast(response.status_message, { type: NotificationType.Success });
        updateFilledForms(loanId, {
          complete_business_premis_detail: true
        }); // update filled forms

        setTimeout(() => {
          dispatch(updateCurrentStage(4));
        }, 1500);
      } else {
        console.log('error', response.status_message);
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Reset loading state when done submitting
      }, 1500);
    }
  };

  const onError: SubmitErrorHandler<BusinessPremiseDetailsType> = error => {
    trigger();
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
  };

  const watchRegisteredPremiseType = watch(
    'registered_address.premise_type',
    'Freehold'
  );
  const watchBusinessSameAsRegistered = watch(
    'trading_same_as_registered',
    businessPremiseDetails.trading_same_as_registered || false
  );

  const watchTradingPremiseType = watch(
    'trading_address.premise_type' as keyof BusinessPremiseDetailsType,
    'Freehold'
  );

  const getNestedError = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  const DocumentUpload = ({ itemName }) => {
    const handleFileUpload = (files, itemName, isMultiple: boolean) => {
      const fileList = isMultiple ? files : Array.from(files);
      setValue(itemName, fileList);
      trigger(itemName);
    };

    const isMultiple = (
      loanFormBusinessPremiseDetails.find(
        i => i.type === 'file' && i.name === itemName
      ) as fileControllerProps
    ).isMultiple;

    const fieldError = getNestedError(formState?.errors, itemName);

    return (
      <div className="w-full rounded-lg border-2 px-[10px]">
        <div
          className={`accordion-title flex cursor-pointer items-center justify-between bg-white py-2 ${watchedFieldValues[itemName].length > 0 && 'text-[#00CC08]'} `}
        >
          <span
            className={`accordion mb-4 flex text-[14px] ${
              fieldError
                ? 'text-red-500'
                : watchedFieldValues[itemName].length > 0 && 'text-[#00CC08]'
            }`}
          >
            <div
              className={`mt-2 flex ${
                fieldError
                  ? 'text-red-500'
                  : watchedFieldValues[itemName].length > 0 && 'text-[#00CC08]'
              }`}
            >
              <img src={camera} /> <a className="mx-2">{'Upload Document'}</a>
            </div>
          </span>
          {!fieldError && (
            <span className="accordion-arrow">
              {watchedFieldValues[itemName].length > 0 && <IoCheckmark />}
            </span>
          )}
        </div>

        <div className="container mx-auto mb-4 mt-4 flex justify-center">
          {watchedFieldValues[itemName].length > 0 ? (
            watchedFieldValues[itemName].map((file, fileId) => {
              return (
                <span key={fileId} className="flex items-center gap-1">
                  <PiFilesLight
                    size={28}
                    color={fieldError ? '#F44336' : '#00CC08'}
                  />
                  <span
                    className={fieldError ? 'text-red-500' : 'text-[#00CC08]'}
                  >
                    {file.name}
                  </span>
                  <a onClick={() => handleClose(itemName, file.name)}>
                    <IoMdClose color="#000000" className="font-medium" />
                  </a>
                </span>
              );
            })
          ) : (
            <div className="w-full rounded-lg">
              <div className="m-4">
                <div className="flex w-full items-center justify-center">
                  <label
                    className={`flex h-32 w-full flex-col border-[2px] border-dashed border-[#B7B7B7] ${
                      fieldError && 'border-red-500'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-7">
                      <input
                        type="file"
                        multiple={
                          (
                            loanFormBusinessPremiseDetails.find(
                              i => i.type === 'file' && i.name === itemName
                            ) as fileControllerProps
                          ).isMultiple
                        }
                        onChange={event =>
                          handleFileUpload(
                            event.target.files,
                            itemName,
                            isMultiple
                          )
                        }
                        className="opacity-0"
                        accept={
                          (
                            loanFormBusinessPremiseDetails.find(
                              i => i.type === 'file' && i.name === itemName
                            ) as fileControllerProps
                          ).memTypes
                        }
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-8 w-8 ${
                          fieldError ? 'text-red-500' : 'text-[#1A439A]'
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
                          fieldError ? 'text-red-500' : 'text-[#1A449A]'
                        } max-sm:text-[9px]`}
                      >
                        {'Upload Document'}
                        {/* <a className={`text-black `}> or drag and drop </a> */}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={loanFormCommonStyleConstant.file.errorClass}>
          <p className={fieldError ? 'mb-[12px] border-red-500' : ''}></p>
          {fieldError && <p>{fieldError.message}</p>}
        </div>
      </div>
    );
  };
  const registeredAddressStartDate = getValues('registered_address.start_date');

  return (
    <FormProvider {...methods}>
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit, onError)}
        className="p-4"
      >
        <div>
          <div className="p-2 text-[16px] font-medium">
            {'Registered Address'}
          </div>

          <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            <div className="">
              <AddressLookup
                setAddress={setRegisteredAddress}
                value={watch(
                  'registered_address.post_code',
                  businessPremiseDetails?.registered_address?.post_code || ''
                )}
                methods={methods}
                pincodeKey="registered_address.post_code"
                error={formState?.errors?.registered_address?.post_code}
              />
            </div>
            <div className="">
              {fieldRenderer.renderField(['registered_address.address_line'])}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-2">
            {/* <div className="flex items-center border-b-2  ">
              <div className=" text-gray-400 pr-2 w-5 ">
                <img src={quest} />
              </div>{" "}
              <a className="text-[14px] text-[#929292]">Premise Type?</a>
            </div> */}
            <div>
              {fieldRenderer.renderField(['registered_address.premise_type'])}
            </div>{' '}
          </div>
        </div>

        {watchRegisteredPremiseType === 'Leasehold' && (
          <>
            <div className="p-2 text-[16px] font-medium">
              {'Lease Time period'}
            </div>
            <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              <div className="">
                {fieldRenderer.renderField(['registered_address.start_date'])}
              </div>
              <div className=" ">
                {fieldRenderer.renderField(['registered_address.end_date'], {
                  min: (registeredAddressStartDate as string) || null
                })}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-2">
              <DocumentUpload itemName="registered_address.document" />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 gap-4 p-2">
          {fieldRenderer.renderField('trading_same_as_registered')}
        </div>
        {!watchBusinessSameAsRegistered && (
          <>
            <div className="p-2 text-[16px] font-medium">
              {'Trading Address'}
            </div>
            <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              <div className="">
                <AddressLookup
                  setAddress={setTradingAddress}
                  value={watch(
                    'trading_address.post_code' as keyof BusinessPremiseDetailsType,
                    businessPremiseDetails?.trading_address?.post_code || ''
                  )}
                  methods={methods}
                  pincodeKey="trading_address.post_code"
                  // @ts-expect-error: Type error occurs because `post_code` is missing its type in `BusinessPremiseDetailsSchema` when `trading_same_as_registered` is false
                  error={formState?.errors?.trading_address?.post_code}
                />
              </div>
              <div className="">
                {fieldRenderer.renderField(['trading_address.address_line'])}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-2">
              {/* <div className="flex items-center border-b-2  ">
                <div className=" text-gray-400 pr-2 w-5 ">
                  <img src={quest} />
                </div>{" "}
                <a className="text-[14px] text-[#929292]">Premise Type?</a>
              </div> */}
              <div className=" ">
                {fieldRenderer.renderField(['trading_address.premise_type'])}
              </div>{' '}
            </div>

            {watchTradingPremiseType &&
              watchTradingPremiseType === 'Leasehold' && (
                <>
                  <div className="p-2 text-[16px] font-medium">
                    {'Lease Time period'}
                  </div>
                  <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    <div className="">
                      {fieldRenderer.renderField([
                        'trading_address.start_date'
                      ])}
                    </div>
                    <div className=" ">
                      {fieldRenderer.renderField(['trading_address.end_date'])}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    <DocumentUpload itemName="trading_address.document" />{' '}
                  </div>
                </>
              )}
          </>
        )}
      </form>
    </FormProvider>
  );
};

export default BusinessPremiseDetails;
