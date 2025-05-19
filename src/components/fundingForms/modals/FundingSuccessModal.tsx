import { useState } from 'react';

import { loanFormCommonStyleConstant } from '../../../utils/constants';
import { FundingSuccessModalInterface } from '../../../utils/types';

const FundingSuccessModal: React.FC<FundingSuccessModalInterface> = ({
  isOpen,
  onClose,
  onSubmit,
  head,
  content,
  setRemark
}) => {
  const [remarkError, setRemarkError] = useState<string | null>(null);
  const [remark, updateRemark] = useState<string>('');

  const handleRemarkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateRemark(e.target.value);
    setRemarkError(null); // Clear error when user starts typing
    setRemark(e.target.value);
  };

  const handleSubmit = e => {
    if (setRemark && remark.trim() === '') {
      setRemarkError('Remark is required.');
    } else {
      onSubmit(e); // Proceed with the submission
    }
  };

  return (
    <>
      {isOpen && (
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
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {head}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{content}</p>
                    </div>
                  </div>
                </div>
              </div>

              {setRemark && (
                <div className="bg-white px-4 py-5 sm:p-6 sm:py-4">
                  <p className="mb-4 text-sm text-gray-500">
                    {'Give a Remark'}
                  </p>
                  <div
                    className={`flex flex-col ${loanFormCommonStyleConstant.date.wrapperClass}`}
                  >
                    <textarea
                      className={`${loanFormCommonStyleConstant.text.fieldClass} ${
                        remarkError ? 'border-red-500' : ''
                      }`}
                      onChange={handleRemarkChange}
                      value={remark}
                    />
                    {remarkError && (
                      <p
                        className={loanFormCommonStyleConstant.text.errorClass}
                      >
                        {remarkError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {onSubmit && (
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="cursor-pointer rounded-lg bg-[#1A439A] px-4 py-2 text-white"
                  >
                    {'Submit'}
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
      )}
    </>
  );
};

export default FundingSuccessModal;
