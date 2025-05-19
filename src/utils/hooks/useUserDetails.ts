import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getUserDetails } from '../../api/documentsApi';
import { setUser } from '../../store/auth/userSlice';
import useAuth from './useAuth';

const useUserDetails = () => {
  const { authenticated } = useAuth();

  const dispatch = useDispatch();

  const fetchUserDetailsData = async () => {
    try {
      const userDetailsResponse = await getUserDetails();
      if (
        userDetailsResponse.status_code >= 200 &&
        userDetailsResponse.status_code < 300 &&
        userDetailsResponse.data.lengt > 0
      ) {
        dispatch(setUser(userDetailsResponse.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchUserDetailsData();
    }
  }, [authenticated]);

  return;
};

export default useUserDetails;
