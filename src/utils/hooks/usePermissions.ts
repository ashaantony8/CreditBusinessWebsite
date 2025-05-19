import { useSelector } from 'react-redux';

import { RootState } from '../../store';

export const usePermissions = () => {
  const { role } = useSelector((state: RootState) => state.auth.user);

  return { role };
};
