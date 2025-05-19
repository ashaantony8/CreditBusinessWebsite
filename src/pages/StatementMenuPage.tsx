import { Outlet, useNavigate } from 'react-router-dom';

// import { statementMenu } from "../utils/constants";
import DetailsPageLayout from './layout/DetailPageLayout';

const StatementMenuPage = () => {
  const navigate = useNavigate();

  return (
    <DetailsPageLayout backHandler={() => navigate('/')}>
      <Outlet />
    </DetailsPageLayout>
  );
};

export default StatementMenuPage;
