import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { GrLocation } from 'react-icons/gr';

import FieldAgentForm from './FieldAgentForm';
// import { FiCamera } from "react-icons/fi";

const FiledAgentModal = ({ isOpen, onClose, userData }) => {
  // const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Receive userData as props
  if (!isOpen) return null;

  // const handleEditClick = () => {
  //   if (isEditing) {
  //     // Save changes logic can be added here
  //     // For now, we just toggle the editing state
  //     setIsEditing(false);
  //   } else {
  //     setIsEditing(true);
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   userData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const userDetailsHandler = data => {
    setUserDetails(data);
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-auto bg-black bg-opacity-50">
        <div className="relative h-screen w-full overflow-auto rounded-lg bg-white p-6 md:w-1/2 lg:w-1/2 xl:w-1/2">
          <div className="absolute right-0 top-0 flex items-center p-2">
            {/* <button
              onClick={handleEditClick}
              className="flex items-center text-gray-700 border border-gray-600 p-4 gap-2 h-[20px] rounded"
            >
              <span>{isEditing ? "Save" : "Edit"}</span>
            </button> */}
            <button
              onClick={onClose}
              className="flex p-4 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={32} />
            </button>
          </div>
          {/* {isEditing ? (
            <div className="text-start flex items-center">
              <span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="relative">
                  <img
                    src={userData.image}
                    alt=""
                    className="self-center flex-shrink-0 h-16 w-16 border max-sm:h-12 max-sm:w-12 rounded-full md:justify-self-start bg-gray-500 border-gray-300 cursor-pointer"
                  />
                  <FiCamera
                    className="absolute top-14  right-0 mt-2 mr-2 text-gray-600 cursor-pointer"
                    size={20}
                  />
                </label>
              </span>
              <span className="px-2">
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className={`text-[18px] font-semibold mb-1 max-sm:text-[14px] mx-2 ${
                    isEditing
                      ? "border-b-2  border-gray-400 p-1  focus:outline-none"
                      : ""
                  }`}
                />
                <div className="flex items-center">
                  <GrLocation />
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    className={`text-[#1A449A] text-[14px] max-sm:text-[8px] font-medium mx-2 mb-[2px] ${
                      isEditing
                        ? "border-b-2  border-gray-400 p-1  focus:outline-none"
                        : ""
                    }`}
                  />
                </div>
              </span>
            </div>
          ) : ( */}
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
              <FieldAgentForm
                userData={userData}
                userDetails={userDetailsHandler}
                closeModal={onClose}
              />{' '}
              {/* Pass userData to FieldAgentForm */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiledAgentModal;
