import '../modaltabs/style.css';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { fundingStateSliceSelector } from '../../../store/fundingStateReducer';

const FundingTab = ({ tabs, activeTab, setActiveTab }) => {
  const { currentHighestStage } = useSelector(fundingStateSliceSelector);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  return (
    <div className="mb-4 w-full border-b-2 border-gray-200">
      <ul
        className="no-scrollbar flex justify-between overflow-x-auto whitespace-nowrap"
        id="default-tab"
        data-tabs-toggle="#default-tab-content"
        role="tablist"
      >
        {tabs?.map(tab => (
          <li key={tab.id} className="me-2 flex-shrink-0" role="presentation">
            <button
              ref={activeTab === tab.id ? activeTabRef : null}
              className={`inline-block rounded-t-lg py-4 hover:border-gray-300 max-sm:p-2 ${
                currentHighestStage < tab.id &&
                'cursor-not-allowed text-[#929292]'
              } ${activeTab === tab.id && 'text-[#1A439A]'} `}
              id={`${tab.id}-tab`}
              data-tabs-target={`#${tab.id}`}
              type="button"
              role="tab"
              disabled={currentHighestStage < tab.id}
              aria-controls={tab.id}
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <div
                className={`flex justify-between text-[12.5px] font-medium ${tab.width}`}
              >
                {tab.label}
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div id="default-tab-content">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`hidden rounded-lg bg-gray-800 p-4 ${
              activeTab === tab.id ? 'block' : ''
            }`}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FundingTab;
