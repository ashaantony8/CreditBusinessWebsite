import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { bulkuploadLoanGetApi } from '../../../api/loanServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { BulkUploadFundingDetailsProps } from '../../../utils/types';

const BulkUploadFundingDetails: React.FC = () => {
  const { id } = useParams();
  const [selectedDetail, setSelectedDetail] =
    useState<BulkUploadFundingDetailsProps>();
  const navigate = useNavigate();

  const { showToast } = useToast();

  const fetchGetbulkdata = async id => {
    try {
      const response = await bulkuploadLoanGetApi(id);

      if (response?.status_code === 200) {
        setSelectedDetail(response.data);
        showToast('File uploaded successfully', {
          type: NotificationType.Success
        });
      } else {
        showToast('Something went wrong', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('File Upload Error:', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (id) {
      fetchGetbulkdata(id);
    }
  }, [id]);

  return (
    <div className="mt-6 rounded bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-bold">Detail View</h2>
      <p>
        <strong>ID:</strong> {selectedDetail?.id || 'NA'}
      </p>
      <p>
        <strong>Created On:</strong>{' '}
        {selectedDetail?.created_on
          ? format(new Date(selectedDetail?.created_on), 'yyyy-MM-dd HH:mm')
          : 'NA'}
      </p>
      <p>
        <strong>Modified On:</strong>{' '}
        {selectedDetail?.modified_on
          ? format(new Date(selectedDetail?.modified_on), 'yyyy-MM-dd HH:mm')
          : 'NA'}
      </p>
      <p>
        <strong>File:</strong> {selectedDetail?.file}
      </p>
      <p>
        <strong>Total New Loans:</strong>{' '}
        {selectedDetail?.total_new_loans || 'NA'}
      </p>
      <p>
        <strong>Updated Loans:</strong> {selectedDetail?.updated_loans || 'NA'}
      </p>
      <p>
        <strong>Processed:</strong> {selectedDetail?.processed ? 'Yes' : 'No'}
      </p>
      <p>
        <strong>Success:</strong> {selectedDetail?.success ? 'Yes' : 'No'}
      </p>
      <button
        onClick={() => navigate(`/bulk-upload-funding`)}
        className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Close
      </button>
    </div>
  );
};

export default BulkUploadFundingDetails;
