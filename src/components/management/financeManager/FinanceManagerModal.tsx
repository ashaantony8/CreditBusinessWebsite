import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { GrLocation } from 'react-icons/gr';

import FinanceManagerForm from './FinanceManagerForm';

const FinanceManagerModal = ({ isOpen, onClose, userData }) => {
  const [userDetails, setUserDetails] = useState(null);

  // Receive userData as props
  if (!isOpen) return null;

  const userDetailsHandler = data => {
    setUserDetails(data);
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-auto bg-black bg-opacity-50">
        <div className="relative h-screen w-full overflow-auto rounded-lg bg-white p-6 md:w-1/2 lg:w-1/2 xl:w-1/2">
          <div className="absolute right-0 top-0 flex items-center p-2">
            <button
              onClick={onClose}
              className="flex p-4 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={32} />
            </button>
          </div>
          <div className="flex items-center text-start">
            <span>
              <img
                // src={userDetails.image}
                alt=""
                className="h-16 w-16 flex-shrink-0 self-center rounded-full border border-gray-300 bg-gray-500 max-sm:h-12 max-sm:w-12 md:justify-self-start"
              />
            </span>
            <span className="px-2">
              <p className="mx-2 mb-1 text-[18px] font-semibold max-sm:text-[14px]">
                {`${userDetails?.first_name} ${userDetails?.last_name}`}
              </p>
              <p className="flex items-center text-[14px] font-medium text-[#1A449A] max-sm:text-[8px]">
                <GrLocation className="mx-2 mb-[2px] font-medium" />
                {userDetails?.address}
              </p>
            </span>
          </div>
          {/* )} */}
          <div className="mt-4 flex flex-col justify-center">
            <div className="mt-5 h-96 overflow-y-scroll">
              <FinanceManagerForm
                userData={userData}
                userDetails={userDetailsHandler}
                closeModal={onClose}
              />{' '}
              {/* Pass userData to FinanceManagerForm */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagerModal;
