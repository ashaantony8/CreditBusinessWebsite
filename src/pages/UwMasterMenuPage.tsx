import { Outlet, useNavigate } from 'react-router-dom';

import DetailsPageLayout from './layout/DetailPageLayout';
// import { masterMenu } from "../utils/constants";

const UwMasterMenuPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <DetailsPageLayout backHandler={() => navigate('/')}>
        <Outlet />
      </DetailsPageLayout>
    </>
  );
};

export default UwMasterMenuPage;
