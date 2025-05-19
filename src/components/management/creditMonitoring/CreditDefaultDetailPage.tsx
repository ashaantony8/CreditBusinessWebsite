import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import {
  fetchCreditMonitoringByIdApi,
  listDefaultComments,
  moveToLegalApi,
  postDefaultComment,
  recommendForLegalApi
} from '../../../api/loanServices';
import SidebarLayout from '../../../pages/layout/SidebarLayout';
import { authSelector } from '../../../store/auth/userSlice';
import { FundingFromCurrentStatus, Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import Loader from '../../Loader';

interface CreatedBy {
  role?: string;
  first_name: string;
  last_name: string;
}
interface Comment {
  comment: string;
  created_by: CreatedBy;
  created_on: Date;
}

interface FormInput {
  comment: string;
}

const schema = yup.object().shape({
  comment: yup.string().required('Comment is required')
});

const CreditDefaultDetailPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [creditMonitoring, setCreditMonitoring] = useState(null);
  const [isMoveToLegalRecommendModalOpen, setIsMoveToLegalRecommendModalOpen] =
    useState(false);
  const [isMoveToLegalModalOpen, setIsMoveToLegalModalOpen] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema)
  });

  const { role } = useSelector(authSelector);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = methods;
  const { id } = useParams();

  const fetchCreditMonitoring = async id => {
    setIsLoading(true);
    try {
      const response = await fetchCreditMonitoringByIdApi(id);
      if (response.status_code === 200) {
        setCreditMonitoring(response.data);
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCreditMonitoring(id);
    }
  }, [id, isMoveToLegalRecommendModalOpen, isMoveToLegalModalOpen]);

  // const { loanId, isRecommendedForLegalAction } = location.state;
  const { showToast } = useToast();

  const fetchComments = async (loanId, mandateId) => {
    setIsLoading(true);
    try {
      const response = await listDefaultComments(loanId, mandateId);
      if (response.status_code === 200) {
        setComments(response.data);
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormInput) => {
    const payload = {
      comment: data.comment
    };
    try {
      const response = await postDefaultComment(
        creditMonitoring?.customer_loan,
        creditMonitoring?.mandate?.mandate_id,
        payload
      );
      reset();
      if (response.status_code === 201) {
        showToast(response.status_message, { type: NotificationType.Success });
        fetchComments(
          creditMonitoring?.customer_loan,
          creditMonitoring?.mandate?.id
        );
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    }
  };

  const moveToLegalButton = async () => {
    try {
      const response = await moveToLegalApi(creditMonitoring?.customer_loan);
      reset();
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
        fetchComments(
          creditMonitoring?.customer_loan,
          creditMonitoring?.mandate?.id
        );
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsMoveToLegalModalOpen(false);
    }
  };

  const recomendLegalAction = async () => {
    try {
      const payload = { recommented_move_to_legal: true };
      const response = await recommendForLegalApi(
        creditMonitoring?.customer_loan,
        payload
      );
      if (response.status_code === 200) {
        showToast(response.status_message, { type: NotificationType.Success });
      } else {
        showToast('Something went wrong!', { type: NotificationType.Error });
      }
    } catch (error) {
      showToast(error.message, { type: NotificationType.Error });
    } finally {
      setIsMoveToLegalRecommendModalOpen(false);
    }
  };

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (creditMonitoring) {
      fetchComments(
        creditMonitoring?.customer_loan,
        creditMonitoring?.mandate?.id
      );
    }
  }, [creditMonitoring]);

  return (
    <SidebarLayout>
      <div className="w-full p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/credit-monitoring')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200"
            >
              <BiArrowBack className="text-lg" />
            </button>
            <h2 className="text-lg font-semibold">{'Comments'}</h2>
          </div>
          {creditMonitoring?.loan_status?.current_status ===
          FundingFromCurrentStatus.MovedToLegal ? (
            <div className="flex flex-wrap items-center gap-4">
              {creditMonitoring?.recommented_move_to_legal && (
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-red-600">
                    {'Recommended for Legal Action'}
                  </p>
                  <p className="text-sm font-semibold">
                    {'Recommended by:'}{' '}
                    {creditMonitoring.recommentor_move_to_legal.first_name}{' '}
                    {creditMonitoring.recommentor_move_to_legal.last_name} {'('}
                    {creditMonitoring.recommentor_move_to_legal.role}
                    {')'}
                  </p>
                  <p className="text-sm font-semibold">
                    {'Email: '}
                    {creditMonitoring.recommentor_move_to_legal.email}
                  </p>
                </div>
              )}
              <p className="text-sm font-semibold text-red-600">
                {'Moved for Legal Action'}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              {creditMonitoring?.recommented_move_to_legal ? (
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-red-600">
                    {'Recommended for Legal Action'}
                  </p>
                  <p className="text-sm font-semibold">
                    {'Recommended by:'}{' '}
                    {creditMonitoring.recommentor_move_to_legal.first_name}{' '}
                    {creditMonitoring.recommentor_move_to_legal.last_name} {'('}
                    {creditMonitoring.recommentor_move_to_legal.role}
                    {')'}
                  </p>
                  <p className="text-sm font-semibold">
                    {'Email: '}
                    {creditMonitoring.recommentor_move_to_legal.email}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setIsMoveToLegalRecommendModalOpen(true)}
                  disabled={isLoading}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white"
                >
                  {'Recommend for Legal Action'}
                </button>
              )}

              {[Roles.Admin, Roles.Manager].includes(role) &&
                creditMonitoring?.recommented_move_to_legal && (
                  <button
                    onClick={() => setIsMoveToLegalModalOpen(true)}
                    disabled={isLoading}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm uppercase text-white"
                  >
                    {'Proceed with Legal Action'}
                  </button>
                )}
            </div>
          )}
        </div>

        {/* Modal */}
        {isMoveToLegalRecommendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-4 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">
                {'Confirm Recommendation'}
              </h3>
              <p>
                {'Are you sure you want to recommend this for legal action?'}
              </p>
              <div className="mt-6 flex items-center justify-end gap-4">
                <button
                  onClick={() => setIsMoveToLegalRecommendModalOpen(false)}
                  className="rounded-lg border px-4 py-2 text-gray-600"
                >
                  {'No'}
                </button>
                <button
                  onClick={recomendLegalAction}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-white"
                >
                  {'Yes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isMoveToLegalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-4 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">
                {'Confirm Proceed with Legal Action'}
              </h3>
              <p>{'Are you sure you want to Proceed with Legal Action?'}</p>
              <div className="mt-6 flex items-center justify-end gap-4">
                <button
                  onClick={() => setIsMoveToLegalModalOpen(false)}
                  className="rounded-lg border px-4 py-2 text-gray-600"
                >
                  {'No'}
                </button>
                <button
                  onClick={moveToLegalButton}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  {'Yes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid h-[50vh] w-full place-content-center">
            <Loader />
          </div>
        ) : (
          <div className="mb-6 h-[46vh] overflow-auto">
            {comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-200 py-2">
                <p className="text-gray-700">{comment.comment}</p>
                <p className="text-sm text-gray-500">
                  {'By '}
                  {comment.created_by.first_name} {comment.created_by.last_name}
                  {' ('}
                  {comment.created_by.role}
                  {') on'}{' '}
                  {dayjs(comment.created_on).format('hh:mm a DD-MM-YYYY')}
                </p>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              placeholder="Add Comment"
              className={`w-full border p-2 ${
                errors.comment ? 'border-red-500' : 'border-gray-300'
              } rounded-lg`}
              {...register('comment')}
            ></textarea>
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gray-500 px-4 py-2 text-white"
          >
            {'Add Comment'}
          </button>
        </form>
      </div>
    </SidebarLayout>
  );
};

export default CreditDefaultDetailPage;
