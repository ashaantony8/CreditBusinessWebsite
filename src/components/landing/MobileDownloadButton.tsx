import React, { useState } from 'react';

import quick from '../../assets/images/smartphone.png';
import MobileAppPromotion from './MobileAppPromotion';

const MobileDownloadButton: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      <button
        className="fixed bottom-[10%] right-0 z-50 flex w-[50%] items-center justify-between gap-4 rounded-l-lg bg-[#1A439A] sm:hidden" // Added items-center to align items vertically
        onClick={togglePopup}
      >
        <span className="flex gap-2">
          <span className="ml-[1px] flex w-[25%] items-center justify-center">
            <img src={quick} className="h-7 w-8" alt="Quick" />
          </span>
          <p className="mr-[2px] py-3 text-left text-[10px] text-white">
            {'For the best experience, Please use mobile app'}
          </p>
        </span>
      </button>
      {showPopup && <MobileAppPromotion onClose={togglePopup} />}
    </>
  );
};

export default MobileDownloadButton;
