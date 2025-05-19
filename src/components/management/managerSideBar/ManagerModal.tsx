import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { GrLocation } from 'react-icons/gr';

import MangerlForm from './MangerForm';

const MangerModal = ({ isOpen, onClose, managerId }) => {
  // const [isEditing, setIsEditing] = useState(false);
  const [managerDetails, setManagerDetails] = useState(null);

  const closeModal = () => {
    onClose(false);
  };
  // const handleEditClick = () => {
  //   if (isEditing) {

  //     setIsEditing(false);
  //   } else {
  //     setIsEditing(true);
  //   }
  // };

  const managerDetailsHandler = data => {
    setManagerDetails(data);
  };

  if (!isOpen) return null;
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   managerId((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

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
                src={managerDetails?.image}
                alt=""
                className="h-20 w-20 flex-shrink-0 self-center rounded-full border border-gray-300 bg-gray-500 max-sm:h-12 max-sm:w-12 md:justify-self-start"
              />
            </span>
            <span className="px-2">
              <p className="mx-2 mb-1 text-[18px] font-semibold max-sm:text-[14px]">
                {`${managerDetails?.first_name} ${managerDetails?.last_name}`}
              </p>
              <p className="flex items-center text-[14px] font-medium text-[#1A449A] max-sm:text-[8px]">
                <GrLocation className="mx-2 mb-[2px] font-medium" />
                {managerDetails?.address}
              </p>
            </span>
          </div>
          {/* )} */}
          <div className="mt-4 flex flex-col justify-center">
            <div className="mt-5 h-96 overflow-y-scroll">
              <MangerlForm
                managerData={managerId}
                managerDetail={managerDetailsHandler}
                onClose={closeModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangerModal;
