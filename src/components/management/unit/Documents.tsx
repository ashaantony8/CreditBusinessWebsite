// import { useParams } from "react-router-dom";
import { useState } from 'react';

import AddressProof from '../../../pages/profile/tabContents/AddressProof';
import BankStatement from '../../../pages/profile/tabContents/BankStatement';
import OtherDocuments from '../../../pages/profile/tabContents/OtherDocuments';
import PhotoId from '../../../pages/profile/tabContents/PhotoId';
import TabComponent from './DocumentTabs';

const Documents = () => {
  const [activeTab, setActiveTab] = useState(1);

  // const queryParams = useParams();

  // const query_params_customerId =
  //   queryParams.query_params_customerId ||
  //   "04c881e9-e875-479d-8d7a-626aa61002e0"; // need to change

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <PhotoId />; //customerId={query_params_customerId} change this for build check
      case 2:
        return <AddressProof />;
      case 3:
        return <OtherDocuments />;
      case 4:
        return <BankStatement />;

      default:
        return <h1>{'Empty!'}</h1>;
    }
  };

  const tabs = [
    { id: 1, key: 'PhotoID', label: 'Photo ID', width: 'w-[90px]' },
    {
      id: 2,
      key: 'AddressProof',
      label: 'Address Proof',
      width: 'w-[100px]'
    },
    {
      id: 3,
      key: 'OtherFiles',
      label: 'Other Files',
      width: 'w-[110px]'
    },
    {
      id: 4,
      key: 'Bankstatement',
      label: 'Bank Statement',
      width: 'w-[130px]'
    }
  ];

  return (
    <>
      <div className="flex flex-col justify-center">
        <TabComponent
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {renderTabContent()}
      </div>
    </>
  );
};

export default Documents;
