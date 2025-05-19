import { useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';

import {
  mainCategoryGetApi,
  subCategoryGetApi,
  subCategoryPostApi
} from '../../../api/financeManagerServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { Category } from '../../../utils/types';
import AssetModal from '../assets/AssetModal';
import Expense from './Expense';
import ExpenseHeader from './ExpenseHeader';

const ExpenseManager = () => {
  const [assets, setAssets] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainId, setMainId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { showToast } = useToast();
  // for main-id
  useEffect(() => {
    const fetchMainId = async () => {
      const resp = await mainCategoryGetApi();
      if (resp && resp.data && resp.data.length > 0) {
        const mainCategoryId = resp.data[4].id;
        setMainId(mainCategoryId);
      }
    };
    fetchMainId();
  }, []);
  //form
  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (assets.trim() == '') {
        setErrorMessage('This field is required');
        return;
      }
      const payload = {
        main_category: mainId,
        category_name: assets
      };
      const response = await subCategoryPostApi(payload);
      if (
        response &&
        response.data &&
        response.status_code >= 200 &&
        response.status_code < 300
      ) {
        const newCategoryId = response.data.id;
        const updatedCategories: Category[] = [
          ...categories,
          { id: newCategoryId, category_name: assets, subcategories: [] }
        ];
        setCategories(updatedCategories);
        closeModal();
        showToast(response.status_message, { type: NotificationType.Success });
      } else {
        showToast('category name already exists', {
          type: NotificationType.Error
        });
      }
      setAssets('');
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssets(e.target.value);
    setErrorMessage('');
  };
  //list all
  useEffect(() => {
    if (!mainId) return;
    const fetchCategories = async () => {
      const response = await subCategoryGetApi(mainId);
      if (response.data) {
        setCategories(response.data as Category[]);
      }
    };
    fetchCategories();
  }, [mainId, isModalOpen, isSubCategoryModalOpen]);

  return (
    <>
      <ExpenseHeader openModal={openModal} />
      <div className="h-[75vh] overflow-y-scroll">
        <Expense
          categories={categories}
          setCategories={setCategories}
          isModalOpen={isSubCategoryModalOpen}
          setIsModalOpen={setIsSubCategoryModalOpen}
        />
      </div>
      {isModalOpen && (
        <AssetModal>
          <form onSubmit={handleAddAsset}>
            <div className="mb-4">
              <div className="flex justify-end py-2">
                <p className="my-1 text-[15px] font-medium">
                  {'Add New Category'}
                </p>
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
                placeholder="Heading"
                value={assets}
                onChange={handleInputChange}
                className="my-2 w-full appearance-none rounded border px-3 py-2 font-light leading-tight text-[#737373] focus:outline-none"
              />
              {errorMessage && (
                <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
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

export default ExpenseManager;
