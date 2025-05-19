import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { customerApprovalApi } from '../../../api/userServices';
import { authSelector } from '../../../store/auth/userSlice';
import { ApplicationStatusBadgeClasses } from '../../../utils/data';
import {
  FundingFromCurrentStatus,
  FundingFromStatusEnum
} from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

function RequestPending() {
  const [customers, setCustomers] = useState([]);

  const { showToast } = useToast();
  const user = useSelector(authSelector);
  const userId = user.id;

  useEffect(() => {
    fetchCustomers(userId);
  }, [userId]);

  const fetchCustomers = async userId => {
    try {
      const response = await customerApprovalApi(userId);
      const { profile_changes, photo_id_changes, address_proof_changes } =
        response.data;

      // Combine all changes into a single array
      const allChanges = [
        ...profile_changes,
        ...photo_id_changes,
        ...address_proof_changes
      ];

      setCustomers(allChanges);

      // if (response.status_code >= 200 && response.status_code < 300) {
      //   showToast("Profile approved successfully", {
      //     type: NotificationType.Success,
      //   });
      // } else {
      //   showToast(response.status_message, { type: NotificationType.Error });
      // }
    } catch (error) {
      console.error('Failed to fetch customers', error);
      showToast('Failed to fetch customer data', {
        type: NotificationType.Error
      });
    }
  };

  return (
    <div className="card mt-8 rounded border p-4 shadow-md max-sm:w-full lg:w-1/2">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between">
          <strong>{'Pending Request'}</strong>
          <strong>{'Status'}</strong>
        </div>
        <div className="divide-y divide-gray-200">
          {customers.length > 0 ? (
            customers.map(({ name, email, is_admin_approved }, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center justify-between pb-3 pt-3 last:pb-0"
              >
                <div className="flex items-center gap-x-3 text-[13px]">
                  <div>
                    <strong>{name}</strong>
                    <div className="text-[#929292]">{email}</div>
                  </div>
                </div>
                <div color="blue-gray">
                  <span
                    className={`-mt-6 ml-4 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-4 max-sm:mt-1 max-sm:text-[9px] ${
                      ApplicationStatusBadgeClasses[
                        is_admin_approved?.current_status ||
                          FundingFromCurrentStatus.Inprogress
                      ]
                    }`}
                  >
                    {FundingFromStatusEnum?.[
                      is_admin_approved?.current_status
                    ] || FundingFromCurrentStatus.Inprogress}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              {'No pending requests'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestPending;
