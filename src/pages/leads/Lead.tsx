import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { userProfileApi } from '../../api/userServices';
import Loader from '../../components/Loader';
import {
  managementSliceSelector,
  resetManagement,
  updateUser
} from '../../store/managementReducer';
import { leadMenu } from '../../utils/constants';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { UserProfile } from '../../utils/types';
import DetailsPageLayout from '../layout/DetailPageLayout';

const LeadPage = () => {
  const navigate = useNavigate();
  const { query_params_customerId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useSelector(managementSliceSelector);

  const dispatch = useDispatch();
  const customerId = query_params_customerId;
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const { showToast } = useToast();

  const fetchProfile = async () => {
    try {
      const fetchProfileResponse = await userProfileApi(customerId);
      if (fetchProfileResponse?.status_code == 200) {
        setProfile(fetchProfileResponse.data);
      } else {
        setIsLoading(false);
        showToast(fetchProfileResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      setIsLoading(false);
      showToast('Something went wrong!', { type: NotificationType.Error });
      console.log('error', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProfile();
    return () => {
      dispatch(resetManagement());
    };
  }, []);

  useEffect(() => {
    if (profile.id) {
      dispatch(updateUser(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (user.id) {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <div>
      {isLoading ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      ) : user.id ? (
        <DetailsPageLayout
          backHandler={() => navigate('/leads')}
          menus={leadMenu}
        >
          <Outlet />
        </DetailsPageLayout>
      ) : (
        <div className="px-6 py-4 text-center">{'No data available'}</div>
      )}
    </div>
  );
};

export default LeadPage;
