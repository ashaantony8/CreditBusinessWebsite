import { useState } from 'react';

import LoanDetails from '../../../components/customerDocuments/LoanDetails';
import FundingGoCardless from '../../../components/management/funding/GoCardless';
import UnitProfile from '../../../components/management/unit/UnitProfile';
import TabComponent from '../fundingTabs';
import ManagementOffers from './FundingOffers';
import PaymentDetails from './PaymentDetails';

const FundingDetail = ({ fundingId, onBackButtonClick }) => {
  const [activeTab, setActiveTab] = useState(1);

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <LoanDetails fundingId={fundingId} />;
      case 2:
        // return <PaymentDetailsTab loanId={fundingId} />;
        break;
      case 3:
        return <PaymentDetails loanId={fundingId} />;
      case 4:
        return <UnitProfile />;
      case 5:
        return <FundingGoCardless fundingId={fundingId} />;
      case 6:
        return <ManagementOffers loanId={fundingId} />;
      default:
        return <h1>{'Empty!'}</h1>;
    }
  };

  const tabs = [
    {
      id: 1,
      key: 'LoanDetails',
      label: 'Funding Status',
      width: 'w-[120px]'
    },
    {
      id: 2,
      key: 'contract',
      label: 'Contract',
      width: 'w-[100px]'
    },
    {
      id: 3,
      key: 'paymentHistory',
      label: 'Payment History',
      width: 'w-[150px]'
    },
    {
      id: 4,
      key: 'unitProfile',
      label: 'Unit Profile',
      width: 'w-[120px]'
    },
    {
      id: 5,
      key: 'goCardless',
      label: 'GoCardless',
      width: 'w-[120px]'
    },
    {
      id: 6,
      key: 'Funding offer ',
      label: 'Funding offer',
      width: 'w-[130px]'
    }
  ];

  return (
    <div className="funding rounded-lg bg-white p-6 shadow-lg">
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

export default FundingDetail;
