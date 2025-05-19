import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { loanGetApi } from '../../api/loanServices';
import Loader from '../../components/Loader';
import {
  managementSliceSelector,
  resetManagement,
  updateLoan,
  updateUnit
} from '../../store/managementReducer';
import { fundingMenu } from '../../utils/constants';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { LoanData } from '../../utils/types';
import DetailsPageLayout from '../layout/DetailPageLayout';
import useBackButton from '../../utils/hooks/useBackButton';

const FundingPage = () => {
  const navigate = useNavigate();
  const { query_params_loanId } = useParams();
  const dispatch = useDispatch();
  const [funding, setLoan] = useState<Partial<LoanData>>({});
  const { loan } = useSelector(managementSliceSelector);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToast();

  const fetchLoan = async () => {
    try {
      const loanGetApiResponse = await loanGetApi(query_params_loanId);
      if (loanGetApiResponse?.status_code === 200) {
        setLoan(loanGetApiResponse.data);
        // dispatch updated-unit here
        if (loanGetApiResponse.data.unit) {
          dispatch(updateUnit(loanGetApiResponse.data.unit));
        }
      } else {
        setIsLoading(false);
        showToast(loanGetApiResponse.status_message, {
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
    fetchLoan();
    return () => {
      dispatch(resetManagement());
    };
  }, []);

  useEffect(() => {
    if (funding) {
      dispatch(updateLoan(funding));
    }
  }, [funding]);

  useEffect(() => {
    if (loan.id) {
      setIsLoading(false);
    }
  }, [loan]);

  const { handleBackClick } = useBackButton();

  return (
    <div>
      {isLoading ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
        >
          <Loader />
        </div>
      ) : loan.id ? (
        <DetailsPageLayout
          backHandler={() => {
            handleBackClick();
            navigate('/funding');
          }}
          menus={fundingMenu}
        >
          <Outlet />
        </DetailsPageLayout>
      ) : (
        <div className="px-6 py-4 text-center">{'No data available'}</div>
      )}
    </div>
  );
};

export default FundingPage;
