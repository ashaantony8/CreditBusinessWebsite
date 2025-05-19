import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import proof from '../../../assets/images/proof.png';
import { Dispatch, SetStateAction } from 'react';

interface FileUploadDropzoneProps {
  id: string;
  onFileSelect: (file: File, id: string) => void;
  selectedFile: File | null;
  editMode: boolean;
  title: string;
  handleDeleteFile: (fileType: string) => void;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  id,
  onFileSelect,
  selectedFile,
  editMode,
  title,
  handleDeleteFile,
  setIsError
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setError('Please avoid submitting with empty data');
    }
    if (error) {
      setIsError(true);
    }
  }, [error, selectedFile]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    // Check if the file is empty
    if (!file) {
      setError('No file selected.');
      return;
    }

    // Check file size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_SIZE) {
      setError('File size exceeds 2MB.');
      return;
    }

    // If validation passes, call onFileSelect
    setError(null); // Clear any previous error
    onFileSelect(file, id);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: !editMode
  });

  return (
    <div
      className={`dropzone-container ${isDragActive ? 'drag-active' : ''} ${
        editMode ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <div>
        {selectedFile ? (
          <div className="w-full rounded-lg bg-white p-4 shadow-md">
            <p className="mb-2 text-sm font-medium text-gray-700">{title}</p>
            <div className={`rounded-md border border-blue-600 p-4`}>
              <div className="flex items-center space-x-4">
                <img src={proof} alt="proof" className="h-12 w-12" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    File Name:{' '}
                    <span className="font-medium">{selectedFile.name}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Size:{' '}
                    <span className="font-medium">{selectedFile.size}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    className="mr-4 text-red-600 hover:underline"
                    onClick={() => handleDeleteFile(id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="dropzone-content flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-all duration-300 ease-in-out hover:border-gray-500"
            {...getRootProps()}
            onDragEnter={() => setIsDragActive(true)}
            onDragLeave={() => setIsDragActive(false)}
          >
            <FiUpload className="mb-3 text-gray-500" size={40} />
            <p className="text-sm text-gray-500 md:text-base">
              Drag & Drop a file here, or click to select a file
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadDropzone;
