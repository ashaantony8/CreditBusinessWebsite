import React, { useEffect, useState } from 'react';
import proof from '../../../assets/images/proof.png';
import eye from '../../../assets/svg/eye.svg';
import { getPhotoId, postPhotoId } from '../../../api/documentsApi';
import { getNameFromUrl } from '../../../utils/helpers';
import FileUploadDropzone from './FileUploadDropzone';
import { useSelector } from 'react-redux';
import { managementSliceSelector } from '../../../store/managementReducer';
import useToast from '../../../utils/hooks/toastify/useToast';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import { MdModeEdit } from 'react-icons/md';
import Loader from '../../../components/Loader';

interface PhotoIdData {
  photo?: string;
  passport?: string;
  driving_license?: string;
}

const PhotoId: React.FC<{ unitId?: number | string }> = ({ unitId }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [photoIdData, setPhotoIdData] = useState<PhotoIdData | null>(null);
  const [passportSize, setPassportSize] = useState<string>('');
  const [photoSize, setPhotoSize] = useState<string>('');
  const [licenseSize, setLicenseSize] = useState<string>('');
  const [passportName, setPassportName] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');
  const [licenseName, setLicenseName] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);

  const [selectedFiles, setSelectedFiles] = useState({
    photo: null,
    passport: null,
    driving_license: null
  });

  const { showToast } = useToast();
  const { unit } = useSelector(managementSliceSelector);
  const companyId = unitId || unit.id;

  useEffect(() => {
    if (companyId) {
      fetchFileData();
    }
  }, [companyId, isEditMode]);

  const handleFileSelect = (file: File, id: string) => {
    setSelectedFiles(prevState => ({
      ...prevState,
      [id]: file
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    if (selectedFiles.photo) formData.append('photo', selectedFiles.photo);
    if (selectedFiles.passport)
      formData.append('passport', selectedFiles.passport);
    if (selectedFiles.driving_license)
      formData.append('driving_license', selectedFiles.driving_license);

    try {
      const response = await postPhotoId(companyId, formData);
      if (response.status_code >= 200 && response.status_code < 300) {
        setIsEditMode(false);
        showToast('Files uploaded successfully', {
          type: NotificationType.Success
        });
      } else {
        console.error('Error uploading files', response);
        showToast('Error uploading files', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.status_message, { type: NotificationType.Error });
    }
  };

  const handleButtonClick = () => {
    if (isEditMode) {
      if (isError) {
        showToast('Please fix the validation error.', {
          type: NotificationType.Error
        });
      } else {
        handleSubmit();
      }
    } else {
      setIsEditMode(prevState => !prevState);
    }
  };

  const fetchFileData = async () => {
    setIsLoading(true);
    setIsSelected(true);
    try {
      const response = await getPhotoId(companyId);
      if (response.status_code >= 200 && response.status_code < 300) {
        setPhotoIdData(response.data);
        const { photo, passport, driving_license } = response.data;
        if (photo) fetchFileSize(photo, setPhotoSize);
        if (passport) fetchFileSize(passport, setPassportSize);
        if (driving_license) fetchFileSize(driving_license, setLicenseSize);
      } else {
        console.error('Error fetching photo ID', response);
      }
    } catch (error) {
      showToast(error.status_message, { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFileSize = async (
    url: string,
    setSize: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const size = (blob.size / 1024).toFixed(2);
      setSize(`${size} KB`);
    } catch (error) {
      console.error('Error fetching file size:', error);
    }
  };

  const handleViewLinkClick = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const handleDeleteFile = async (
    fileType: 'photo' | 'passport' | 'driving_license'
  ) => {
    setPhotoIdData(prevData => ({
      ...prevData,
      [fileType]: null
    }));
    setSelectedFiles(prevState => ({
      ...prevState,
      [fileType]: null
    }));
  };

  useEffect(() => {
    if (photoIdData) {
      if (photoIdData.passport)
        setPassportName(getNameFromUrl(photoIdData.passport));
      if (photoIdData.photo) setPhotoName(getNameFromUrl(photoIdData.photo));
      if (photoIdData.driving_license)
        setLicenseName(getNameFromUrl(photoIdData.driving_license));
    }
  }, [photoIdData]);

  const renderProofSection = (
    title: string,
    name: string,
    size: string,
    link: string,
    fileType: 'photo' | 'passport' | 'driving_license'
  ) => (
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <p className="mb-2 text-sm font-medium text-gray-700">{title}</p>
      <div
        className={`border ${isSelected ? 'border-blue-600' : 'border-gray-300'} rounded-md p-4`}
      >
        <div className="flex items-center space-x-4">
          <img src={proof} alt="proof" className="h-12 w-12" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              File Name:{' '}
              <span className="font-medium">
                {name.length > 7 ? name.substring(0, 7) + '...' : name}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Size: <span className="font-medium">{size}</span>
            </p>
          </div>
          <div className="flex items-center">
            {isEditMode && (
              <button
                className="mr-4 text-red-600 hover:underline"
                onClick={() => handleDeleteFile(fileType)}
              >
                Delete
              </button>
            )}
            <button
              className="flex items-center text-blue-600 hover:underline"
              onClick={() => handleViewLinkClick(link)}
            >
              <img src={eye} alt="eye" className="mr-2" />
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoDataSection = (title: string) => (
    <div className="flex w-full flex-col items-center justify-center space-y-2 rounded-lg bg-white p-4 shadow-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <img src={proof} alt="no data" className="h-8 w-8 opacity-50" />
      </div>
      <p className="text-center text-sm font-medium text-gray-600">
        No {title} uploaded
      </p>
    </div>
  );

  return (
    <div className="m-4 space-y-6">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      {!isEditMode && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleButtonClick}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
          >
            <MdModeEdit className="mx-2" />
            Edit
          </button>
        </div>
      )}

      {/* Responsive grid layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photoIdData?.photo ? (
          renderProofSection(
            "Owner's Photo",
            photoName,
            photoSize,
            photoIdData?.photo,
            'photo'
          )
        ) : isEditMode ? (
          <FileUploadDropzone
            setIsError={setIsError}
            id="photo"
            editMode={isEditMode}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFiles.photo}
            title={"Owner's Photo"}
            handleDeleteFile={handleDeleteFile}
          />
        ) : (
          renderNoDataSection("Owner's Photo")
        )}

        {photoIdData?.passport ? (
          renderProofSection(
            'Passport',
            passportName,
            passportSize,
            photoIdData?.passport,
            'passport'
          )
        ) : isEditMode ? (
          <FileUploadDropzone
            setIsError={setIsError}
            id="passport"
            editMode={isEditMode}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFiles.passport}
            title={'Passport'}
            handleDeleteFile={handleDeleteFile}
          />
        ) : (
          renderNoDataSection('Passport')
        )}

        {photoIdData?.driving_license ? (
          renderProofSection(
            'Driving License',
            licenseName,
            licenseSize,
            photoIdData?.driving_license || '',
            'driving_license'
          )
        ) : isEditMode ? (
          <FileUploadDropzone
            setIsError={setIsError}
            id="driving_license"
            editMode={isEditMode}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFiles.driving_license}
            title={'Driving License'}
            handleDeleteFile={handleDeleteFile}
          />
        ) : (
          renderNoDataSection('Driving License')
        )}
      </div>

      {isEditMode && (
        <div className="flex justify-end gap-2">
          <button
            onClick={handleButtonClick}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            onClick={() => {
              setIsEditMode(false);
            }}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoId;
