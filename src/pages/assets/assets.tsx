import { useNavigate } from 'react-router-dom';

import AssetManager from '../../components/master/assets/AssetManager';
import DetailsPageLayout from '../layout/DetailPageLayout';

const AssetsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <DetailsPageLayout backHandler={() => navigate('/')}>
        <AssetManager />
      </DetailsPageLayout>
    </>
  );
};

export default AssetsPage;
