import React from 'react';

import CustomerFundingApplication from '../components/fundingForms/FundingApplication';

const LoanFormPage: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-cover bg-fixed">
        <CustomerFundingApplication />
      </div>
    </>
  );
};

export default LoanFormPage;
