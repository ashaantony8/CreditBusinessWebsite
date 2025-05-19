import { useEffect, useState } from 'react';

import { loanFormCommonStyleConstant } from '../../../utils/constants';
import { Roles } from '../../../utils/enums';
import { FundingApproveOrRejectModalInterface } from '../../../utils/types';

const FundingApproveOrRejectModal: React.FC<
  FundingApproveOrRejectModalInterface
> = ({
  role,
  isApprove = false,
  onClose,
  onApprove,
  onReject,
  head,
  content,
  setRemarks,
  setRateOfInterest,
  rateOfInterest,
  remarks
}) => {
  const [remarkError, setRemarkError] = useState<string | null>(null);
  const [remark, setRemark] = useState<string | null>(null);

  useEffect(() => {
    if (remark) {
      setRemarks(remark);
    }
  }, [remark]);

  useEffect(() => {
    return () => {
      setRemark(null);
      setRemarkError(null);
    };
  }, []);

  useEffect(() => {
    if (remarks && remarks.trim() !== '') setRemarkError(null);
  }, [remarks, rateOfInterest]);

  const handleApprove = () => {
    let hasError = false;

    if (!remark || (remark && remark.trim() === '')) {
      setRemarkError('Remark is required.');
      hasError = true;
    }
    if (setRateOfInterest && !rateOfInterest) {
      hasError = true;
    }

    if (!hasError) onApprove();
  };

  const handleReject = () => {
    if (setRemarks && (!remarks || remarks.trim() === '')) {
      setRemarkError('Remark required.');
    } else {
      onReject();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="block flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                {isApprove ? (
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {head}
                </h3>
                <div className="mt-2 flex flex-col">
                  <p className="mb-4 text-sm text-gray-500">{content}</p>
                  <div>
                    <p className="mb-4 text-sm text-gray-500">
                      {'Give remark'}
                    </p>
                    <div
                      className={`flex justify-between ${loanFormCommonStyleConstant.date.wrapperClass} ${
                        remarkError && 'w-[100%] border-b-2 border-red-500'
                      }`}
                    >
                      <textarea
                        className={loanFormCommonStyleConstant.text.fieldClass}
                        value={remark}
                        onChange={e => {
                          setRemark(e.target.value);
                        }}
                      />
                    </div>
                    {remarkError && (
                      <p
                        className={loanFormCommonStyleConstant.text.errorClass}
                      >
                        {remarkError}
                      </p>
                    )}
                  </div>
                  {/* {role === Roles.Manager && isApprove && setRateOfInterest && (
                    <div>
                      <p className="text-sm text-gray-500 mb-4">Change Rate of Interest</p>
                      <div
                        className={`flex justify-between ${loanFormCommonStyleConstant.date.wrapperClass} ${
                          interestError && "border-b-2 border-red-500 w-[100%]"
                        }`}
                      >
                        <input
                          className={loanFormCommonStyleConstant.text.fieldClass}
                          type="number"
                          value={rateOfInterest}
                          onChange={(e) => {
                            setRateOfInterest(parseFloat(e.target.value));
                          }}
                        />
                      </div>
                      {interestError && (
                        <p className={loanFormCommonStyleConstant.text.errorClass}>
                          {interestError}
                        </p>
                      )}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            {isApprove ? (
              <button
                onClick={handleApprove}
                type="button"
                className="mr-4 cursor-pointer rounded-lg bg-[#50C878] px-4 py-2 text-white"
              >
                {'Approve'}
              </button>
            ) : (
              <button
                onClick={handleReject}
                type="button"
                className="mr-4 cursor-pointer rounded-lg bg-[#C92519] px-4 py-2 text-white"
              >
                {role === Roles.UnderWriter ? 'Return' : 'Reject'}
              </button>
            )}
            <button
              onClick={onClose}
              type="button"
              className="mr-4 cursor-pointer rounded-lg bg-[#1A439A] px-4 py-2 text-white"
            >
              {'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingApproveOrRejectModal;
