import { RxCross2 } from 'react-icons/rx';

const DeleteConfirmationModal = ({ closeModal, confirmDelete }) => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      <div className="relative w-full max-w-md md:h-auto">
        <div className="relative rounded bg-white px-2 py-4 shadow">
          <div className="mb-16 flex justify-end px-4 pt-6">
            <p className="my-1 text-[22px] font-medium">
              {'Are you sure you want to Delete ?'}
            </p>
            <button
              onClick={closeModal}
              type="button"
              className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
            >
              <RxCross2 size={24} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-1/2 bg-[tomato] p-4" onClick={confirmDelete}>
              {'Delete'}
            </button>
            <button className="w-1/2 bg-gray-400 p-4" onClick={closeModal}>
              {'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
