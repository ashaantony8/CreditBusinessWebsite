import PapDetailView from '../../components/management/pap/PapDetailView';
import SidebarLayout from '../../pages/layout/SidebarLayout';

const PapDetailViewPage: React.FC<{ path?: string }> = ({ path }) => {
  return path === 'main' ? (
    <SidebarLayout>
      <PapDetailView />
    </SidebarLayout>
  ) : (
    <PapDetailView />
  );
};

export default PapDetailViewPage;
