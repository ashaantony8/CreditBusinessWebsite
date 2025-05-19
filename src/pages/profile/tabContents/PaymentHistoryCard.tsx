import React from 'react';

import password from '../../../assets/svg/credit-card.svg';

const PaymentHistoryCard = ({ paymentHistory, isDropdownOpen }) => (
  <div className="mx-4 grid grid-cols-2 gap-5 px-1 pt-4">
    {isDropdownOpen &&
      paymentHistory?.map((historyItem, index) => (
        <React.Fragment key={index}>
          <div className="text-black">
            <div className="flex gap-4 max-sm:grid">
              <div className="inline-block h-[46px] w-[46px] rounded-lg bg-[#d5dceb] p-3 text-white">
                <img src={password} />
              </div>
              <div className="text-sm font-medium">
                {historyItem.description}
                <div className="mt-1 text-xs font-normal text-gray-400">
                  {historyItem.date}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end font-medium text-black">
            {historyItem.amount}
          </div>
        </React.Fragment>
      ))}
  </div>
);

export default PaymentHistoryCard;
