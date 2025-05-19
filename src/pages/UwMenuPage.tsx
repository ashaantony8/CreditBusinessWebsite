import { Outlet } from 'react-router-dom';

import SidebarLayout from './layout/SidebarLayout';

const UwMenuPage = () => {
  return (
    <SidebarLayout>
      <Outlet />
    </SidebarLayout>
  );
};

export default UwMenuPage;
