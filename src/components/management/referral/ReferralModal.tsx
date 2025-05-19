// import { useState } from "react";
import { AiOutlineClose } from 'react-icons/ai';

import ReferalForm from './ReferalForm';

const ReferralModal = ({ isOpen, onClose, referral, updateReferralStatus }) => {
  // const [referralDetails, setReferralDetails] = useState(null);

  // const [formData, setFormData] = useState({
  //   name: "",
  //   address: "",
  //   description: "",
  //   imageUrl: ""
  // });
  // console.log('referralId',referral);

  // useEffect(() => {
  //   if (referral) {
  //     setFormData({
  //       name: referral.first_name || "",
  //       address: referral.address || "",
  //       description: referral.description || "",
  //       imageUrl: referral.imageUrl || ""
  //     });
  //   }
  // }, [referral]);

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

  const referralDetailsHandler = () => {
    // setReferralDetails(data);
  };
  // console.log("referralDetails",referralDetails);
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   referral((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

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
                <input type="file" accept="image/*" className="hidden" id="imageUpload" />
                <label htmlFor="imageUpload" className="relative">
                  {/* <img
                    src={referralDetails.imageUrl}
                    alt=""
                    className="self-center flex-shrink-0 h-20 w-20 border max-sm:h-12 max-sm:w-12 rounded-full md:justify-self-start bg-gray-500 border-gray-300 cursor-pointer"
                  /> */}
          {/* <FiCamera className="absolute top-14  right-0 mt-2 mr-2 text-gray-600 cursor-pointer" size={20} />
                </label> */}
          {/* </span>
              <span className="px-2">
                <input
                  type="text"
                  name="name"
                  value={referralDetails.name}
                  onChange={handleChange}
                  className={`text-[18px] font-semibold mb-1 max-sm:text-[14px] mx-2 ${isEditing ? 'border-b-2  border-gray-400 p-1  focus:outline-none' : ''}`}
                />
                <div className="flex items-center">
                  <GrLocation />
                  <input
                    type="text"
                    name="address"
                    value={referralDetails.address}
                    onChange={handleChange}
                    className={`text-[#1A449A] text-[14px] max-sm:text-[8px] font-medium mx-2 mb-[2px] ${isEditing ? 'border-b-2  border-gray-400 p-1  focus:outline-none' : ''}`}
                  />
                </div>
              </span>
            </div>
          ) : ( */}
          <div className="flex items-center text-start">
            <span className="px-2">
              <p className="mx-2 mb-1 text-[18px] font-semibold max-sm:text-[14px]">
                {/* {`${referralDetails?.first_name} ${referralDetails?.last_name}` ??
                    ""} */}
              </p>
            </span>
          </div>
          {/* )} */}
          <div className="mt-4 flex flex-col justify-center">
            <div className="mt-5 h-[85vh] overflow-y-scroll">
              <ReferalForm
                referalData={referral}
                referralDetails={referralDetailsHandler}
                updateReferralStatus={updateReferralStatus}
                closeModal={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;
