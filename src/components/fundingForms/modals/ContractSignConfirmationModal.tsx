import { useEffect } from 'react';

const ContractSignConfirmation = ({
  isOpen,
  onClose,
  onApprove,
  head,
  content,
  setUpdateRateOfInterest,
  InterestOld,
  InterestNew
}) => {
  useEffect(() => {
    if (!InterestNew) {
      setUpdateRateOfInterest(InterestOld);
    }
  }, []);
  const handleApprove = () => {
    onApprove();
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
                    <div className="mt-2 flex flex-col">
                      <p className="mb-4 text-sm text-gray-500">{content}</p>
                      {/* <p className="text-sm text-gray-500 mb-4">
                        Do you want to change the rate of interest?.
                      </p>
                      <div
                        className={`flex justify-between ${loanFormCommonStyleConstant.date.wrapperClass}`}
                      >
                        <input
                          className={
                            loanFormCommonStyleConstant.text.fieldClass
                          }
                          type="number"
                          defaultValue={InterestOld}
                          onChange={(e) => {
                            setUpdateRateOfInterest(parseFloat(e.target.value));
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-4">
                          Give the reason for rejection.
                        </p>
                        <div
                          className={`flex justify-between ${
                            loanFormCommonStyleConstant.date.wrapperClass
                          } ${
                            interestChangeError &&
                            "border-b-2 border-red-500 w-[100%]"
                          }`}
                        >
                          <textarea
                            className={
                              loanFormCommonStyleConstant.text.fieldClass
                            }
                            onChange={(e) => {
                              setInterestChangeReason(e.target.value);
                            }}
                          />
                        </div>
                        {interestChangeError && (
                          <p
                            className={
                              loanFormCommonStyleConstant.text.errorClass
                            }
                          >
                            {interestChangeError}
                          </p>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={handleApprove}
                  type="button"
                  className="mr-4 cursor-pointer border border-[#1A439A] bg-[#1A439A] px-4 py-2 text-white"
                >
                  {'Send'}
                </button>
                <button
                  onClick={onClose}
                  type="button"
                  className="mr-4 cursor-pointer border border-[#1A439A] bg-[#1A439A] px-4 py-2 text-white"
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

export default ContractSignConfirmation;
