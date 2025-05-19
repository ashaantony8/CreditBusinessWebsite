import { useState } from 'react';

import { loanFormCommonStyleConstant } from '../../../utils/constants';

const ChipInput = ({
  chips,
  setChips,
  category,
  mainCategory,
  options,
  setType,
  type,
  children
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = e => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      setChips(prevChips => ({
        ...prevChips,
        [category]: {
          ...prevChips[category],
          [mainCategory]: [
            ...(prevChips[category][mainCategory] || []),
            inputValue.trim()
          ]
        }
      }));
      setInputValue('');
    }
  };

  const removeChip = index => {
    setChips(prevChips => ({
      ...prevChips,
      [category]: {
        ...prevChips[category],
        [mainCategory]: prevChips[category][mainCategory].filter(
          (_, chipIndex) => chipIndex !== index
        )
      }
    }));
  };

  const closeAllChips = () => {
    setChips(prevChips => ({
      ...prevChips,
      [category]: {
        ...prevChips[category],
        [mainCategory]: []
      }
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-[#929292]">{'Category:'}</p>
        <select
          value={type}
          onChange={e => {
            type = e.target.value;
            setType(type);
          }}
          style={{ background: type ? '#EDF3FF' : 'white' }}
          className="text-[12px] text-[#929292] focus:outline-none"
        >
          <option value="">{'select a category'}</option>
          {options.map(i => (
            <option value={i.key}>{i.label}</option>
          ))}
        </select>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex max-h-32 w-[65%] flex-wrap gap-2 overflow-y-auto">
          {chips.map((chip, index) => (
            <div
              className="flex items-center rounded-full bg-gray-300 px-2 py-1"
              key={index}
            >
              {chip}
              <span
                className="ml-2 cursor-pointer text-red-600"
                onClick={() => removeChip(index)}
              >
                &times;
              </span>
            </div>
          ))}
        </div>
        <button
          className="mt-2 flex cursor-pointer gap-2 rounded-md border-none bg-[#1A439A] px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
          onClick={closeAllChips}
        >
          {'Remove all '}
          <span>&times;</span>
        </button>
      </div>

      <div className="flex gap-2">
        <div className="w-3/5 rounded-lg bg-white">
          <div className="relative bg-inherit">
            <input
              type="text"
              id={mainCategory}
              className={loanFormCommonStyleConstant.text.fieldClass}
              placeholder=" "
              value={inputValue}
              onChange={e => {
                const newValue = e.target.value;
                if (newValue.length <= 50) {
                  setInputValue(newValue);
                }
              }}
              onKeyDown={handleKeyDown}
              minLength={1}
              maxLength={50}
            />

            <label
              htmlFor={mainCategory}
              className="absolute -start-0 -top-3 mx-1 mt-1 cursor-text bg-inherit px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-gray-600 max-sm:peer-placeholder-shown:text-[10px]"
            >
              {'Type and press Enter to add'}
            </label>
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-lg text-[#1A439A]"
              onClick={() => setInputValue('')}
            >
              &times;
            </span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ChipInput;
