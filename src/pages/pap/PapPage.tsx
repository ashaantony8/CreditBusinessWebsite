import { useState } from 'react';
import { useSelector } from 'react-redux';

import PapCreateView from '../../components/management/pap/PapCreateView';
import PapListView from '../../components/management/pap/PapListView';
import { managementSliceSelector } from '../../store/managementReducer';
import SidebarLayout from '../layout/SidebarLayout';

const PapPage: React.FC<{ path?: string }> = ({ path }) => {
  const { loan } = useSelector(managementSliceSelector);
  const [showCreateView, setShowCreateView] = useState(false);

  const loanId = loan?.id || null;

  const content = showCreateView ? (
    <PapCreateView setShowCreateView={setShowCreateView} />
  ) : (
    <PapListView setShowCreateView={setShowCreateView} loanId={loanId} />
  );

  return path === 'main' ? <SidebarLayout>{content}</SidebarLayout> : content;
};

export default PapPage;
