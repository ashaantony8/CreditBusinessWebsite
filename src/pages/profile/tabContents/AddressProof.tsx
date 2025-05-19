import React, { useEffect, useState } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { useSelector } from 'react-redux';

import {
  getAddressProofOptions,
  postAddressProof
} from '../../../api/documentsApi';
import proof from '../../../assets/images/proof.png';
import eye from '../../../assets/svg/eye.svg';
import { managementSliceSelector } from '../../../store/managementReducer';
import { getNameFromUrl } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import FileUploadDropzone from './FileUploadDropzone';
import Loader from '../../../components/Loader';

interface AddressProofData {
  council_tax?: string;
  utility_bill?: string;
  lease_deed?: string;
}

const AddressProof: React.FC<{ unitId?: number | string }> = ({ unitId }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [addressProofData, setAddressProofData] =
    useState<AddressProofData | null>(null);
  const [councilTaxSize, setCouncilTaxSize] = useState('');
  const [utilityBillSize, setUtilityBillSize] = useState('');
  const [leaseDeedSize, setLeaseDeedSize] = useState('');
  const [councilTaxName, setCouncilTaxName] = useState('');
  const [utilityBillName, setUtilityBillName] = useState('');
  const [leaseDeedName, setLeaseDeedName] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState({
    council_tax: null,
    utility_bill: null,
    lease_deed: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();
  const { unit } = useSelector(managementSliceSelector);
  const companyId = unit.id || unitId;

  useEffect(() => {
    if (companyId) {
      fetchDetails();
    }
  }, [companyId]);

  const handleFileSelect = (file: File, id: string) => {
    setSelectedFiles(prevState => ({
      ...prevState,
      [id]: file
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (selectedFiles.council_tax)
      formData.append('council_tax', selectedFiles.council_tax);
    if (selectedFiles.utility_bill)
      formData.append('utility_bill', selectedFiles.utility_bill);
    if (selectedFiles.lease_deed)
      formData.append('lease_deed', selectedFiles.lease_deed);
    try {
      const response = await postAddressProof(companyId, formData);
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

  const fetchDetails = async () => {
    setIsLoading(true);
    setIsSelected(true);
    try {
      const response = await getAddressProofOptions(companyId);
      if (response.status_code >= 200 && response.status_code < 300) {
        setAddressProofData(response.data);
        const { council_tax, utility_bill, lease_deed } = response.data;
        if (council_tax) fetchFileSize(council_tax, setCouncilTaxSize);
        if (utility_bill) fetchFileSize(utility_bill, setUtilityBillSize);
        if (lease_deed) fetchFileSize(lease_deed, setLeaseDeedSize);
      } else {
        console.error('Error fetching address proof', response);
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
    fileType: 'council_tax' | 'utility_bill' | 'lease_deed'
  ) => {
    setAddressProofData(prevData => ({
      ...prevData,
      [fileType]: null
    }));
    setSelectedFiles(prevState => ({
      ...prevState,
      [fileType]: null
    }));
  };

  useEffect(() => {
    if (addressProofData) {
      if (addressProofData.council_tax)
        setCouncilTaxName(getNameFromUrl(addressProofData.council_tax));
      if (addressProofData.utility_bill)
        setUtilityBillName(getNameFromUrl(addressProofData.utility_bill));
      if (addressProofData.lease_deed)
        setLeaseDeedName(getNameFromUrl(addressProofData.lease_deed));
    }
  }, [addressProofData]);

  const renderProofSection = (
    title: string,
    name: string,
    size: string,
    link: string,
    fileType: 'council_tax' | 'utility_bill' | 'lease_deed'
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
        {addressProofData?.council_tax ? (
          renderProofSection(
            'Council Tax',
            councilTaxName,
            councilTaxSize,
            addressProofData?.council_tax,
            'council_tax'
          )
        ) : isEditMode ? (
          <FileUploadDropzone
            setIsError={setIsError}
            id="council_tax"
            editMode={isEditMode}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFiles.council_tax}
            title={'Council Tax'}
            handleDeleteFile={handleDeleteFile}
          />
        ) : (
          renderNoDataSection('Council Tax')
        )}

        {addressProofData?.utility_bill ? (
          renderProofSection(
            'Utility Bill',
            utilityBillName,
            utilityBillSize,
            addressProofData?.utility_bill,
            'utility_bill'
          )
        ) : isEditMode ? (
          <FileUploadDropzone
            setIsError={setIsError}
            id="utility_bill"
            editMode={isEditMode}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFiles.utility_bill}
            title={'Utility Bill'}
            handleDeleteFile={handleDeleteFile}
          />
        ) : (
          renderNoDataSection('Utility Bill')
        )}

        {addressProofData?.lease_deed ? (
          renderProofSection(
            'Lease Deed',
            leaseDeedName,
            leaseDeedSize,
            addressProofData?.lease_deed,
            'lease_deed'
          )
        ) : isEditMode ? (
          <FileUploadDropzone
            setIsError={setIsError}
            id="lease_deed"
            editMode={isEditMode}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFiles.lease_deed}
            title={'Lease Deed'}
            handleDeleteFile={handleDeleteFile}
          />
        ) : (
          renderNoDataSection('Lease Deed')
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

export default AddressProof;
