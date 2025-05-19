import React from 'react';
import { RxCross2 } from 'react-icons/rx';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[80%] max-w-[600px] rounded-lg bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg bg-transparent p-1.5 text-gray-400 hover:bg-gray-200"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        <p className="py-4 text-sm">{message}</p>

        <div className="flex justify-end space-x-4 border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 font-bold text-black hover:bg-gray-400"
          >
            {'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
          >
            {'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
