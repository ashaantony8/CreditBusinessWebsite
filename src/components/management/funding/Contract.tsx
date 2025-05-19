import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import PaymentDetails from '../../../pages/profile/tabContents/PaymentDetails';
import { managementSliceSelector } from '../../../store/managementReducer';
import Contract from '../../fundingForms/Contract';

const FundingContract = () => {
  const { loan } = useSelector(managementSliceSelector);
  const [loanId, setLoanId] = useState<string | null>(null);

  useEffect(() => {
    if (loan?.id) setLoanId(loan.id);
  }, [loan]);

  return (
    <div className="p-[4%]">
      <Contract loanId={loanId} />
      <PaymentDetails loanId={loanId} />
    </div>
  );
};

export default FundingContract;
