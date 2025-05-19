import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import { RiRefreshLine } from 'react-icons/ri';

import {
  getFundLoanRemarksApi,
  sendFundLoanRemarksApi
} from '../../../api/loanServices';
import { FundingFromStatusEnum } from '../../../utils/enums';
import { fundingRemarksSchema } from '../../../utils/Schema';
import { Remark } from '../../../utils/types';
import Loader from '../../Loader';

const FundingRemarks = ({
  isOpen,
  onClose,
  loanId
}: {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
}) => {
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const methods = useForm<{ remarks?: string }>({
    resolver: yupResolver(fundingRemarksSchema)
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = methods;

  const onSubmit = useCallback(
    async (data: { remarks: string }) => {
      try {
        await sendFundLoanRemarksApi(data, loanId);
        reset();
        fetchRemarks();
      } catch (error) {
        console.error('Error sending remarks:', error);
      }
    },
    [loanId, reset]
  );

  const fetchRemarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getFundLoanRemarksApi(loanId);
      const sortedRemarks = response.data.sort((a: Remark, b: Remark) => {
        return (
          new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
        );
      });

      setRemarks(sortedRemarks);
    } catch (error) {
      console.error('Error fetching remarks:', error);
    }
    setIsLoading(false);
  }, [loanId]);

  useEffect(() => {
    if (isOpen) {
      fetchRemarks();
    }
  }, [isOpen, fetchRemarks, isRefresh]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [remarks]);

  if (!isOpen) return null;

  const getRemarkStyle = (remarkType: string) => {
    switch (remarkType) {
      case 'Agent_Submitted':
        return 'shadow-inner custom-shadow-green-300 hover:shadow-lg border border-green-300 text-black';
      case 'Underwriter_Submitted':
        return 'shadow-inner custom-shadow-yellow-300 hover:shadow-lg border border-yellow-300 text-black';
      case 'Manager_Approved':
        return 'shadow-inner custom-shadow-pink-300 hover:shadow-lg border border-pink-300 text-black';
      case 'Admin_Cash_Disbursed':
        return 'shadow-inner custom-shadow-orange-300 hover:shadow-lg border border-orange-300 text-black';
      default:
        return 'shadow-inner custom-shadow-gray-300 hover:shadow-lg border border-gray-300 text-black';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative mx-4 flex w-full max-w-lg flex-col rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <h2 className="mr-2 text-lg font-semibold">{'Remarks'}</h2>
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
              {remarks.length > 0 ? (
                remarks.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start ${
                      item.created_by.role === 'admin' ? 'justify-end' : ''
                    }`}
                  >
                    <div
                      className={`w-full max-w-xs rounded-lg p-2 ${getRemarkStyle(
                        item.remark_type
                      )}`}
                    >
                      <div className="flex justify-between gap-4">
                        <p className="mt-1 text-xs">
                          <strong>{item.created_by.role}</strong>
                          {' -'} {item.created_by.username}
                        </p>
                        <p className="mt-1 text-xs">
                          <strong>
                            {FundingFromStatusEnum[item?.remark_type]}
                          </strong>
                        </p>
                      </div>
                      <p className="py-4 text-sm">{item.remarks}</p>
                      <p className="mt-1 text-end text-xs">
                        {new Date(item.created_on).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {'No Remarks available'}
                </p>
              )}
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-t border-gray-200 bg-gray-50 p-4"
        >
          <textarea
            placeholder="Type your Remarks here..."
            className={`w-full border p-2 ${
              errors.remarks ? 'border-red-500' : 'border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500`}
            {...register('remarks')}
          ></textarea>
          {errors.remarks && (
            <p className="mt-1 text-sm text-red-500">
              {errors.remarks.message}
            </p>
          )}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[#BABABA] px-4 py-2 text-white hover:bg-[#1A439A]"
          >
            {'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default FundingRemarks;
