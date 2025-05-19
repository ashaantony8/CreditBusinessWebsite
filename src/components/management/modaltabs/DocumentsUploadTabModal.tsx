import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  BusinessDetailTabModalDetails,
  loanFormCommonStyleConstant
} from '../../../utils/constants';
import { BusinessDetailsSchema } from '../../../utils/Schema';
import FieldRenderer from '../../commonInputs/FieldRenderer';

const DocumentsUploadTabModal: React.FC = () => {
  const methods = useForm();
  // const [numDirector, setNumDirectors] = useState(0);
  const fieldRenderer = new FieldRenderer(
    BusinessDetailTabModalDetails,
    loanFormCommonStyleConstant,
    BusinessDetailsSchema
  );

  return (
    <>
      <FormProvider {...methods}>
        <form
          // ref={formRef}
          // onSubmit={}
          className="mt-2 px-4"
        >
          <div className="flex flex-wrap pt-4">
            <div className="-mt-[1px] w-full pr-2 sm:w-1/2">
              {fieldRenderer.renderField('businessType')}
            </div>
            <div className="w-full sm:w-1/2 sm:pl-2">
              {fieldRenderer.renderField('numberofDirectors')}
            </div>
          </div>
          <div className="container mx-auto flex justify-center">
            <div className="w-full rounded-lg">
              <div className="m-4">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full flex-col border-[2px] border-dashed border-[#B7B7B7]">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#1A439A]"
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
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600 max-sm:text-[9px]">
                        {/* {fieldRenderer.renderField([
                          "registered.addressFileUpload",
                        ])} */}
                      </p>
                      <p className="text-[12px] text-[#1A449A] max-sm:text-[9px]">
                        {'Upload Document'}
                        {/* <a className="text-black"> or drag and drop </a> */}
                      </p>
                    </div>
                    <input type="file" className="opacity-0" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap pt-4">
            <div className="w-full pr-2 sm:w-1/2">
              {fieldRenderer.renderField(['startTradingDate'])}
            </div>
            <div className="-mt-[2px] w-full sm:w-1/2 sm:pl-2">
              {fieldRenderer.renderField(['profitableLast12Months'])}{' '}
            </div>
          </div>

          <div className="container mx-auto flex justify-center">
            <div className="w-full rounded-lg">
              <div className="m-4">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full flex-col border-[2px] border-dashed border-[#B7B7B7]">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#1A439A]"
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
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600 max-sm:text-[9px]">
                        {/* {fieldRenderer.renderField([
                          "registered.addressFileUpload",
                        ])} */}
                      </p>
                      <p className="text-[12px] text-[#1A449A] max-sm:text-[9px]">
                        {'Upload Document'}
                        {/* <a className="text-black"> or drag and drop </a> */}
                      </p>
                    </div>
                    <input type="file" className="opacity-0" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr className="mb-4 pb-4" />

        <div className="my-4 flex justify-center">
          <button>
            {' '}
            <a
              href=""
              className="mt-1 cursor-pointer bg-[#1A439A] px-4 py-2 text-[12px] uppercase text-white"
            >
              <span className="font-normal">{'save'}</span>
            </a>
          </button>
        </div>
      </FormProvider>
    </>
  );
};

export default DocumentsUploadTabModal;
