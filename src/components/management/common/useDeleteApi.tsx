import { useState } from 'react';

import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

const useDeleteApi = deleteApi => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const deleteItem = async id => {
    setIsDeleting(true);
    try {
      const response = await deleteApi(id);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        return { success: true, id };
      } else {
        showToast(response.status_title || 'Failed to delete item', {
          type: NotificationType.Error
        });
        return { success: false };
      }
    } catch (error) {
      showToast(error.response?.data?.status_title || 'An error occurred', {
        type: NotificationType.Error
      });
      return { success: false };
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteItem, isDeleting };
};

export default useDeleteApi;
