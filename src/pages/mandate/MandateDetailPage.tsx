import MandateDetailView from '../../components/management/mandate/MandateDetailView';
import SidebarLayout from '../../pages/layout/SidebarLayout';

const MandateDetailPage: React.FC<{ path?: string }> = ({ path }) => {
  return path === 'main' ? (
    <SidebarLayout>
      <MandateDetailView />
    </SidebarLayout>
  ) : (
    <MandateDetailView />
  );
};

export default MandateDetailPage;
