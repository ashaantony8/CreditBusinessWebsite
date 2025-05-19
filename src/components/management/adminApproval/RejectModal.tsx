import { useState } from 'react';

import {
  addressProofRejectApi,
  photoIdRejectApi,
  unitProfileRejectApi
} from '../../../api/loanServices';
import { customerProfileRejectApi } from '../../../api/userServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

function RejectModal({ onClose, setIsLoading, profile, setIsModalOpen }) {
  const [modalRejectReason, setModalRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { showToast } = useToast();

  const handleCancel = () => {
    onClose();
    setModalRejectReason('');
  };

  const handleReject = async () => {
    if (!modalRejectReason) {
      setValidationError('Field is required');
      return;
    }
    const data = {
      id: profile?.id,
      reject: true,
      rejection_reason: modalRejectReason
    };
    try {
      setIsSubmitting(true);
      setIsLoading(true);

      let response;
      if (profile.type === 'photo_id') {
        response = await photoIdRejectApi(data);
      } else if (profile.type === 'address_proof') {
        response = await addressProofRejectApi(data);
      } else if (profile.type === 'unit_profile') {
        response = await unitProfileRejectApi(data);
      } else if (profile.type === 'customer_profile') {
        response = await customerProfileRejectApi(data);
      }
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast('Profile Rejected successfuly', {
          type: NotificationType.Success
        });
        setTimeout(() => {
          onClose();
        }, 1000);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1500);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Failed to reject', error);
      showToast('Failed to reject the profile', {
        type: NotificationType.Error
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">
            {'Are you sure you want to reject?'}
          </h2>
          <textarea
            placeholder="Enter rejection reason..."
            value={modalRejectReason}
            onChange={e => setModalRejectReason(e.target.value)}
            className="mb-4 w-full resize-none rounded-md border border-gray-300 p-2"
            rows={4}
          />
          {validationError && (
            <p className="mb-4 text-sm text-red-500">{validationError}</p>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
            >
              {'Cancel'}
            </button>
            <button
              onClick={handleReject}
              className={`rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${
                isSubmitting || !modalRejectReason
                  ? 'cursor-pointer'
                  : 'cursor-pointer'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Rejecting...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RejectModal;
