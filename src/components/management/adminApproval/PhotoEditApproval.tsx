import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { photoIdDocApprovalApi } from '../../../api/loanServices';
import proof from '../../../assets/images/proof.png';
import eye from '../../../assets/svg/eye.svg';
import { authSelector } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { ProfileDetailsProps } from '../../../utils/types';
import Header from '../common/Header';
import RejectModal from './RejectModal';

const PhotoEditApproval: React.FC<ProfileDetailsProps> = ({
  profile,
  setIsModalOpen
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const { showToast } = useToast();

  const { role } = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  const handleViewLinkClick = (link: string) => {
    if (link) window.open(link, '_blank');
  };
  // Old changes for Photo ID
  const renderPhotoIdOld = () => (
    <>
      {renderFileSection(
        'Passport',
        'Old_Passport',
        '12.53 KB',
        'link_to_old_passport'
      )}
      {renderFileSection(
        'Driving License',
        'Old_DrivingLicense',
        '15.23 KB',
        'link_to_old_driving_license'
      )}
      {renderFileSection('Photo', 'Old_Photo', '10.12 KB', 'link_to_old_photo')}
    </>
  );
  //changes frm the resp
  const renderNewChanges = () => {
    const documentChanges = profile?.changes || {};
    return Object.keys(documentChanges).map(key => {
      const documentLink = documentChanges[key];
      //title based on typ
      let title = '';

      switch (key) {
        case 'passport':
          title = 'Passport';
          break;
        case 'driving_license':
          title = 'Driving License';
          break;
        case 'photo':
          title = 'Photo';
          break;
        default:
          title = 'Other Document';
          break;
      }
      return renderFileSection(
        title,
        `${key}_Updated.pdf`,
        '12.34 KB', // Static size
        documentLink
      );
    });
  };

  const renderFileSection = (
    title: string,
    name: string,
    size: string,
    link: string
  ) => (
    <div className="mb-4 w-full rounded-lg bg-white">
      <p className="my-4 text-[20px] font-medium max-sm:text-[11px]">{title}</p>
      <div
        className={`border shadow ${
          isSelected ? 'border-[#1A439A]' : 'border-[#C5C5C5]'
        }`}
        onClick={() => setIsSelected(!isSelected)}
      >
        <div className="flex justify-around">
          <div className="w-[20%] border-r border-[#C5C5C5] p-2 text-center">
            <div className="flex h-full items-center justify-center">
              <img src={proof} alt={title} />
            </div>
          </div>
          <div className="w-[40%] p-4">
            <p className="text-[11px] font-light text-[#646464]">
              {'File name:'}{' '}
              <span className="font-medium text-black">
                {name.length > 7 ? name.substring(0, 7) + '...' : name}
              </span>
            </p>
            <p className="text-[11px] font-light text-[#646464]">
              {'Size: '}
              <span className="font-medium text-black">{size}</span>
            </p>
          </div>
          <div className="flex items-center bg-white p-4">
            <p
              className="flex pr-4 text-[12px] font-medium text-[#1A439A]"
              onClick={() => handleViewLinkClick(link)}
            >
              <img src={eye} className="px-2" alt="view icon" /> {'VIEW'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const handleApprove = async () => {
    const data = {
      id: profile?.id,
      approve: true
    };
    try {
      setIsLoading(true);
      const response = await photoIdDocApprovalApi(data);
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

  return (
    <>
      <Header title="Photo Id Document" />
      <div className="h-[60vh] w-full overflow-y-auto max-lg:h-[65vh]">
        <div className="flex justify-around">
          <div style={{ width: '40%' }}>
            <p className="my-4 text-[20px] font-medium max-sm:text-[11px]">
              {'Old Changes'}
            </p>
            {renderPhotoIdOld()}
          </div>

          <div style={{ width: '40%' }}>
            <p className="my-4 text-[20px] font-medium max-sm:text-[11px]">
              {'New Changes'}
            </p>
            <div> {renderNewChanges()}</div>
            {profile.is_admin_reject === true && (
              <div>
                {profile.rejection_reason ||
                  'No rejection reason provided yet.'}{' '}
              </div>
            )}
          </div>
        </div>
        {[Roles.Manager, Roles.Admin].includes(role) &&
          !profile.is_admin_reject && (
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

export default PhotoEditApproval;
