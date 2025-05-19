import React from 'react';
import { RxCross2 } from 'react-icons/rx';

interface ShowHandleApproveModalProps {
  title: string;
  isOpen: boolean;
  onApprove: () => void;
  onClose: () => void;
  message?: string;
}

const ShowHandleApproveModal: React.FC<ShowHandleApproveModalProps> = ({
  title,
  isOpen,
  onApprove,
  onClose,
  message = 'Are you sure you want to approve this action?'
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
            onClick={onApprove}
            className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
          >
            {'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowHandleApproveModal;
