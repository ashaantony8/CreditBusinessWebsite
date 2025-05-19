import { useState } from 'react';

import UnitProfile from '../../../components/management/unit/UnitProfile';
import TabComponent from '../unitTabs';
import AddressProof from './AddressProof';
import BankStatement from './BankStatement';
import OtherDocuments from './OtherDocuments';
import PhotoId from './PhotoId';

const UnitDetail = ({ companyId, onBackButtonClick }) => {
  const [activeTab, setActiveTab] = useState(1);

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <UnitProfile unitId={companyId} />;
      // case 2:
      //   return <FundingCard customerId={customerId} />;
      case 6:
        return <PhotoId />;
      case 7:
        return <AddressProof />;
      case 8:
        return <OtherDocuments />;
      case 9:
        return <BankStatement />;
      default:
        return <h1>{'Empty!'}</h1>;
    }
  };

  const tabs = [
    { id: 1, key: 'unitProfile', label: 'Unit Profile', width: 'w-[100px]' },
    { id: 2, key: 'funding', label: 'Funding', width: 'w-[100px]' },
    { id: 3, key: 'PhotoID', label: 'Photo ID', width: 'w-[90px]' },
    {
      id: 4,
      key: 'AddressProof',
      label: 'Address Proof',
      width: 'w-[100px]'
    },
    {
      id: 5,
      key: 'OtherFiles',
      label: 'Other Files',
      width: 'w-[110px]'
    },
    {
      id: 6,
      key: 'Bankstatement',
      label: 'Bank Statement',
      width: 'w-[130px]'
    }
  ];

  return (
    <div className="unit-card-content rounded-lg bg-white p-6 shadow-lg">
      <div className="flex flex-col px-4">
        <TabComponent
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="tab-content">{renderTabContent()}</div>
      </div>
      <button
        className="mt-4 rounded bg-gray-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600"
        onClick={onBackButtonClick}
      >
        {'Back'}
      </button>
    </div>
  );
};

export default UnitDetail;
