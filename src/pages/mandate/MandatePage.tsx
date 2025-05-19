import { useState } from 'react';
import { useSelector } from 'react-redux';

import SubscriptionCreateView from '../../components/management/mandate/SubscriptionCreateView';
import SubscriptionListView from '../../components/management/mandate/SubscriptionListView';
import { managementSliceSelector } from '../../store/managementReducer';
import SidebarLayout from '../layout/SidebarLayout';

const MandatePage: React.FC<{ path?: string }> = ({ path }) => {
  const { loan } = useSelector(managementSliceSelector);
  const [showCreateView, setShowCreateView] = useState(false);
  const loanId = loan?.id || null;
  const content = showCreateView ? (
    <SubscriptionCreateView setShowCreateView={setShowCreateView} />
  ) : (
    <SubscriptionListView loanId={loanId} />
  );

  return path === 'main' ? <SidebarLayout>{content}</SidebarLayout> : content;
};

export default MandatePage;
