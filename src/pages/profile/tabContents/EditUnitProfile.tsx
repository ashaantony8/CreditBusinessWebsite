import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';
import { TiPencil } from 'react-icons/ti';
import { useSelector } from 'react-redux';

import { editUnitProfileApi } from '../../../api/loanServices';
import FieldRenderer from '../../../components/commonInputs/FieldRenderer';
import Loader from '../../../components/Loader';
import { managementSliceSelector } from '../../../store/managementReducer';
import {
  loanFormCommonStyleConstant,
  unitProfileEditDetails
} from '../../../utils/constants';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { UnitProfileEditSchema } from '../../../utils/Schema';
import { UnitProfileDetails } from '../../../utils/types';

const EditUnitProfile = ({ closeModal, profile, unitId }) => {
  const fieldRenderer = new FieldRenderer(
    unitProfileEditDetails,
    loanFormCommonStyleConstant,
    UnitProfileEditSchema
  );

  const { unit } = useSelector(managementSliceSelector);
  const companyId = unit.id || unitId;
  const { showToast } = useToast();
  const methods = useForm<Partial<UnitProfileDetails>>({
    resolver: yupResolver(UnitProfileEditSchema),
    defaultValues: {
      id: profile?.id || '',
      company_name: profile?.company_name || '',
      company_status: profile?.company_status || '',
      // customer: profile?.customer || "",
      business_type: profile?.business_type || '',
      funding_purpose: profile?.funding_purpose || '',
      trading_style: profile?.trading_style || '',
      company_number: profile?.company_number || '',
      other_funding_purpose: profile?.other_funding_purpose || ''
    }
  });
  const { handleSubmit } = methods;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        customers: profile?.gocardless_status,
        gocardless_status: profile?.gocardless_status
      };

      const response = await editUnitProfileApi(companyId, payload);

      if (response.status_code >= 200 && response.status_code < 300) {
        showToast('Profile updated successfully', {
          type: NotificationType.Success
        });
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        showToast(response.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', {
        type: NotificationType.Error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onError = error => {
    showToast('Please check the validation error!', {
      type: NotificationType.Error
    });
    console.log('error', error);
  };
  return (
    <FormProvider {...methods}>
      <div>
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          {isLoading && (
            <div
              aria-hidden="true"
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
            >
              <Loader />
            </div>
          )}
          <div className="relative h-[450px] w-full max-w-md overflow-y-scroll">
            <div className="relative bg-white shadow">
              <div className="flex items-center justify-end px-4 py-6">
                <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-[#1A439A]">
                  <TiPencil size={24} />
                </div>
                <p className="my-1 pl-2 text-[15px] font-medium">
                  {'Edit Details'}
                </p>
                <button
                  onClick={closeModal}
                  type="button"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
              <div className="grid items-center">
                <form
                  onSubmit={handleSubmit(onSubmit, onError)}
                  className="px-2 pb-6 text-[#000000]"
                  action="#"
                >
                  {/* <div className="w-full py-[2px]">
                    {fieldRenderer.renderField(["image"], {
                      defaultValue: profile?.image,
                    })}
                  </div> */}

                  {/* <div className="grid lg:grid-cols-2 gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2">
                    <div className="">
                      {fieldRenderer.renderField(["company_name"], {
                        defaultValue: profile?.company_name,
                      })}
                    </div>
                 
                  </div> */}

                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['company_name'], {
                      defaultValue: profile?.company_name
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['business_type'], {
                      defaultValue: profile?.business_type
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['company_number'], {
                      defaultValue: profile?.company_number
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['company_status'], {
                      defaultValue: profile?.company_status
                    })}
                  </div>
                  {/* <div className="grid gap-4 p-2 grid-cols-1">
                    {fieldRenderer.renderField(["customer"], {
                      defaultValue: profile?.customer,
                    })}
                  </div>  */}
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['funding_purpose'], {
                      defaultValue: profile?.funding_purpose
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['other_funding_purpose'], {
                      defaultValue: profile?.other_funding_purpose
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['trading_style'], {
                      defaultValue: profile?.trading_style
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-2">
                    <button
                      type="submit" // Ensure the button is of type submit
                      className="w-full rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-blue-800"
                    >
                      {'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default EditUnitProfile;
