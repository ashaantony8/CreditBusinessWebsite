import '../modaltabs/style.css';

import { useEffect, useRef } from 'react';

import { updateCurrentStage } from '../../../store/fundingStateReducer';

const CustomerTab = ({ tabs, activeTab, setActiveTab }) => {
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTab.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [updateCurrentStage]);

  return (
    <div className="mb-4 ml-4 flex w-full items-center border-b-2 border-gray-200">
      <ul
        className="hide-scrollbar mr-6 flex overflow-x-auto"
        id="default-tab"
        data-tabs-toggle="#default-tab-content"
        role="tablist"
      >
        {tabs.map(tab => (
          <li key={tab.id} className="me-2" role="presentation">
            <button
              ref={activeTab === tab.id ? activeTabRef : null}
              className={`inline-block rounded-t-lg py-4 hover:border-gray-300 max-sm:p-2 ${
                activeTab === tab.id &&
                'text-[#1A439A] underline decoration-[#1A439A] decoration-8 underline-offset-[20px]'
              } `}
              id={`${tab.id}-tab`}
              data-tabs-target={`#${tab.id}`}
              type="button"
              role="tab"
              aria-controls={tab.id}
              aria-selected={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
            >
              <div className={`text-[13px] font-medium ${tab.width} `}>
                {' '}
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

export default CustomerTab;
