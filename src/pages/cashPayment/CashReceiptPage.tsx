import { useState } from 'react';
import { useSelector } from 'react-redux';

import ReceiptCreateView from '../../components/management/cashPayment/ReceiptCreateView';
import ReceiptListView from '../../components/management/cashPayment/ReceiptListView';
import { managementSliceSelector } from '../../store/managementReducer';
import SidebarLayout from '../layout/SidebarLayout';

const CashReceiptPage: React.FC<{ path?: string }> = ({ path }) => {
  const { loan } = useSelector(managementSliceSelector);
  const [showCreateView, setShowCreateView] = useState(false);
  const loanId = loan?.id || null;

  const content = showCreateView ? (
    <ReceiptCreateView setShowCreateView={setShowCreateView} />
  ) : (
    <ReceiptListView setShowCreateView={setShowCreateView} loanId={loanId} />
  );

  return path === 'main' ? <SidebarLayout>{content}</SidebarLayout> : content;
};

export default CashReceiptPage;
