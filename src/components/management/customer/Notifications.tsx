import { useSelector } from 'react-redux';

import { authSelector } from '../../../store/auth/userSlice';
import { managementSliceSelector } from '../../../store/managementReducer';
import { Roles } from '../../../utils/enums';
import Notification from '../notification/Notification';

const Notifications = () => {
  const { role } = useSelector(authSelector);
  const customerUser = useSelector(authSelector);
  const managementUser = useSelector(managementSliceSelector).user;

  const user = [Roles.Customer, Roles.Leads].includes(role as Roles)
    ? customerUser
    : managementUser;
  const customerId = user?.id;
  return <Notification whichUser={Roles.Customer} customerId={customerId} />;
};

export default Notifications;
