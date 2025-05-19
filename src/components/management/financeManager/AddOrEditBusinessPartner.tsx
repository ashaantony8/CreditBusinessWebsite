import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { LuUsers } from 'react-icons/lu';
import { RxCross2 } from 'react-icons/rx';
import * as yup from 'yup';

import {
  businessPartnerGroupsNonPaginatedGetApi,
  financePartnerApi,
  generalLedgerGetApi
} from '../../../api/financeManagerServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';

interface BusinessPartnerData {
  id?: string;
  group?: string;
  name?: string;
  email?: string;
  mobile?: string;
  glId?: string;
  gl_code?: string;
}

// Yup validation schema
const schema = yup.object().shape({
  id: yup.string().required('Business Partner ID is required'),
  group: yup.string().required('Group is required'),
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  mobile: yup
    .string()
    .test(
      'is-valid-phone',
      'Phone number must be a valid 10-digit UK number',
      value => !value || /^[0-9]{10}$/.test(value)
    ),
  glId: yup.string().required('General Ledger ID is required')
});

const AddOrEditBusinessPartner = ({
  setBusinessPartners,
  businessPartners,
  editingPartner,
  isAddEditModalOpen,
  setIsAddEditModalOpen
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm<BusinessPartnerData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [glIds, setGlIds] = useState<{ id: string; display: string }[]>([]);
  const [groups, setGroups] = useState<{ display: string; id: string }[]>([]);
  const [glDisplayValue, setGlDisplayValue] = useState('');
  const [showGlList, setShowGlList] = useState(false);
  const [glSearchTerm, setGlSearchTerm] = useState('');

  const [bpGroupDisplayValue, setBpGroupDisplayValue] = useState('');
  const [showBpGroupList, setShowBpGroupList] = useState(false);
  const [bpGroupSearchTerm, setBpGroupSearchTerm] = useState('');

  useEffect(() => {
    if (editingPartner) {
      setValue('id', editingPartner.id);
      setValue('group', editingPartner.group);
      setValue('name', editingPartner.name);
      setValue('email', editingPartner.email);
      setValue('mobile', editingPartner.mobile);
      setValue('glId', editingPartner.glId);
      setGlSearchTerm(glIds.find(gl => gl.id === editingPartner.glId)?.display);
      setBpGroupSearchTerm(
        groups.find(group => group.id === editingPartner.group)?.display
      );
    }
  }, [editingPartner]);

  const fetchGlIds = async (term = '') => {
    try {
      const response = await generalLedgerGetApi(term);
      if (response.status_code >= 200 && response.status_code < 300) {
        // Update state to store both ID and display information
        const fetchedGlIds = response.data.map(
          (ledger: { id: string; gl_code: string; gl_name: string }) => ({
            id: ledger.id,
            display: `${ledger.gl_code} - ${ledger.gl_name}`
          })
        );
        setGlIds(fetchedGlIds);
      } else {
        showToast('Failed to fetch General Ledger IDs.', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('An error occurred while fetching General Ledger IDs.', {
        type: NotificationType.Error
      });
      console.error('Error during API call:', error);
    }
  };

  const handleAddOrUpdateBusinessPartner: SubmitHandler<
    BusinessPartnerData
  > = async data => {
    setIsLoading(true);
    fetchGlIds();

    const payload = {
      partner_code: data.id,
      partner_name: data.name,
      partner_type: data.group,
      gl_account: data.glId,
      email: data.email,
      phone_number: data.mobile
    };

    try {
      const response = await financePartnerApi(payload);

      if (response.status_code >= 200 && response.status_code < 300) {
        if (editingPartner) {
          setBusinessPartners(
            businessPartners.map(partner =>
              partner.id === data.id
                ? { ...data, glId: formatGlId(data.glId) }
                : partner
            )
          );
          showToast('Business Partner updated successfully!', {
            type: NotificationType.Success
          });
        } else {
          setBusinessPartners([
            ...businessPartners,
            { ...data, glId: formatGlId(data.glId) }
          ]);
          showToast('Business Partner added successfully!', {
            type: NotificationType.Success
          });
        }
        setIsAddEditModalOpen(false);
        reset();
      } else {
        const errorMessages =
          response.errors || response.status_message || 'Unknown error';
        showToast(
          `Failed to add or update Business Partner: ${errorMessages}`,
          {
            type: NotificationType.Error
          }
        );
      }
    } catch (error) {
      console.error('Error during API call:', error);
      if (error.response && error.response.data) {
        const errorDetails = error.response.data || 'Unknown error';
        showToast(`Failed to add or update Business Partner: ${errorDetails}`, {
          type: NotificationType.Error
        });
      } else {
        showToast(
          'Failed to add or update Business Partner. Please try again.',
          {
            type: NotificationType.Error
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatGlId = (glId: string): string => {
    const gl = glIds.find(g => g.id === glId);
    return gl ? gl.display : glId;
  };

  const fetchGroups = async (bpGroupSearchTerm = '') => {
    try {
      const response =
        await businessPartnerGroupsNonPaginatedGetApi(bpGroupSearchTerm);
      if (response.status_code >= 200 && response.status_code < 300) {
        if (Array.isArray(response.data)) {
          const fetchedGroups = response.data.map(
            (group: { id: string; group_name: string }) => ({
              display: group.group_name,
              id: group.id
            })
          );
          setGroups(fetchedGroups);
        } else {
          showToast('Failed to fetch groups. Data is not in expected format.', {
            type: NotificationType.Error
          });
        }
      } else {
        showToast('Failed to fetch groups.', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast('An error occurred while fetching groups.', {
        type: NotificationType.Error
      });
      console.error('Error during API call:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchGlIds();
  }, []);

  const toggleModal = () => {
    reset();
    setIsAddEditModalOpen(!isAddEditModalOpen);
  };

  const onError: SubmitErrorHandler<BusinessPartnerData> = () => {
    showToast('Please correct the errors in the form.', {
      type: NotificationType.Error
    });
  };

  const handleOptionClick = glId => {
    setGlDisplayValue(glIds.find(gl => gl.id === glId).display);
    setShowGlList(false);
    setValue('glId', glId);
    setGlSearchTerm(glIds.find(gl => gl.id === glId).display);
  };

  const handleBpGroupOptionClick = bpId => {
    setBpGroupDisplayValue(groups.find(group => group.id === bpId).display);
    setShowBpGroupList(false);
    setValue('group', bpId);
    setBpGroupSearchTerm(groups.find(group => group.id === bpId).display);
  };

  useEffect(() => {
    fetchGlIds(glSearchTerm);
    setGlDisplayValue(glSearchTerm);
  }, [glSearchTerm]);

  useEffect(() => {
    fetchGroups(bpGroupSearchTerm);
    setBpGroupDisplayValue(bpGroupSearchTerm);
  }, [bpGroupSearchTerm]);

  useEffect(() => {
    return () => {
      setShowGlList(false);
      setGlSearchTerm('');
      setShowBpGroupList(false);
      setBpGroupSearchTerm('');
    };
  }, [isAddEditModalOpen]);

  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (showGlList && !event.target.closest("#gl-list")) {
  //       const currentGlId = getValues("glId");
  //       const selectedGlId =
  //         currentGlId && glIds.find((gl) => gl.id === currentGlId);
  //       setGlSearchTerm(selectedGlId?.display || "");
  //       setShowGlList(false);
  //     }
  //     if (showBpGroupList && !event.target.closest("#bp-group-list")) {
  //       const currentGroup = getValues("group");
  //       const selectedGroup =
  //         currentGroup && groups.find((group) => group.id === currentGroup);
  //       setBpGroupSearchTerm(selectedGroup?.display || "");
  //       setShowBpGroupList(false);
  //     }
  //   };

  //   document.addEventListener("click", handleOutsideClick);

  //   return () => {
  //     document.removeEventListener("click", handleOutsideClick);
  //   };
  // }, [showGlList, showBpGroupList]);

  useEffect(() => {
    if (showGlList === false) {
      const currentGlId = getValues('glId');
      const selectedGlId =
        currentGlId && glIds.find(gl => gl.id === currentGlId);
      setGlSearchTerm(selectedGlId?.display || '');
    }
    if (showBpGroupList === false) {
      const currentGroup = getValues('group');
      const selectedGroup =
        currentGroup && groups.find(group => group.id === currentGroup);
      setBpGroupSearchTerm(selectedGroup?.display || '');
    }
  }, [showGlList, showBpGroupList]);

  return (
    <>
      {isAddEditModalOpen && (
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
            <div className="relative bg-white px-2 shadow">
              <div className="flex justify-end px-4 pt-6">
                <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-[#1A439A]">
                  <LuUsers size={24} />
                </div>
                <p className="my-1 pl-2 text-[15px] font-medium">
                  {`${editingPartner ? 'Update' : 'Create'} Business Partner`}
                  <div className="text-[10.5px] text-[#656565]">
                    {`Hey! You can ${
                      editingPartner ? 'Update' : 'Create'
                    } a Business Partner from Here!`}
                  </div>
                </p>
                <button
                  onClick={toggleModal}
                  type="button"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
              <form
                className="px-2 pb-6 text-[#000000]"
                onSubmit={handleSubmit(
                  handleAddOrUpdateBusinessPartner,
                  onError
                )}
              >
                <div className="h-[350px] overflow-y-scroll py-4">
                  <div className="grid grid-cols-1 gap-4 p-2">
                    <input
                      {...register('id')}
                      placeholder="Business Partner ID"
                      className={`appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none ${
                        errors.id ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.id && (
                      <p className="text-red-500">{errors.id.message}</p>
                    )}
                  </div>
                  <div
                    id="bp-group-list"
                    className="grid grid-cols-1 gap-4 p-2"
                  >
                    <input
                      // {...register("group")}
                      value={bpGroupDisplayValue}
                      onChange={e => {
                        setBpGroupSearchTerm(e.target.value);
                        setShowBpGroupList(true);
                      }}
                      className={`appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none ${
                        errors.group ? 'border-red-500' : ''
                      }`}
                      onClick={() =>
                        setShowBpGroupList(preVstate => !preVstate)
                      }
                      placeholder="Select Group"
                    />
                    {showBpGroupList && (
                      <ul className="absolute z-10 mt-12 max-h-60 w-[89%] overflow-auto rounded border bg-white">
                        {groups.length > 0 ? (
                          groups.map(group => (
                            <li
                              key={group.id}
                              className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                              onClick={() => handleBpGroupOptionClick(group.id)}
                            >
                              {group.display}
                            </li>
                          ))
                        ) : (
                          <li
                            className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                            onClick={() => setShowBpGroupList(false)}
                          >
                            {'No Group found'}
                          </li>
                        )}
                      </ul>
                    )}

                    {errors.group && (
                      <p className="text-red-500">{errors.group.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    <input
                      {...register('name')}
                      placeholder="Name"
                      className={`appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Email"
                      className={`appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2">
                    <input
                      {...register('mobile')}
                      placeholder="Mobile Number"
                      type="number"
                      className={`appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none ${
                        errors.mobile ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.mobile && (
                      <p className="text-red-500">{errors.mobile.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-2" id="gl-list">
                    <input
                      // {...register("glId")}
                      value={glDisplayValue}
                      onChange={e => {
                        setGlSearchTerm(e.target.value);
                        setShowGlList(true);
                      }}
                      className={`appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none ${
                        errors.glId ? 'border-red-500' : ''
                      }`}
                      onClick={() => setShowGlList(preVstate => !preVstate)}
                      placeholder="Select General Ledger ID"
                    />
                    {showGlList && (
                      <ul className="absolute z-10 mt-12 max-h-60 w-[89%] overflow-auto rounded border bg-white">
                        {glIds.length > 0 ? (
                          glIds.map(gl => (
                            <li
                              key={gl.id}
                              className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                              onClick={() => handleOptionClick(gl.id)}
                            >
                              {gl.display}
                            </li>
                          ))
                        ) : (
                          <li
                            className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                            onClick={() => setShowGlList(false)}
                          >
                            {'No Gl found'}
                          </li>
                        )}
                      </ul>
                    )}
                    {errors.glId && (
                      <p className="text-red-500">{errors.glId.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-2">
                  <input
                    type="submit"
                    value={`${
                      editingPartner ? 'Update' : 'Add'
                    } Business Partner`}
                    disabled={showGlList}
                    className={`w-full rounded border border-blue-700 bg-blue-900 px-4 py-2 text-[12px] font-medium text-white hover:bg-blue-800 ${
                      !showGlList ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddOrEditBusinessPartner;
