import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

import {
  BusinessDetailTabModalDetails,
  loanFormCommonStyleConstant
} from '../../../utils/constants';
import { BusinessDetailsSchema } from '../../../utils/Schema';
import FieldRenderer from '../../commonInputs/FieldRenderer';

const BusinessPremiseDetailsTabModal: React.FC = () => {
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

          <div className="flex flex-wrap pt-4">
            <div className="w-full pr-2 sm:w-1/2">
              {fieldRenderer.renderField(['startTradingDate'])}
            </div>
            <div className="-mt-[2px] w-full sm:w-1/2 sm:pl-2">
              {fieldRenderer.renderField(['profitableLast12Months'])}{' '}
            </div>
          </div>

          <div className="flex flex-wrap pt-4">
            <div className="w-full pr-2 sm:w-1/2">
              {fieldRenderer.renderField('businessStartedTrading')}
            </div>
            <div className="-mt-[2px] w-full sm:w-1/2 sm:pl-2">
              {fieldRenderer.renderField(['profitableLast12Months'])}{' '}
            </div>
          </div>

          <div className="flex flex-wrap pt-4">
            <div className="-mt-[1px] w-full pr-2 sm:w-1/2">
              {fieldRenderer.renderField('businessType')}
            </div>
            <div className="w-full sm:w-1/2 sm:pl-2">
              {fieldRenderer.renderField('numberofDirectors')}
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

          <div className="flex flex-wrap pt-4">
            <div className="w-full pr-2 sm:w-1/2">
              {fieldRenderer.renderField('businessStartedTrading')}
            </div>
            <div className="-mt-[2px] w-full sm:w-1/2 sm:pl-2">
              {fieldRenderer.renderField(['profitableLast12Months'])}{' '}
            </div>
          </div>
        </form>
        <hr className="mb-4 pb-4" />

        <div className="flex flex-1 justify-between">
          <a
            className="relative inline-flex items-center border border-gray-300 bg-[#BFBCBC] px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            rel="prev"
            href="/"
          >
            <SlArrowLeft />
            <a className="ml-1 max-sm:hidden">{'Prev'}</a>
          </a>

          <a
            className="relative inline-flex items-center border border-gray-300 bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            rel="Next"
            href="/"
          >
            <a className="mr-1 max-sm:hidden">{'Next'}</a>
            <SlArrowRight />
          </a>
        </div>
      </FormProvider>
    </>
  );
};

export default BusinessPremiseDetailsTabModal;
