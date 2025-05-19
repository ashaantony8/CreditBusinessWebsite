import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import proof from '../../../assets/images/proof.png';
import eye from '../../../assets/svg/eye.svg';
import trash from '../../../assets/svg/trash.svg';
import { getAddressProofOptions } from '../../api/documentsApi';
import { setAddressProof } from '../../store/auth/userSlice';

interface AddressProofData {
  council_tax?: string;
  utility_bill?: string;
  lease_deed?: string;
}

const Bankstatement = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [addressProofData, setAddressProofData] =
    useState<AddressProofData | null>(null);
  const [drivingLicenceSize, setDrivingLicenceSize] = useState('');

  useEffect(() => {
    fetchDetails();
  }, []);

  const dispatch = useDispatch();
  const fetchDetails = async () => {
    setIsSelected(!isSelected);
    try {
      const response = await getAddressProofOptions(null);
      dispatch(setAddressProof(response.data));
      setAddressProofData(response.data);
      if (response.data.driving_licence) {
        fetchFileSize(response.data.driving_licence, setDrivingLicenceSize);
      }
    } catch (error) {
      console.error('Error fetching address proof options:', error);
    }
  };

  const renderFileSection = (title: string, size: string, link: string) => (
    <div className="mb-8 w-full rounded-lg bg-white sm:p-8 lg:px-6 xl:px-6">
      <p className="my-4 text-[16px] font-medium">{title}</p>
      <div
        className={`border shadow ${
          isSelected ? 'border-[#1A439A]' : 'border-[#C5C5C5]'
        }`}
        onClick={fetchDetails}
      >
        <div className="flex justify-around">
          <div className="w-[20%] border-r border-[#C5C5C5] p-2 text-center">
            <div className="flex h-full items-center justify-center">
              <img src={proof} alt={title} />
            </div>
          </div>
          <div className="w-[40%] p-4">
            <div>
              <p className="text-[12px] font-light text-[#646464]">
                {'File name'}
              </p>
              <p className="text-[12px] font-light text-[#646464]">
                {'Size : '}
                <a className="font-medium text-black">{size}</a>
              </p>
            </div>
          </div>
          <div className="flex items-center bg-white p-4">
            <div className="flex max-sm:grid">
              <p
                className="flex pr-4 text-[12px] font-medium text-[#1A439A]"
                onClick={() => handleViewLinkClick(link)}
              >
                <img src={eye} className="px-2" /> {'VIEW'}
              </p>
              <p className="flex pr-2 text-[12px] font-medium text-[#840000]">
                <img src={trash} className="px-2" /> {'DELETE'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
  const handleViewLinkClick = link => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="container mx-auto">
      <div className="-mx-4 flex flex-wrap">
        <div className="w-full px-4 lg:w-1/2">
          {renderFileSection(
            'Driving Licence',
            drivingLicenceSize,
            addressProofData?.lease_deed || ''
          )}
        </div>
      </div>
    </div>
  );
};

export default Bankstatement;
