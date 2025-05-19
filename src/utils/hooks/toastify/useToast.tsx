import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { toast, ToastOptions, ToastTransition } from 'react-toastify';

import { NotificationType, ToastPosition, ToastTheme } from './enums';

// Define custom toast options interface
interface CustomToastOptions extends ToastOptions {
  type?: NotificationType;
  theme?: ToastTheme;
  transition?: ToastTransition;
  position?: ToastPosition;
}

// Custom hook for toast notifications
const useToast = () => {
  const showToast = (message: string, options?: CustomToastOptions) => {
    // Dismiss all existing toasts before showing a new one
    toast.dismiss();

    // Ensure the position is always top-right
    const mergedOptions: CustomToastOptions = {
      position: ToastPosition.TopRight,
      theme: ToastTheme.Light,
      ...options
    };

    switch (mergedOptions.type) {
      case NotificationType.Info:
        toast.info(message, mergedOptions);
        break;
      case NotificationType.Success:
        toast.success(message, mergedOptions);
        break;
      case NotificationType.Error:
        toast.error(message, mergedOptions);
        break;
      case NotificationType.warning:
        toast.warn(message, mergedOptions);
        break;
      default:
        toast(message, mergedOptions);
        break;
    }
  };

  // Cleanup function to close all toasts on unmount
  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);

  return { showToast };
};

export default useToast;
