import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { customerProfileApproval } from '../../../api/userServices';
import { authSelector } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { ProfileDetailsProps } from '../../../utils/types';
import Header from '../common/Header';
import RejectModal from './RejectModal';

// Define a type for profile data
type ProfileField = {
  label: string;
  value: string | undefined;
};

const ProfileSection: React.FC<{
  title: string;
  profileData: ProfileField[];
  editedFields: Set<string>;
}> = ({ title, profileData, editedFields }) => {
  const isOldProfile = title === 'Old Profile';

  return (
    <div className="col-span-1 rounded-lg border border-gray-300 bg-gray-50 text-[13px]">
      <div
        className={`h-16 rounded-t-lg border-b p-4 text-[16px] font-semibold ${
          isOldProfile ? 'bg-[#D9D9D9] text-black' : 'bg-[#1A439A] text-white'
        }`}
      >
        <a className="">{title}</a>
      </div>
      <div className="mt-4 space-y-4">
        {profileData.map(({ label, value }) => {
          const isEdited = editedFields.has(label);
          const bgColor = isEdited
            ? isOldProfile
              ? 'bg-[#FAEBEB]'
              : 'bg-[#E0F7E7]'
            : '';

          return (
            <div
              key={label}
              className={`p-2 text-[14px] text-[#929292] ${bgColor}`}
            >
              <a className="px-6">{label}</a>
              <div className="px-6 text-[16px] font-medium text-black">
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UserProfileEditApproval: React.FC<ProfileDetailsProps> = ({
  profile,
  setIsModalOpen
}) => {
  const { showToast } = useToast();
  const { role } = useSelector(authSelector);

  const [isLoading, setIsLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const handleApprove = async () => {
    const data = {
      id: profile?.id,
      approve: true
    };
    try {
      setIsLoading(true);
      const response = await customerProfileApproval(data);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast('Profile approved successfully', {
          type: NotificationType.Success
        });
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1500);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to approve', error);
      showToast('Failed to approve the profile', {
        type: NotificationType.Error
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = () => {
    setRejectModal(true);
  };
  const handleCloseRejectModal = () => {
    setRejectModal(false);
  };

  const oldProfileData: ProfileField[] = [
    { label: 'Name', value: profile?.customer?.first_name },
    { label: 'Last Name', value: profile?.customer?.last_name },
    { label: 'Email Address', value: profile?.customer?.email },
    { label: 'Phone Number', value: profile?.customer?.phone_number },
    { label: 'Address', value: profile?.customer?.address },
    { label: 'Description', value: profile?.customer?.description },
    { label: 'Date of Birth', value: profile?.customer?.date_of_birth },
    { label: 'Company Name', value: profile?.customer?.company_name }
  ];

  const newProfileData: ProfileField[] = [
    { label: 'Name', value: profile?.changes?.first_name },
    { label: 'Last Name', value: profile?.changes?.last_name },
    { label: 'Email Address', value: profile?.changes?.email },
    { label: 'Phone Number', value: profile?.changes?.phone_number },
    { label: 'Address', value: profile?.changes?.address },
    { label: 'Description', value: profile?.changes?.description },
    { label: 'Date of Birth', value: profile?.changes?.date_of_birth },
    { label: 'Company Name', value: profile?.changes?.company_name }
  ];

  // Function to find the edited fields
  const getEditedFields = (
    oldData: ProfileField[],
    newData: ProfileField[]
  ): Set<string> => {
    const editedFields = new Set<string>();
    newData.forEach((newField, index) => {
      const oldField = oldData[index];
      if (newField.value && newField.value !== oldField.value) {
        editedFields.add(newField.label);
      }
    });
    return editedFields;
  };

  const editedFields = getEditedFields(oldProfileData, newProfileData);

  // Filter the new profile data to include only edited fields
  const filteredNewProfileData = newProfileData.filter(({ label }) =>
    editedFields.has(label)
  );

  return (
    <>
      <Header title="Customer Profile" />
      <div className="h-[60vh] w-full overflow-y-auto max-lg:h-[65vh]">
        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 max-md:grid-cols-1">
          <ProfileSection
            title="Old Profile"
            profileData={oldProfileData}
            editedFields={editedFields}
          />
          <ProfileSection
            title="New Profile"
            profileData={filteredNewProfileData}
            editedFields={editedFields}
          />
        </div>

        {[Roles.Manager, Roles.Admin].includes(role) &&
          !profile.is_admin_reject &&
          !profile.is_admin_approved && (
            <div className="mt-8 flex justify-end space-x-4 px-4">
              <button
                onClick={handleApprove}
                className="rounded-lg bg-[#1A439A] px-6 py-2 text-white hover:bg-[#293f73]"
                disabled={isLoading}
              >
                {isLoading ? 'Approving...' : 'Approve'}
              </button>
              <button
                onClick={handleReject}
                className="rounded-lg border border-[#840000] px-6 py-2 text-[#840000] hover:border-red-800"
                disabled={isLoading}
              >
                {isLoading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          )}
        {rejectModal && (
          <RejectModal
            onClose={handleCloseRejectModal}
            setIsLoading={setIsLoading}
            profile={profile}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </div>
    </>
  );
};

export default UserProfileEditApproval;
