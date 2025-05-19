import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

import { generalLedgerPostApi } from '../../../api/financeManagerServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { Category, Subcategory } from '../../../utils/types';
import AssetModal from '../assets/AssetModal';
import MasterList from '../MasterList';

interface EquitySubOptionsProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Equity = ({
  categories,
  setCategories,
  isModalOpen,
  setIsModalOpen
}: EquitySubOptionsProps) => {
  const [newAssetName, setNewAssetName] = useState('');
  const [newGlId, setNewGlId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [glIdErrorMessage, setGlIdErrorMessage] = useState('');

  const { showToast } = useToast();

  const openModal = (categoryId: string) => {
    setIsModalOpen(true);
    setSelectedCategoryId(categoryId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewAssetName('');
    setNewGlId('');
    setSelectedCategoryId(null);
  };

  const handleAddAsset = async e => {
    e.preventDefault();
    setNameErrorMessage('');
    setGlIdErrorMessage('');
    // Validate newAssetName
    if (newAssetName.trim() === '') {
      setNameErrorMessage('Name is required');
    }

    // Validate newGlId
    if (newGlId.trim() === '') {
      setGlIdErrorMessage('GL ID is required');
    }
    if (newAssetName.trim() === '' || newGlId.trim() === '') {
      return;
    }

    if (!selectedCategoryId) return;
    try {
      const response = await generalLedgerPostApi({
        gl_name: newAssetName,
        gl_code: newGlId,
        sub_category: selectedCategoryId
      });

      if (response.status_code >= 200 && response.status_code < 300) {
        showToast(response.status_message, { type: NotificationType.Success });
        const newAsset: Subcategory = {
          id: response.data.id,
          gl_name: response.data.gl_name,
          gl_code: response.data.gl_code
        };

        const updatedCategories = categories.map(category =>
          category.id === selectedCategoryId
            ? {
                ...category,
                subcategories: [...(category.subcategories || []), newAsset]
              }
            : category
        );

        setCategories(updatedCategories);
        closeModal();
      } else {
        showToast('GL-code already exists', { type: NotificationType.Error });
      }
    } catch (error) {
      console.error('Error adding new asset:', error);
    }
  };

  return (
    <>
      {categories.map(category => (
        <div key={category.id} className="mx-auto p-2">
          <MasterList
            Subtitle1={category.category_name}
            openModal={() => openModal(category.id)}
            localAssets={category.gl_code}
          />
        </div>
      ))}
      {isModalOpen && (
        <AssetModal>
          <form onSubmit={handleAddAsset}>
            <div className="mb-4">
              <div className="flex justify-end py-2">
                <p className="my-1 text-[15px] font-medium">{'Add New Item'}</p>
                <button
                  onClick={closeModal}
                  type="button"
                  className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-400"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
              <input
                type="text"
                id="assetName"
                placeholder="Name"
                value={newAssetName}
                onChange={e => {
                  setNewAssetName(e.target.value);
                  setNameErrorMessage('');
                }}
                className="my-2 w-full appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none"
              />
              {nameErrorMessage && (
                <p className="mt-1 text-sm text-red-500">{nameErrorMessage}</p>
              )}
              <input
                type="text"
                id="glId"
                placeholder="Gl id"
                value={newGlId}
                onChange={e => {
                  setNewGlId(e.target.value);
                  setGlIdErrorMessage('');
                }}
                className="my-2 w-full appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none"
              />
              {glIdErrorMessage && (
                <p className="mt-1 text-sm text-red-500">{glIdErrorMessage}</p>
              )}
            </div>
            <div className="my-2 pt-2">
              <button
                type="submit"
                className="focus:shadow-outline w-full bg-[#1A439A] px-4 py-2 font-bold text-white hover:bg-blue-900 focus:outline-none"
              >
                {'SUBMIT'}
              </button>
            </div>
          </form>
        </AssetModal>
      )}
    </>
  );
};

export default Equity;
