import { RxCross2 } from 'react-icons/rx';

const DeleteModals = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modelConfirm"
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-60 px-4"
    >
      <div className="relative mx-auto max-w-md rounded-md bg-white shadow-xl">
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            type="button"
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
          >
            <RxCross2 size={31} />
          </button>
        </div>
        <div className="p-6 pt-0 text-center">
          <svg
            className="mx-auto h-20 w-20 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>

          <h3 className="mb-6 mt-5 text-xl font-normal text-gray-500">
            {'Are you sure you want to delete this?'}
          </h3>
          <button
            onClick={onDelete}
            className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2.5 text-center text-base font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300"
          >
            {"Yes, I'm sure"}
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200"
          >
            {'No, cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModals;
