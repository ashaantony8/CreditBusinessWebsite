import 'swiper/css';
import 'swiper/css/navigation';

import { useEffect, useState } from 'react';
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline
} from 'react-icons/io5';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getCustomerPaymentApi } from '../../api/loanServices';
import build from '../../assets/svg/unit-company.svg';
// import { getCustomerPaymentApiDummy } from "../../utils/data";
import { FundingFromCurrentStatus } from '../../utils/enums';
import { formatDate } from '../../utils/helpers';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import Loader from '../Loader';
import PaymentInfoCards from './PaymentInfoCard';

const PaymentBox = () => {
  const { showToast } = useToast();
  const [customerPayments, setCustomerPayments] = useState(undefined);
  const [loader, setLoader] = useState(false);

  const fetchPaymentData = async () => {
    try {
      const CustomerPaymentApiResponse = await getCustomerPaymentApi();
      if (
        CustomerPaymentApiResponse.status_code >= 200 &&
        CustomerPaymentApiResponse.status_code < 300
      ) {
        setCustomerPayments(CustomerPaymentApiResponse.data);
      } else {
        showToast(CustomerPaymentApiResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.error('Error fetching photo ID:', error);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  return (
    <div className="container mx-auto -mt-14">
      {loader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }}
        className="mySwiper"
        loop={true}
        autoplay={{
          delay: 5000, // Set delay to 5 seconds (5000ms)
          disableOnInteraction: true // Autoplay will not stop after user interactions
        }}
      >
        {Array.isArray(customerPayments) && customerPayments.length > 0 ? (
          customerPayments.map(
            (payment, index) =>
              [FundingFromCurrentStatus.AdminCashDisbursed].includes(
                payment.loan.loan_status.current_status
              ) && (
                <SwiperSlide key={index}>
                  <div
                    key={payment.company.company_name}
                    className="m-8 mx-[6%] border bg-white p-[4%] shadow-lg transition-shadow duration-300 hover:shadow-xl"
                  >
                    <div className="bg-white-300 mb-4 flex flex-wrap items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 hidden items-center justify-center rounded-full border-4 border-white bg-[#E8E8E8] p-3 text-xl font-semibold text-[#1A439A] sm:flex">
                          <img src={build} className="h-5 w-5" />
                        </div>
                        <div className="text-[12px] font-medium leading-6">
                          <p className="font-semibold text-[#929292]">
                            {'Company Name'}
                          </p>
                          {payment.company.company_name}
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-[12px] font-medium uppercase leading-6 text-[#929292]">
                          {' '}
                          {'Date:'}
                          <p className="text-[14px] font-semibold text-black max-sm:text-[10px]">
                            {formatDate(payment.loan.created_on)}
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <IoArrowBackCircleOutline
                            size={32}
                            className="text-[#8f9fc8] hover:text-color-text-secondary"
                          />

                          <IoArrowForwardCircleOutline
                            size={32}
                            className="text-[#8f9fc8] hover:text-color-text-secondary hover:ring-color-text-secondary"
                          />
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="mt-2">
                      <PaymentInfoCards
                        payments={[payment.funding_payments]}
                        loanId={payment.loan.id}
                        setLoader={setLoader}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              )
          )
        ) : (
          <></>
        )}
        <div className="absolute left-0 top-1/2 flex -translate-y-1/2 transform items-center">
          <IoArrowBackCircleOutline
            size={32}
            className="swiper-button-prev text-[#8f9fc8] hover:text-color-text-secondary"
          />
        </div>
        <div className="absolute right-0 top-1/2 flex -translate-y-1/2 transform items-center">
          <IoArrowForwardCircleOutline
            size={32}
            className="swiper-button-next text-[#8f9fc8] hover:text-color-text-secondary"
          />
        </div>
      </Swiper>
    </div>
  );
};

export default PaymentBox;
