import { useSelector } from 'react-redux';

import Notification from '../../components/management/notification/Notification';
import { authSelector } from '../../store/auth/userSlice';
// import { Roles } from "../../utils/enums";
import SidebarLayout from '../layout/SidebarLayout';

const NotificationPage = () => {
  const { role } = useSelector(authSelector);

  return (
    <SidebarLayout>
      {/* <Notification whichUser={Roles.FieldAgent} /> */}
      <Notification whichUser={role} />
    </SidebarLayout>
  );
};

export default NotificationPage;
