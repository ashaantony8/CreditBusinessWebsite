import { useEffect, useState } from 'react';

import { instantPayGetApi } from '../../../api/loanServices';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';

const buttonClasses = {
  active: `text-green-700 hover:text-white border bg-green-100 focus:outline-none text-sm px-5 py-0.5
     text-center me-2 mb-2 border-green-400 hover:bg-green-500 max-sm:text-[12px]`,
  closed: `text-red-700 border border-red-700 bg-red-300 focus:outline-none max-sm:text-[12px] text-sm px-5 py-0.5 text-center me-2 mb-2`,
  blue: `text-white bg-blue-700
  text-sm px-5 py-1.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700 focus:outline-none max-sm:text-[12px]`
};

const PaymentInfoCard = ({ payments = [], loanId, setLoader }) => {
  const { showToast } = useToast();
  const [amount, setAmount] = useState();

  useEffect(() => {
    if (payments.length > 0) {
      const firstPayment = payments[0];
      const fundingAmount = firstPayment?.next_due?.replace('£', '');
      setAmount(fundingAmount);
    }
  }, [payments]);

  const handleMakePayment = async () => {
    try {
      setLoader(true); // Start the loader
      const payload = {
        description: 'instant pay I missed due',
        amount: parseInt(amount, 10),
        currency: 'GBP'
      };

      const response = await instantPayGetApi(loanId, payload);

      if (response.status_code >= 200 && response.status_code < 300) {
        const { authorisation_url } = response.data;

        // Redirect to the authorisation_url in a new window/tab
        window.open(authorisation_url, '_blank');

        showToast('Redirecting to payment page...', {
          type: NotificationType.Success
        });
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch {
      showToast('Something went wrong!', { type: NotificationType.Error });
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {payments.length > 0 &&
        payments.map(paymentData => {
          return (
            <div key={paymentData.title} className="mb-8 border bg-white">
              <div className="py-3">
                <div className="mx-3 flex justify-between">
                  <p className="text-[20px] font-light max-sm:text-[14px]">
                    {paymentData.title}
                  </p>
                  <button
                    type="button"
                    className={
                      paymentData.status === 'Active'
                        ? buttonClasses.active
                        : buttonClasses.closed
                    }
                  >
                    {paymentData.status}
                  </button>
                </div>
                <div className="mx-2 flex justify-between pl-2 pr-2 max-sm:grid">
                  <div className="gap-3 py-2">
                    <p
                      className={`${(paymentData.status === 'Due' && 'text-red-600') || (paymentData.status === 'Active' && 'text-[#22CB53]')} text-4xl font-semibold max-sm:text-[28px]`}
                    >
                      {paymentData.next_due}
                    </p>

                    {paymentData.due_date && (
                      <p className="py-2 text-base text-gray-400 max-sm:text-[14px]">
                        {'Due Date'}
                        <span
                          className={
                            paymentData.status === 'Due'
                              ? 'text-red-600'
                              : 'text-[#22CB53]'
                          }
                        >
                          {' '}
                          {paymentData.due_date}
                        </span>
                      </p>
                    )}

                    {paymentData.due_date && paymentData.status === 'Due' && (
                      <span className="text-sm text-gray-400">
                        <button
                          type="button"
                          className="mb-2 me-2 bg-[#1A439A] px-5 py-1.5 text-sm text-white hover:bg-blue-700"
                          onClick={handleMakePayment}
                        >
                          {'Make Payment'}
                        </button>
                      </span>
                    )}
                  </div>
                </div>
                <hr className="w-100 h-px border bg-gray-200"></hr>
                <div className="mx-4 grid grid-cols-2 gap-2 px-1 pt-4 font-medium">
                  <div className="py-1 text-gray-500">{'Funding Amount'}</div>
                  <div className="flex justify-end py-1 text-black">
                    {paymentData.funding_amount}
                  </div>
                </div>
                <div className="mx-4 grid grid-cols-2 gap-2 px-1 pt-4 font-medium">
                  <div className="py-1 text-gray-500">
                    {'Installments Paid'}
                  </div>
                  <div className="flex justify-end py-1 text-black">
                    {paymentData.instalment_paid}
                  </div>
                </div>
                <div className="mx-4 grid grid-cols-2 gap-2 px-1 pt-4 font-medium">
                  <div className="py-1 text-gray-500">
                    {'Remaining Installments'}
                  </div>
                  <div className="flex justify-end py-1 text-black">
                    {paymentData.remaining_instalment}
                  </div>
                </div>
                <div className="mx-4 grid grid-cols-2 gap-2 px-1 pt-4 font-medium">
                  <div className="py-1 text-gray-500">
                    {'Total Installments'}
                  </div>
                  <div className="flex justify-end py-1 text-black">
                    {paymentData.total_instalment}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default PaymentInfoCard;
