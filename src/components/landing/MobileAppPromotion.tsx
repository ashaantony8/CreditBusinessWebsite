import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import appinstall from '../../assets/images/APPinsatll.png';
import apple from '../../assets/images/apple.png';
import google from '../../assets/images/google.png';
import mobiletick from '../../assets/images/mobiletick.png';
import logo from '../../assets/images/phnlogo.png';

const MobileAppPromotion: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      className="fixed left-0 top-0 z-50 h-full w-full bg-cover bg-center font-poppins"
      style={{ backgroundImage: `url(${appinstall})` }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white">
        <div className="flex w-full justify-between border-b px-2 py-4">
          <img src={logo} alt="Credit4Business Logo" className="h-10" />
          <button className="text-white" onClick={onClose}>
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="mt-16">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-white p-3">
              <img src={mobiletick} alt="Check Icon" className="ml-1 h-9 w-8" />
            </div>
          </div>

          <div className="text-[30px] font-bold">{'Credit4Business'}</div>
          <div className="mb-4 text-[30px] font-bold">
            {'Mobile Application'}
          </div>

          <p className="mb-16 text-[15px] font-normal leading-6">
            {'For the best experience, Please use mobile app'}
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              <img src={google} alt="Google Play" className="h-10" />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              <img src={apple} alt="App Store" className="h-10" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPromotion;
