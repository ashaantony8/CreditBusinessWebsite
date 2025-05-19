import { useEffect, useState } from 'react';
import { CiMail, CiMobile3 } from 'react-icons/ci';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { useSelector } from 'react-redux';

// import { SlLocationPin } from "react-icons/sl";
import { userProfileApi } from '../../../api/userServices';
import adress from '../../../assets/svg/address.svg';
import identity from '../../../assets/svg/identity.svg';
import UserIcon from '../../../assets/svg/user.svg';
import EditProfile from '../../../pages/profile/EditProfile';
import { authSelector } from '../../../store/auth/userSlice';
import { managementSliceSelector } from '../../../store/managementReducer';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { UserProfile } from '../../../utils/types';
import Header from '../common/Header';

const Profile = () => {
  const { user } = useSelector(managementSliceSelector);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const customerId = user.id;
  const { showToast } = useToast();
  const { role } = useSelector(authSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const fetchProfileResponse = await userProfileApi(customerId);
      if (fetchProfileResponse?.status_code === 200) {
        setProfile(fetchProfileResponse.data);
      } else {
        showToast(fetchProfileResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('Something went wrong!', { type: NotificationType.Error });
      console.log('error', error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [customerId]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    fetchProfile();
  };

  return (
    <>
      <Header
        title="Profile"
        // onFilterChange={handleFilterChange}
        // dropdownData={dropdownData}
        // initialFilters={initialFilters}
        // onSearch={handleSearch}
        // onAdd={handleAdd}
      />

      <div className="flex flex-col justify-end max-sm:p-4 sm:flex-row-reverse">
        <div className="items-center justify-end text-[#818181]">
          {[Roles.Admin, Roles.Manager, Roles.UnderWriter].includes(role) && (
            <button
              onClick={toggleModal}
              className="flex items-center justify-end rounded-lg bg-transparent px-5 text-center text-sm font-medium text-gray-400"
              type="button"
            >
              <MdModeEdit className="mx-2" />
              {'EDIT'}
            </button>
          )}
        </div>
        <div className="grid w-full grid-cols-1 gap-4 max-sm:gap-1 sm:grid-cols-2">
          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <img
                src={profile.image || UserIcon}
                className="h-7 w-7 text-[#929292]"
              />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'Name'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">{`${profile?.first_name} ${profile?.last_name}`}</div>
            </div>
          </div>

          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <img src={identity} className="h-7 w-7 text-[#929292]" />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'ID'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">
                {profile?.customer_id}
              </div>
            </div>
          </div>

          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <CiMail className="stroke-1 text-[#929292]" size={28} />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'Email Address'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">
                {profile?.email}
              </div>
            </div>
          </div>

          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <CiMobile3 className="stroke-1 text-[#929292]" size={28} />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'Phone Number'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">{`+44 ${profile?.phone_number}`}</div>
            </div>
          </div>

          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <img src={adress} className="h-7 w-7 text-[#929292]" />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'Address'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">
                {profile?.address}
              </div>
            </div>
          </div>

          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <IoDocumentTextOutline
                className="stroke-1 text-[#929292]"
                size={28}
              />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'Description'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">
                {profile?.description}
              </div>
            </div>
          </div>

          {/* <div className="col-span-1 p-4 max-sm:p-2 flex items-center">
            <div className="flex-shrink-0">
              <SlLocationPin className="text-[#929292] stroke-1" size={28} />
            </div>
            <div className="ml-4">
              <div className="text-[#929292] text-[14px] font-medium">
                Location
              </div>
              <div className="font-semibold text-[17px] max-sm:text-[15px]">
                {profile?.location}
              </div>
            </div>
            
          </div> */}

          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <IoDocumentTextOutline
                className="stroke-1 text-[#929292]"
                size={28}
              />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'Credit Score'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">
                {profile?.credit_score}
              </div>
            </div>
          </div>
          <div className="col-span-1 flex items-center p-4 max-sm:p-2">
            <div className="flex-shrink-0">
              <IoDocumentTextOutline
                className="stroke-1 text-[#929292]"
                size={28}
              />
            </div>
            <div className="ml-4">
              <div className="text-[14px] font-medium text-[#929292]">
                {'Risk Score'}
              </div>
              <div className="text-[17px] font-semibold max-sm:text-[15px]">
                {profile?.risk_score}
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <EditProfile
            closeModal={closeModal}
            profile={profile}
            setProfile={setProfile}
            editingCustomerId={
              role === Roles.Admin ||
              role === Roles.Manager ||
              role === Roles.UnderWriter
                ? customerId
                : null
            }
          />
        )}
      </div>
    </>
  );
};

export default Profile;
