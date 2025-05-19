import { useEffect, useState } from 'react';

import {
  transactionCategoryApi,
  transactionCategoryPostApi
} from '../../api/loanServices';
import {
  creditCategoryOptions,
  debitCategoryOptions
} from '../../utils/constants';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import Loader from '../Loader';
import Header from './common/Header';

const Section = ({ title, options, chips, setChips, category }) => (
  <div>
    <h1 className="mb-4 text-xl font-bold text-[#1A439A]">{title}</h1>
    <div className="grid gap-6 overflow-y-auto">
      {options.map(option => (
        <ChipInput
          key={option.key}
          optionLabel={option.label}
          chips={chips[category]?.[option.key] || []}
          setChips={setChips}
          category={category}
          mainCategory={option.key}
        />
      ))}
    </div>
  </div>
);

const ChipInput = ({
  chips,
  setChips,
  category,
  mainCategory,
  optionLabel
}) => {
  const [inputValue, setInputValue] = useState('');

  const updateChips = updatedChips => {
    setChips(prevChips => ({
      ...prevChips,
      [category]: {
        ...prevChips[category],
        [mainCategory]: updatedChips
      }
    }));
  };

  const addChip = () => {
    if (inputValue.trim()) {
      updateChips([...chips, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeChip = index => {
    const updatedChips = chips.filter((_, chipIndex) => chipIndex !== index);
    updateChips(updatedChips);
  };

  const clearAllChips = () => updateChips([]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChip();
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-md mb-2 font-semibold text-[#1A439A]">
        {optionLabel}
      </h2>
      <div className="mb-2 flex flex-wrap gap-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="flex items-center rounded-full bg-[#EDF3FF] px-3 py-1 text-sm font-medium text-[#1A439A] shadow-sm"
          >
            {chip}
            <span
              className="ml-2 cursor-pointer text-red-600 transition duration-200 hover:text-red-800"
              onClick={() => removeChip(index)}
              aria-label="Remove chip"
            >
              &times;
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 max-sm:flex-wrap">
        <input
          type="text"
          placeholder="Type and press Enter to add"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring focus:ring-[#1A439A]/40"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Add chip input"
        />
        <button
          onClick={clearAllChips}
          className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white shadow transition duration-200 hover:bg-blue-800"
          aria-label="Clear all chips"
        >
          {'Clear All'}
        </button>
      </div>
    </div>
  );
};

const TransactionSorting = () => {
  const [chips, setChips] = useState({ debit: {}, credit: {} });
  const [activeTab, setActiveTab] = useState('debit');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const fetchTransactionCategor = async () => {
    try {
      const response = await transactionCategoryApi();
      if (response.status_code === 200) {
        setChips(response.data);
      }
    } catch (error) {
      console.error('Error fetching transaction categories:', error);
    }
  };

  const saveTransactionCategor = async () => {
    setIsLoading(true);
    try {
      const response = await transactionCategoryPostApi(chips);
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionCategor();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="sticky top-0 z-10 border-b bg-white">
        <Header title="Transaction Sorting Settings">
          <button
            onClick={saveTransactionCategor}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white shadow transition duration-200 hover:bg-green-700"
            aria-label="Save Transaction Categories"
          >
            {'Save'}
          </button>
        </Header>
      </div>
      <div className="flex h-[85%] flex-1 flex-col overflow-y-auto bg-white p-6 max-sm:h-[64vh]">
        {' '}
        <div className="mb-6 flex justify-start border-b-2 border-gray-200">
          {['debit', 'credit'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-semibold ${
                activeTab === tab
                  ? 'border-b-2 border-[#1A439A] text-[#1A439A]'
                  : 'text-gray-400'
              }`}
              aria-label={`Switch to ${tab} tab`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {chips && (
          <Section
            title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            options={
              activeTab === 'debit'
                ? debitCategoryOptions
                : creditCategoryOptions
            }
            chips={chips}
            setChips={setChips}
            category={activeTab}
          />
        )}
      </div>
    </>
  );
};

export default TransactionSorting;
