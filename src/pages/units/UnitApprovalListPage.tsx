import ApprovalList from '../../components/management/adminApproval/ApprovalList';
import { useSelector } from 'react-redux';
import { managementSliceSelector } from '../../store/managementReducer';
import { ApprovalType } from '../../utils/enums';

const UnitApprovalListPage = () => {
  const { unit } = useSelector(managementSliceSelector);
  const companyId = unit.id;

  return (
    <div>
      <ApprovalList
        type={ApprovalType.UnitProfile}
        unitId={companyId}
        isUnit={true}
      />
    </div>
  );
};

export default UnitApprovalListPage;
