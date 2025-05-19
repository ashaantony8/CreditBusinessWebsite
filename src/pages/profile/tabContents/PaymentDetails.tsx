import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { getPaymentApi } from '../../../api/loanServices';
import Loader from '../../../components/Loader';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import PaymentHistory from './PaymentHistoryCard';
import PaymentCard from './PaymentInfoCard';

const PaymentDetails: React.FC<{ loanId: string }> = ({ loanId }) => {
  const { showToast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [payments, setPayments] = useState(undefined);
  const [loader, setLoader] = useState(false);

  const fetchPaymentData = async () => {
    try {
      const getPaymentApiResponse = await getPaymentApi(loanId);
      if (
        getPaymentApiResponse.status_code >= 200 &&
        getPaymentApiResponse.status_code < 300
      ) {
        setPayments(getPaymentApiResponse.data);
      } else {
        showToast(getPaymentApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('Error fetching Payment Api:', error);
      // Handle error
    }
  };

  useEffect(() => {
    if (loanId) fetchPaymentData();
  }, [loanId]);

  return (
    <div>
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}

      {payments ? (
        <section className="relative overflow-hidden bg-white">
          <div className="flex flex-wrap">
            {payments && (
              <div className="max-h-[400px] w-full overflow-y-auto px-4 lg:w-1/2">
                <PaymentCard
                  payments={payments?.funding_payments}
                  loanId={loanId}
                  setLoader={setLoader}
                />
              </div>
            )}
            <div className="max-h-[400px] w-full overflow-y-auto px-4 lg:w-1/2">
              <div className="border bg-white">
                <div className="flex justify-center p-2"></div>
                <div className="px-4 pb-3">
                  <div>
                    <p className="mx-4 break-all font-semibold dark:text-gray-900">
                      {'Payment History'}
                    </p>
                  </div>
                  <div className="mx-4 flex">
                    <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                      <button className="flex items-center pt-3.5 text-sm text-gray-500 focus:outline-none">
                        {'Activity'}{' '}
                        {isDropdownOpen ? (
                          <IoIosArrowUp className="ml-1 mt-1" />
                        ) : (
                          <IoIosArrowDown className="ml-1 mt-1" />
                        )}
                      </button>
                    </div>
                  </div>
                  <PaymentHistory
                    paymentHistory={payments?.funding_payment_history}
                    isDropdownOpen={isDropdownOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="px-6 py-4 text-center">{'No data available'}</div>
      )}
    </div>
  );
};

export default PaymentDetails;
