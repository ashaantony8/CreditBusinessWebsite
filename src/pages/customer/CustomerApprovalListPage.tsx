import { useSelector } from 'react-redux';

import ApprovalList from '../../components/management/adminApproval/ApprovalList';
import { managementSliceSelector } from '../../store/managementReducer';
import { ApprovalType } from '../../utils/enums';

const CustomerApprovalListPage = () => {
  const user = useSelector(managementSliceSelector).user;
  const customerId = user?.id as string;

  return (
    <div>
      <ApprovalList type={ApprovalType.CustomerProfile} userId={customerId} />
    </div>
  );
};

export default CustomerApprovalListPage;
