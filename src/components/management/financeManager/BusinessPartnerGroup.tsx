import React, { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

import {
  bpGroupDeleteApi,
  bpGroupGetApi,
  bpGroupPostApi
} from '../../../api/financeManagerServices';
import threeDots from '../../../assets/svg/threeDots.svg';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';
import AssetModal from '../../master/assets/AssetModal';
import ConfirmationModal from '../common/ConfirmationModal';
import Header from '../common/Header';
import Pagination from '../common/Pagination';
import ActionModal from '../common/ThreeDotAction';
import usePagination from '../common/usePagination';

const BusinessPartnerGroup: React.FC = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bpGroupName, setBpGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAction, setIsAction] = useState(false);
  const [actionLeadId, setActionLeadId] = useState<string | null>(null);

  const {
    data,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    goToPage,
    callPaginate,
    handleSearch,
    userPaginateException
  } = usePagination(bpGroupGetApi);

  useEffect(() => {
    setIsLoading(true);
    callPaginate();
  }, []);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (userPaginateException) {
      showToast(userPaginateException as string, {
        type: NotificationType.Error
      });
      setIsLoading(false);
    }
  }, [userPaginateException]);

  const openModal = (groupName = '', groupId: string | null = null) => {
    setBpGroupName(groupName);
    setEditingGroupId(groupId);
    setIsAddEditModalOpen(true);
    setErrorMessage('');
  };

  const closeModal = () => {
    setIsAddEditModalOpen(false);
    setBpGroupName('');
    setEditingGroupId(null);
  };

  const openDeleteModal = (groupId: string) => {
    setGroupToDelete(groupId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpGroupName(e.target.value);
    setErrorMessage('');
  };

  const handleAddOrEditGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bpGroupName.trim() === '') {
      setErrorMessage('This field is required');
      return;
    }

    try {
      const payload = editingGroupId
        ? { group_name: bpGroupName, id: editingGroupId }
        : { group_name: bpGroupName };
      const response = await bpGroupPostApi(payload);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        closeModal();
        setIsLoading(true);
        callPaginate(); // Re-fetch the groups after adding/editing
      } else {
        showToast('Group name already exists.', {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('Error adding or editing group:', error);
      showToast('An error occurred.', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;
    setIsLoading(true);

    try {
      const response = await bpGroupDeleteApi(groupToDelete);
      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        closeDeleteModal();
        setIsLoading(true);
        callPaginate(); // Re-fetch the groups after deletion
      } else {
        showToast('Failed to delete group.', { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      showToast('An error occurred.', { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTableData = () =>
    data.length > 0 ? (
      data.map((group, index) => (
        <div key={index} className="container mx-auto px-2 pt-2">
          <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-300 bg-white p-4">
            <div className="font-semibold">{group.group_name}</div>
            <div className="relative flex gap-2">
              <img
                src={threeDots}
                onClick={() => {
                  setActionLeadId(group.id);
                  setIsAction(prevState => !prevState);
                }}
                className="cursor-pointer"
              />
              {isAction && actionLeadId === group.id && (
                <div className="absolute right-0 top-0 z-10 mt-8">
                  <ActionModal
                    setIsAction={setIsAction}
                    setIsDeleteModalOpen={() => {
                      openDeleteModal(group.id);
                    }}
                    setIsEditModalOpen={() => {
                      openModal(group.group_name, group.id);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="py-4 text-center">{'No data available'}</div>
    );

  return (
    <>
      <Header
        title="Business Partner Group"
        onSearch={handleSearch}
        onAdd={() => openModal()}
      />
      {isLoading ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      ) : (
        <div className="flex h-[75%] flex-1 flex-col overflow-y-auto bg-white max-sm:h-[64vh]">
          {renderTableData()}
        </div>
      )}

      {isAddEditModalOpen && (
        <AssetModal>
          <form onSubmit={handleAddOrEditGroup}>
            <div className="mb-4">
              <div className="flex justify-between py-2">
                <p className="my-1 text-[15px] font-medium">
                  {editingGroupId
                    ? 'Edit Partner Group'
                    : 'Add New Partner Group'}
                </p>
                <button
                  onClick={closeModal}
                  type="button"
                  className="rounded-lg bg-transparent p-1.5 text-gray-400 hover:bg-gray-200"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
              <input
                type="text"
                id="bpGroupName"
                placeholder="Name"
                value={bpGroupName}
                onChange={handleInputChange}
                className="my-2 w-full rounded border px-3 py-2 leading-tight text-[#737373] focus:outline-none"
              />
              {errorMessage && (
                <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
              )}
            </div>
            <div className="my-2 pt-2">
              <button
                type="submit"
                className="w-full bg-[#1A439A] px-4 py-2 font-bold text-white hover:bg-blue-900"
              >
                {editingGroupId ? 'UPDATE' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </AssetModal>
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteGroup}
          title="Confirm Deletion"
          message="Are you sure you want to delete this group?"
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        goToPage={goToPage}
      />
    </>
  );
};

export default BusinessPartnerGroup;
