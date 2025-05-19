import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { bulkuploadLoanPostApi } from '../../../api/loanServices';
import useToast from '../../../utils/hooks/toastify/useToast';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import Loader from '../../Loader';

const UploadFundingModal = ({ onClose }: { onClose: () => void }) => {
  const { showToast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const [uploadFail, setUploadFail] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      // Check if file is .xlsx
      if (
        selectedFile &&
        selectedFile.type !==
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        showToast('Please select a valid .xlsx file', {
          type: NotificationType.Error
        });
        setFile(null); // Reset file input
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    setIsLoading(true);
    if (!file) {
      showToast('Please select a file to upload', {
        type: NotificationType.Error
      });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await bulkuploadLoanPostApi(formData);

      if (response?.status_code === 200) {
        setUploadSuccess('File uploaded successfully');
        showToast('File uploaded successfully', {
          type: NotificationType.Success
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setUploadFail('Upload failed, please try again');
        showToast('Something went wrong', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('File Upload Error:', error);
      setUploadFail('Upload failed, please try again');
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      {isLoading && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      )}
      <div className="relative w-full max-w-[500px] md:h-auto">
        <div className="relative flex min-h-[50vh] flex-col justify-between rounded-lg bg-white p-6 shadow-lg">
          <button
            onClick={onClose}
            type="button"
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <RxCross2 size={24} />
          </button>

          <h2 className="mb-4 text-center text-xl font-semibold">
            Upload Funding File
          </h2>

          <div className="mb-6 mt-16 flex w-full flex-col items-center justify-center">
            <div className="flex w-full justify-center">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="mb-2 block text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {uploadSuccess && (
              <p className="mt-2 text-sm text-green-600">{uploadSuccess}</p>
            )}
            {uploadFail && (
              <p className="mt-2 text-sm text-red-600">{uploadFail}</p>
            )}
          </div>

          <div className="mt-auto flex w-full justify-between gap-4">
            <button
              onClick={handleFileUpload}
              type="button"
              className="w-1/2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Upload File
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-1/2 rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFundingModal;
