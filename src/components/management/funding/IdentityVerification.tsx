import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { managementSliceSelector } from '../../../store/managementReducer';
import IdentityVerification from '../../fundingForms/IdentityVerification';

const FundingIdentityVerification = () => {
  const { loan } = useSelector(managementSliceSelector);
  const [loanId, setLoanId] = useState<string>(null);

  useEffect(() => {
    if (loan?.id) setLoanId(loan?.id);
  }, [loan]);
  return <IdentityVerification loanId={loanId} />;
};

export default FundingIdentityVerification;
