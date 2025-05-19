import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { unitMenu } from '../../utils/constants';
import DetailsPageLayout from '../layout/DetailPageLayout';
import { useEffect, useState } from 'react';
import { companyDetailsApi } from '../../api/loanServices';
import { UnitData } from '../../utils/types';
import useToast from '../../utils/hooks/toastify/useToast';
import { useDispatch, useSelector } from 'react-redux';
import {
  managementSliceSelector,
  resetManagement,
  updateUnit
} from '../../store/managementReducer';
import Loader from '../../components/Loader';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import { Roles } from '../../utils/enums';
import { authSelector } from '../../store/auth/userSlice';

const UnitPage = () => {
  const { query_params_unitId } = useParams();
  const unitId = query_params_unitId;
  const navigate = useNavigate();
  const { role } = useSelector(authSelector);

  const dispatch = useDispatch();
  const { unit } = useSelector(managementSliceSelector);

  const [company, setUnit] = useState<Partial<UnitData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const fetchUnit = async unitId => {
    try {
      const fetchUnitResponse = await companyDetailsApi(unitId);
      if (fetchUnitResponse?.status_code == 200) {
        setUnit(fetchUnitResponse.data);
      } else {
        setIsLoading(false);
        showToast(fetchUnitResponse.status_message, {
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
    fetchUnit(unitId);
    return () => {
      dispatch(resetManagement());
    };
  }, [unitId]);

  useEffect(() => {
    if (company) {
      dispatch(updateUnit(company));
    }
  }, [company]);

  useEffect(() => {
    if (unit.id) {
      setIsLoading(false);
    }
  }, [unit]);

  const filteredMenu = ![
    Roles.Admin,
    Roles.Customer,
    Roles.Leads,
    Roles.Manager
  ].includes(role)
    ? unitMenu.filter(item => item.name !== 'Edit Approval')
    : unitMenu;

  return (
    <div>
      {isLoading ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      ) : unit.id ? (
        <DetailsPageLayout
          backHandler={() => navigate('/units')}
          menus={filteredMenu}
        >
          <Outlet />
        </DetailsPageLayout>
      ) : (
        <div className="px-6 py-4 text-center">{'No data available'}</div>
      )}
    </div>
  );
};

export default UnitPage;
