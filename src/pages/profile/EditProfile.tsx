import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';
import { TiPencil } from 'react-icons/ti';
import { useSelector } from 'react-redux';

import {
  editCustomerApi,
  // editCustomerProfileApi,
  userProfileEditApi
} from '../../api/userServices';
import FieldRenderer from '../../components/commonInputs/FieldRenderer';
import Loader from '../../components/Loader';
import { authSelector } from '../../store/auth/userSlice';
import {
  loanFormCommonStyleConstant,
  profileEditDetails
} from '../../utils/constants';
import { Roles } from '../../utils/enums';
import { convertDateString } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { ProfileEditSchema } from '../../utils/Schema';
import { ProfileEditFormData } from '../../utils/types';

const getProfileEditSchema = (role, editingCustomerId) => {
  if ([Roles.Customer, Roles.Leads].includes(role) && editingCustomerId) {
    return ProfileEditSchema;
  }
  return ProfileEditSchema.omit(['credit_score', 'risk_score']);
};

const EditProfile = ({
  closeModal,
  profile,
  setProfile,
  editingCustomerId
}) => {
  const { role } = useSelector(authSelector);
  const customerId = editingCustomerId || profile.id;
  const fieldRenderer = new FieldRenderer(
    profileEditDetails,
    loanFormCommonStyleConstant,
    ProfileEditSchema
  );
  const { showToast } = useToast();
  const methods = useForm<Partial<ProfileEditFormData>>({
    resolver: yupResolver(getProfileEditSchema(role, editingCustomerId)),
    defaultValues: {
      // image: profile?.image || '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      number: profile?.phone_number || '',
      credit_score: profile?.credit_score || '',
      risk_score: profile?.risk_score || '',
      date_of_birth: profile?.date_of_birth || '',
      // address: profile?.location || '',
      address: profile?.address || '',
      description: profile?.description || ''
    }
  });
  const { handleSubmit } = methods;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      data['date_of_birth'] = convertDateString(data.date_of_birth);

      if (editingCustomerId) {
        // editing customer details through other login
        await editCustomerApi(customerId, data);
      } else {
        if ([Roles.Customer, Roles.Leads].includes(role)) {
          await userProfileEditApi(data);
        } else {
          delete data.credit_score;
          delete data.risk_score;
          await userProfileEditApi(data);
          setProfile(prev => ({ ...prev, ...data }));
        }
      }
      showToast('Profile updated successfully', {
        type: NotificationType.Success
      });
      setTimeout(() => {
        closeModal();
      }, 1500);
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
          <div className="relative w-full max-w-md md:h-auto">
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

                  <div className="grid gap-4 p-2 max-sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                    <div className="">
                      {fieldRenderer.renderField(['first_name'], {
                        defaultValue: profile?.first_name
                      })}
                    </div>
                    <div className="">
                      {fieldRenderer.renderField(['last_name'], {
                        defaultValue: profile?.last_name
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['email'], {
                      defaultValue: profile?.email
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['number'], {
                      defaultValue: profile?.phone_number
                    })}
                  </div>
                  {/* <div className="grid gap-4 p-2 grid-cols-1">
                    {fieldRenderer.renderField(["company_name"], {
                      defaultValue: profile?.company_name,
                    })}
                  </div> */}
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['date_of_birth'], {
                      defaultValue: profile?.date_of_birth
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['address'], {
                      defaultValue: profile?.address
                    })}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    {fieldRenderer.renderField(['description'], {
                      defaultValue: profile?.description
                    })}
                  </div>
                  {editingCustomerId && (
                    <>
                      <div className="grid grid-cols-1 gap-4 p-2">
                        {fieldRenderer.renderField(['credit_score'], {
                          defaultValue: profile?.credit_score,
                          isFractional: true
                        })}
                      </div>
                      <div className="grid grid-cols-1 gap-4 p-2">
                        {fieldRenderer.renderField(['risk_score'], {
                          defaultValue: profile?.risk_score,
                          isFractional: true
                        })}
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 gap-4 p-2">
                    <button
                      type="submit"
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

export default EditProfile;
