import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { managementSliceSelector } from '../../../store/managementReducer';
import { FundingFromCurrentStatus } from '../../../utils/enums';
import GoCardLess from '../../fundingForms/GoCardless';

const FundingGoCardless: React.FC<{
  fundingId?: string;
  fundingStatus?: FundingFromCurrentStatus;
}> = ({ fundingId, fundingStatus }) => {
  const { loan } = useSelector(managementSliceSelector);
  const [loanId, setLoanId] = useState<string>(null);

  useEffect(() => {
    if (fundingId || loan?.id) setLoanId(fundingId || loan?.id);
  }, [loan, fundingId]);
  return <GoCardLess loanId={loanId} fundingFormStatus={fundingStatus} />;
};

export default FundingGoCardless;
