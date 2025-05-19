import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { customerBankStatementApi } from '../../../api/documentsApi';
import proof from '../../../assets/images/proof.png';
import eye from '../../../assets/svg/eye.svg';
import { managementSliceSelector } from '../../../store/managementReducer';
import { getNameFromUrl } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

interface FileObject {
  file: string;
}

const BankStatement: React.FC<{ unitId?: string }> = ({ unitId }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [otherFilesData, setOtherFilesData] = useState<FileObject[]>([]);
  const [files, setFiles] = useState<
    { url: string; name: string; size: string }[]
  >([]);
  const { showToast } = useToast();
  const { unit } = useSelector(managementSliceSelector);
  const companyId = unit.id || unitId;
  useEffect(() => {
    fetchFileData();
  }, []);

  const fetchFileData = async () => {
    setIsSelected(true);
    try {
      const customerBankStatementApiResponse = await customerBankStatementApi({
        unitId: companyId
      });
      if (
        customerBankStatementApiResponse.status_code >= 200 &&
        customerBankStatementApiResponse.status_code < 300
      ) {
        const otherFiles =
          customerBankStatementApiResponse?.data?.business_account_statements;
        if (otherFiles.length > 0) {
          setOtherFilesData(otherFiles);
        }
      } else {
        showToast(customerBankStatementApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('Error fetching photo ID:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  const fetchFileSize = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const size = (blob.size / 1024).toFixed(2);
      return size;
    } catch (error) {
      console.error('Error fetching file size:', error);
      return 'N/A';
    }
  };

  useEffect(() => {
    const fetchFilesData = async () => {
      if (otherFilesData.length > 0) {
        const files = await Promise.all(
          otherFilesData.map(async item => {
            const name = getNameFromUrl(item.file);
            const size = await fetchFileSize(item.file);

            return {
              url: item.file,
              name,
              size
            };
          })
        );
        setFiles(files);
      }
    };

    fetchFilesData();
  }, [otherFilesData]);

  const handleViewLinkClick = (link: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const renderProofSection = (item: {
    url: string;
    name: string;
    size: string;
  }) => (
    <div className="w-full rounded-lg bg-white py-4">
      <div
        className={`border shadow ${
          isSelected ? 'border-[#1A439A]' : 'border-[#C5C5C5]'
        }`}
      >
        <div className="flex justify-around">
          <div
            className={`border-r ${
              isSelected ? 'border-[#1A439A]' : 'border-[#C5C5C5]'
            } w-[20%] p-2 text-center`}
          >
            <div className="flex h-full items-center justify-center">
              <img src={proof} alt="proof" />
            </div>
          </div>
          <div className="w-[40%] p-4">
            <div>
              <p className="my-1 text-[11px] font-light text-[#646464]">
                {'File name:'}{' '}
                <a className="font-medium text-black">
                  {' '}
                  {item.name.length > 7
                    ? item.name.substring(0, 7) + '...'
                    : item.name}
                </a>
              </p>
              <p className="text-[11px] font-light text-[#646464]">
                {'Size:'}{' '}
                <a className="font-medium text-black">{`${item.size} KB`}</a>
              </p>
            </div>
          </div>
          <div className="flex items-center bg-white p-4">
            <div className="flex max-sm:grid">
              <p
                className="flex pr-4 text-[12px] font-medium text-[#1A439A]"
                onClick={() => handleViewLinkClick(item.url)}
              >
                <img src={eye} alt="eye" className="px-2" /> {'VIEW'}
              </p>
            </div>
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {files.length > 0
          ? files.map((item, index) => (
              <div key={index}>{renderProofSection(item)}</div>
            ))
          : renderNoDataSection('Statement')}
      </div>
    </div>
  );
};

export default BankStatement;
