import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  loanOfferDecisionApi,
  viewLoanOffersApi
} from '../../../api/loanServices';
import MakeOffer from '../../../components/fundingForms/modals/MakeOffer';
import Header from '../../../components/management/common/Header';
import { authSelector } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { Offer } from '../../../utils/types';

// Utility function to format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

const FundingOffers: React.FC<{ loanId?: string }> = ({ loanId }) => {
  const { query_params_loanId } = useParams();
  const fundingId = loanId || query_params_loanId;
  const { showToast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMakeOfferConfirmModal, setIsMakeOfferConfirmModal] = useState(false);

  const fetchDataFromApi = async (fundingId: string) => {
    try {
      const response = await viewLoanOffersApi(fundingId);
      if (response?.status_code === 200) {
        setOffers(response.data);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch {
      showToast('Something went wrong!', { type: NotificationType.Error });
    }
  };

  const { role } = useSelector(authSelector);

  useEffect(() => {
    if (fundingId) {
      fetchDataFromApi(fundingId);
    }
  }, [fundingId, isMakeOfferConfirmModal, modalOpen]);

  const handleCardClick = (offer: Offer) => {
    setSelectedOffer(offer);
    if (!offer.is_expired) {
      setModalOpen(true);
    }
  };

  const handleOfferAction = async action => {
    try {
      if (selectedOffer) {
        const payload = {
          loan_offer_id: selectedOffer.id,
          action
        };
        const loanOfferApiResponse = await loanOfferDecisionApi(payload);
        if (loanOfferApiResponse?.status_code === 200) {
          showToast('Offer submitted successfully!', {
            type: NotificationType.Success
          });
          setTimeout(() => {
            setModalOpen(false);
          }, 1000);
        } else {
          showToast(loanOfferApiResponse.status_message, {
            type: NotificationType.Error
          });
        }
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('Something went wrong!', { type: NotificationType.Error });
    }

    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const DetailedOffer = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-96 rounded-lg bg-white p-8 shadow-lg">
        <button
          className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-700"
          onClick={handleCloseModal}
        >
          &times;
        </button>
        <div className="mb-6">
          <div className="mb-4 text-xl font-bold text-blue-600">
            {formatDate(selectedOffer?.offer_date)}
          </div>
        </div>
        <div className="mb-6 flex flex-col gap-6">
          <div className="border-b border-gray-200 pb-4">
            <p className="text-lg font-semibold text-gray-800">
              {'Applied Funding Details'}
            </p>
            <div className="mt-2 space-y-2">
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">
                  {'Applied Funding Amount:'}
                </span>
                <span className="font-medium text-gray-900">
                  {'£'}
                  {selectedOffer?.applied_loan_amount}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">
                  {'Applied Duration:'}
                </span>
                <span className="font-medium text-gray-900">
                  {selectedOffer?.applied_fund_duration_weeks} {'weeks'}
                </span>
              </p>
            </div>
          </div>
          <div className="border-b border-gray-200 pb-4">
            <p className="text-lg font-semibold text-gray-800">
              {'Offer Funding Details'}
            </p>
            <div className="mt-2 space-y-2">
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">
                  {'Offer Amount:'}
                </span>
                <span className="font-medium text-gray-900">
                  {'£'}
                  {selectedOffer?.offer_amount}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">
                  {'Offer Duration:'}
                </span>
                <span className="font-medium text-gray-900">
                  {selectedOffer?.offer_number_of_weeks} {'weeks'}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">
                  {'Weekly Repayment Amount:'}
                </span>
                <span className="font-medium text-gray-900">
                  {'£'}
                  {selectedOffer?.offer_weekly_payment_amount}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-gray-800">{'Status:'}</span>
            <span
              className={`font-medium ${selectedOffer.offer_accepted ? 'text-green-500' : selectedOffer.offer_rejected ? 'text-red-500' : 'text-gray-500'}`}
            >
              {selectedOffer.offer_accepted
                ? 'Accepted'
                : selectedOffer.offer_rejected
                  ? 'Rejected'
                  : 'No Action'}
            </span>
          </div>
        </div>
        {[Roles.Customer, Roles.Leads].includes(role as Roles) &&
          !(selectedOffer.offer_rejected || selectedOffer.offer_accepted) && (
            <div className="mt-6 flex gap-4">
              <button
                className="rounded-lg bg-green-500 px-5 py-2 text-white shadow-md transition hover:bg-green-600"
                onClick={() => handleOfferAction(true)}
              >
                {'Accept'}
              </button>
              <button
                className="rounded-lg bg-red-500 px-5 py-2 text-white shadow-md transition hover:bg-red-600"
                onClick={() => handleOfferAction(false)}
              >
                {'Reject'}
              </button>
            </div>
          )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Header
        title="Funding Offers"
        onAdd={
          role === Roles.Manager
            ? () => setIsMakeOfferConfirmModal(true)
            : undefined
        }
      />
      <div className="p-4">
        {offers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`relative rounded-lg border border-gray-400 bg-white p-6 shadow-lg ${offer.is_expired ? 'opacity-50' : 'transform transition duration-300 hover:scale-105 hover:shadow-xl'}`}
                onClick={() => handleCardClick(offer)}
              >
                <div className="mb-4">
                  <div className="text-xl font-bold text-blue-600">
                    {formatDate(offer.offer_date)}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-gray-800">
                      {'Offer Amount:'}
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      {'£'}
                      {offer.offer_amount}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-gray-800">
                      {'Offer Weeks:'}
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      {offer.offer_number_of_weeks} {'weeks'}
                    </span>
                    {offer.is_expired && (
                      <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        {'Expired'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-gray-800">
                      {'Weekly Repayment Amount:'}
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      {'£'}
                      {offer.offer_weekly_payment_amount}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-gray-800">
                      {'Status:'}
                    </span>
                    <span
                      className={`font-medium ${offer.offer_accepted ? 'text-green-500' : offer.offer_rejected ? 'text-red-500' : 'text-gray-500'}`}
                    >
                      {offer.offer_accepted
                        ? 'Accepted'
                        : offer.offer_rejected
                          ? 'Rejected'
                          : 'No Action'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">{'No data available'}</div>
        )}
      </div>

      {modalOpen && <DetailedOffer />}
      <MakeOffer
        isOpen={isMakeOfferConfirmModal}
        onClose={() => setIsMakeOfferConfirmModal(false)}
        loanId={fundingId}
      />
    </div>
  );
};

export default FundingOffers;
