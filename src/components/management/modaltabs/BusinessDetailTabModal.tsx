import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TbMessage } from 'react-icons/tb';

import {
  BusinessDetailTabModalDetails,
  loanFormCommonStyleConstant
} from '../../../utils/constants';
import { BusinessDetailsSchema } from '../../../utils/Schema';
import FieldRenderer from '../../commonInputs/FieldRenderer';

const BusinessDetailTabModal: React.FC = () => {
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

        <div className="my-4 flex justify-between">
          <button className="w-3/4">
            {' '}
            <a
              href=""
              className="flex items-center gap-2 border border-[#929292] px-2 py-2 text-[12px] text-[#929292]"
            >
              <TbMessage className="h-5 w-5" />
              <span className="font-normal">{'Add a Comment...'}</span>
            </a>
          </button>
          <div className="w-[2%]"></div>
          <button className="w-1/4">
            <a
              href=""
              className="flex items-center justify-center gap-2 border border-[#1A439A] bg-[#1A439A] px-2 py-2 text-[12px] text-[#FFFFFF]"
            >
              {'Update'}
            </a>
          </button>
        </div>
      </FormProvider>
    </>
  );
};

export default BusinessDetailTabModal;
