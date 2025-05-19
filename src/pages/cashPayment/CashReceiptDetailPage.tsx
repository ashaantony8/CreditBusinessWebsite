import CashReceiptDetailView from '../../components/management/cashPayment/CashReceiptDetailView';
import SidebarLayout from '../layout/SidebarLayout';

const CashReceiptDetailPage: React.FC<{ path?: string }> = ({ path }) => {
  return path === 'main' ? (
    <SidebarLayout>
      <CashReceiptDetailView />
    </SidebarLayout>
  ) : (
    <CashReceiptDetailView />
  );
};

export default CashReceiptDetailPage;
