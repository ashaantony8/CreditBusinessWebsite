import { Dispatch, ReactNode, useState } from 'react';
import DatePicker from 'react-datepicker';
import { CiFilter } from 'react-icons/ci';
import { FiPlus } from 'react-icons/fi';
import { useMediaQuery } from 'react-responsive'; // Ensure you have this import

import Filter from './Filtex';
import SearchBar from './SearchBar'; // Adjust the import based on your project structure

export type HeaderProps = {
  title?: string;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: { [key: string]: string[] }) => void;
  onAdd?: () => void;
  initialFilters?: { [key: string]: string[] };
  dropdownData?: {
    title: string;
    type: string;
    items: { id: string | boolean; label: string }[];
  }[];
  formDate?: Date;
  setFormDate?: Dispatch<Date>;
  toDate?: Date;
  setToDate?: Dispatch<Date>;
  isEligibleNewLoan?: { isApplicableForNewLoan: boolean; loanCount: number };
  newLoanHandle?: () => void;
  fetchFieldDetails?: () => void;
  fetchLeadsDetails?: () => void;
  children?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({
  title,
  onSearch,
  onFilterChange,
  onAdd,
  initialFilters,
  dropdownData,
  formDate,
  setFormDate,
  toDate,
  setToDate,
  isEligibleNewLoan,
  newLoanHandle,
  children
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [isFilterOpened, setFilterOpened] = useState(false);

  // to close the filter component in the child component
  const setFilterHanlder = () => {
    setFilterOpened(prevState => !prevState);
  };

  return (
    <>
      {(isLaptop || isTablet) && (
        <div className="sticky top-0 z-10 flex h-20 items-center justify-between border-gray-200 bg-white">
          <div className="flex items-center px-4">
            {title && (
              <p className="pr-4 text-[20px] font-semibold text-[#000000] max-sm:text-[18px]">
                {title}
              </p>
            )}
            {onSearch && (
              <SearchBar
                onSearch={onSearch}
                placeholder={`Search ${title ? title.toLowerCase() : ''}`}
              />
            )}
          </div>
          <div className="flex items-center space-x-4 px-4">
            {setFormDate && setToDate && (
              <>
                <div className="flex items-center gap-2">
                  <label htmlFor="fromDate" className="text-sm text-gray-700">
                    {'From Date'}
                  </label>
                  <DatePicker
                    id="fromDate"
                    className="focus:shadow-outline w-full appearance-none border-2 border-gray-300 px-4 py-3 pl-10 text-[12px] font-light leading-tight text-gray-800 transition-colors hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                    selected={formDate}
                    onChange={date => setFormDate(date as Date)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="toDate" className="text-sm text-gray-700">
                    {'To Date'}
                  </label>
                  <DatePicker
                    id="toDate"
                    className="focus:shadow-outline w-full appearance-none border-2 border-gray-300 px-4 py-3 pl-10 text-[12px] font-light leading-tight text-gray-800 transition-colors hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                    selected={toDate}
                    onChange={date => setToDate(date as Date)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center pr-4">
            {isEligibleNewLoan?.isApplicableForNewLoan && (
              <button
                onClick={newLoanHandle}
                className="mx-2 flex w-full items-center rounded-lg border bg-transparent px-5 py-2.5 text-center text-sm font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
              >
                <FiPlus size={16} className="mr-2" />
                {'APPLY NEW'}
              </button>
            )}
            {onAdd && (
              // <div className="w-[150px] text-gray-900">
              <div className="group relative w-full">
                <button
                  onClick={onAdd}
                  className="flex items-center rounded-lg border bg-transparent px-5 py-2.5 text-center text-sm font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
                  type="button"
                >
                  <FiPlus size={16} className="mr-2" />
                  {'Add'}
                </button>
              </div>
              // </div>
            )}
            {onFilterChange && (
              <div className="text-gray-900">
                <div className="group relative w-full" id="filter-icon">
                  <button
                    className="text-site focus:border-brand peer flex items-center justify-between rounded bg-transparent px-3 py-2.5 font-semibold focus:outline-none focus:ring-0 md:text-sm"
                    onClick={setFilterHanlder}
                  >
                    <CiFilter className="ml-3 h-5 w-6 text-gray-400 hover:text-gray-500" />
                    <a className="text-[14px] tracking-wide text-[#929292]">
                      {'Filter'}
                    </a>
                  </button>
                  {isFilterOpened && (
                    <Filter
                      closeFilterHandler={setFilterHanlder}
                      isOpen={isFilterOpened}
                      onFilterChange={onFilterChange}
                      initialFilters={initialFilters}
                      dropdownData={dropdownData}
                    />
                  )}
                </div>
              </div>
            )}{' '}
            {children}
          </div>
        </div>
      )}
      {isMobile && (
        <div className="sticky top-0 z-10 h-20 border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4">
            {title && (
              <p className="text-[14px] font-semibold text-[#000000]">
                {title}
              </p>
            )}
            {isEligibleNewLoan?.isApplicableForNewLoan && (
              <button
                onClick={newLoanHandle}
                className="mx-2 flex w-full items-center rounded-lg border bg-transparent px-5 py-2.5 text-center text-[10px] font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
              >
                <FiPlus size={16} className="mr-2" />
                {'APPLY NEW'}
              </button>
            )}
            {onAdd && (
              // <div className="w-[150px] text-gray-900">
              <div className="group relative mx-4 w-full">
                <button
                  onClick={onAdd}
                  className="flex items-center rounded-lg border bg-transparent px-5 py-2.5 text-center text-sm font-medium text-gray-400 hover:bg-gray-200 hover:text-gray-400 focus:ring-1 focus:ring-gray-300"
                  type="button"
                >
                  <FiPlus size={16} className="mr-2" />
                  {'Add'}
                </button>
              </div>
              // </div>
            )}
            <div className="flex items-center border">
              {onFilterChange && (
                <div className="text-gray-900">
                  <div className="group relative w-full" id="filter-icon">
                    <button
                      className="text-site focus:border-brand peer flex items-center justify-between rounded bg-transparent px-3 py-2.5 font-semibold focus:outline-none focus:ring-0 md:text-sm"
                      onClick={setFilterHanlder}
                    >
                      <CiFilter className="ml-3 h-5 w-6 text-gray-400 hover:text-gray-500" />
                      <a className="text-[10px] tracking-wide text-[#929292]">
                        {'Filter'}
                      </a>
                    </button>
                    {isFilterOpened && (
                      <Filter
                        closeFilterHandler={setFilterHanlder}
                        isOpen={isFilterOpened}
                        onFilterChange={onFilterChange}
                        initialFilters={initialFilters}
                        dropdownData={dropdownData}
                      />
                    )}
                  </div>
                </div>
              )}{' '}
            </div>
            {children}
          </div>
          {onSearch && (
            <div className="m-4">
              <SearchBar
                onSearch={onSearch}
                placeholder={`Search ${title ? title.toLowerCase() : ''}`}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
