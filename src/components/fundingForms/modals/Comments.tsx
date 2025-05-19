import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { RiRefreshLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import {
  getFundLoanCommentsApi,
  sendFundLoanCommentsApi
} from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import { FundingFromStatusEnum, Roles } from '../../../utils/enums';
import { fundingCommentsSchema } from '../../../utils/Schema';
import { Comment } from '../../../utils/types';
import Loader from '../../Loader';

const FundingComments = ({
  isOpen,
  onClose,
  loanId
}: {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement | null>(null); // Reference to the message container

  const methods = useForm<{ comment?: string }>({
    resolver: yupResolver(fundingCommentsSchema)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = methods;
  const { role } = useSelector(authSelector);

  const onSubmit = useCallback(
    async (data: { comment: string }) => {
      try {
        await sendFundLoanCommentsApi(data, loanId);
        reset();
        fetchComments();
      } catch (error) {
        console.error('Error sending comments:', error);
      }
    },
    [loanId, reset]
  );

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getFundLoanCommentsApi(loanId);
      const sortedComments = response.data.sort((a: Comment, b: Comment) => {
        return (
          new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
        );
      });

      setComments(sortedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
    setIsLoading(false);
  }, [loanId]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments, isRefresh]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [comments]);

  if (!isOpen) return null;
  const getCommentStyle = (remarkType: string) => {
    switch (remarkType) {
      case 'Manager_Rejected':
        return 'shadow-inner custom-shadow-red-300 hover:shadow-lg border border-red-300 text-black';
      case 'Underwriter_Returned':
        return 'shadow-inner custom-shadow-orange-300 hover:shadow-lg border border-orange-300 text-black';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative mx-4 flex w-full max-w-lg flex-col rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <h2 className="mr-2 text-lg font-semibold">{'Comments'}</h2>
            <button
              onClick={() => setIsRefresh(prevState => !prevState)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Refresh"
            >
              <RiRefreshLine size={24} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div
          className="flex-1 overflow-auto bg-gray-100 p-4"
          ref={messageContainerRef}
          style={{ maxHeight: '60vh' }}
        >
          {isLoading ? (
            <div className="grid h-full w-full place-content-center">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {comments.length > 0 ? (
                comments.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start ${
                      item.created_by.role === 'admin' ? 'justify-end' : ''
                    }`}
                  >
                    <div
                      className={`w-full max-w-xs rounded-lg p-2 ${getCommentStyle(
                        item.comment_type
                      )}`}
                    >
                      <div className="flex justify-between gap-4">
                        <p className="mt-1 text-xs">
                          <strong>{item.created_by.role}</strong>
                          {' -'} {item.created_by.username}
                        </p>
                        <p className="mt-1 text-xs">
                          <strong>
                            {FundingFromStatusEnum[item?.comment_type]}
                          </strong>
                        </p>
                      </div>
                      <p className="py-4 text-sm">{item.comments}</p>
                      <p className="mt-1 text-end text-xs">
                        {new Date(item.created_on).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {'No comments available'}
                </p>
              )}
            </div>
          )}
        </div>

        {[Roles.FieldAgent, Roles.Leads, Roles.Customer].includes(
          role as Roles
        ) && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-t border-gray-200 bg-gray-50 p-4"
          >
            <textarea
              placeholder="Type your Comments here..."
              className={`w-full border p-2 ${
                errors.comment ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500`}
              {...register('comment')}
            ></textarea>
            {errors.comment && (
              <p className="mt-1 text-sm text-red-500">
                {errors.comment.message}
              </p>
            )}
            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-[#BABABA] px-4 py-2 text-white hover:bg-[#1A439A]"
            >
              {'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FundingComments;
