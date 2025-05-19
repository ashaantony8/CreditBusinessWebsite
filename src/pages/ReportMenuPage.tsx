import { Outlet, useNavigate } from 'react-router-dom';

import { reportMenu } from '../utils/constants';
import DetailsPageLayout from './layout/DetailPageLayout';

const ReportMenuPage = () => {
  const navigate = useNavigate();

  return (
    <DetailsPageLayout backHandler={() => navigate('/')} menus={reportMenu}>
      <Outlet />
    </DetailsPageLayout>
  );
};

export default ReportMenuPage;
