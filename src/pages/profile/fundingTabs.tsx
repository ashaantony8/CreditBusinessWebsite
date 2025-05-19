import { useEffect, useRef } from 'react';

const TabComponent = ({ tabs, activeTab, setActiveTab }) => {
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
    <div className="flex w-full flex-col items-start">
      <ul className="hide-scrollbar mb-4 flex overflow-x-auto">
        {tabs.map(tab => (
          <li key={tab.id} className="mr-2" role="presentation">
            <button
              ref={activeTab === tab.id ? activeTabRef : null}
              className={`rounded-full px-6 py-2 transition-all duration-300 ease-in-out focus:outline-none ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              } hover:bg-blue-900 hover:text-white`}
              id={`${tab.id}-tab`}
              data-tabs-target={`#${tab.id}`}
              type="button"
              role="tab"
              aria-controls={tab.id}
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div id="default-tab-content" className="w-full">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`rounded-lg bg-white p-4 shadow transition-opacity duration-300 ease-in-out ${
              activeTab === tab.id ? 'block opacity-100' : 'hidden opacity-0'
            }`}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
          >
            {/* Your tab content here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabComponent;
