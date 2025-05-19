import { useEffect, useState } from 'react';
// import { GrLocation } from "react-icons/gr";
// import { authSelector } from "../../../store/auth/userSlice";
// import { useSelector } from "react-redux";
import { MdCameraAlt, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

// import { GrLocation } from "react-icons/gr";
import {
  profilePictureUploadApi,
  userProfileApi
} from '../../../api/userServices';
import userIcon from '../../../assets/svg/user.png';
import { authSelector, setUser } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { MAX_FILE_SIZE_2_MB } from '../../../utils/Schema';
import { UserProfile } from '../../../utils/types';
import EditProfile from '../EditProfile';

const ProfileDetails = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const { showToast } = useToast();
  const { role } = useSelector(authSelector);
  const dispatch = useDispatch();

  // const user = useSelector(authSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  // const customerId = profile.id;
  const fetchProfile = async () => {
    try {
      const fetchProfileResponse = await userProfileApi();
      if (fetchProfileResponse?.status_code == 200) {
        setProfile(fetchProfileResponse.data);
        dispatch(setUser(fetchProfileResponse.data));
      } else {
        showToast(fetchProfileResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (![Roles.Leads, Roles.Customer].includes(profile.role as Roles)) {
      dispatch(setUser(profile));
    }
  }, [profile]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // profile picture code
  const handleFileChange = async event => {
    const file = event.target.files[0];

    if (file && file.size > MAX_FILE_SIZE_2_MB) {
      showToast('File size must be less than 2 MB.', {
        type: NotificationType.Error
      });
      event.target.value = ''; // Clear the input
      return;
    }

    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await profilePictureUploadApi(formData);
      if (response.status_code === 200) {
        setIsFileUploaded(prevState => !prevState);
        showToast('profile picture uploaded successfully.', {
          type: NotificationType.Success
        });
      } else {
        showToast('something wrong!', { type: NotificationType.Error });
      }
    } catch {
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isFileUploaded]);

  return (
    <div className="flex flex-col overflow-y-scroll pr-8">
      <div className="bg-white">
        {(isLaptop || isTablet) && (
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={profile?.image || userIcon}
                    alt="Avatar"
                  />
                  <div className="absolute right-0 top-5">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer rounded-full bg-opacity-75 p-1 text-gray-400"
                    >
                      <MdCameraAlt className="h-5 w-5" />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-bold text-gray-800">{`${profile?.first_name} ${profile?.last_name}`}</h2>
                  {[Roles.Customer, Roles.Leads].includes(role) && (
                    <p className="text-[12px]">
                      {'customer id: '}
                      {profile?.customer_id}
                    </p>
                  )}
                  {[Roles.FieldAgent].includes(role) && (
                    <p className="text-[12px]">
                      {'Representative id: '}
                      {profile?.agent_id}
                    </p>
                  )}
                  <p className="text-gray-600">{profile.description}</p>
                </div>
              </div>
              <div className="content-baseline items-center justify-start text-[#818181]">
                {/* {!customerId && ( */}
                <button
                  onClick={toggleModal}
                  className="flex items-center justify-start rounded-lg bg-transparent px-5 text-center text-[14px] text-sm font-medium text-gray-400"
                  type="button"
                >
                  <MdModeEdit className="mx-2" />
                  {'EDIT'}
                </button>
                {/* )} */}
              </div>
            </div>
          </div>
        )}

        {isMobile && (
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={profile?.image || userIcon}
                    alt="Avatar"
                  />
                  <div className="absolute right-0 top-5">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer rounded-full bg-opacity-75 p-1 text-gray-400"
                    >
                      <MdCameraAlt className="h-5 w-5" />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-[10px] font-bold text-gray-800">{`${profile?.first_name} ${profile?.last_name}`}</h2>
                  {[Roles.Customer, Roles.Leads].includes(role) && (
                    <p className="text-[8px]">
                      {'customer id: '}
                      {profile?.customer_id}
                    </p>
                  )}
                  {[Roles.FieldAgent].includes(role) && (
                    <p className="text-[12px]">
                      {'Representative id: '}
                      {profile?.agent_id}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-600">
                    {profile.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex content-baseline items-center justify-end text-[#818181]">
              {/* {!customerId && ( */}
              <button
                onClick={toggleModal}
                className="flex items-center justify-start rounded-lg bg-transparent px-5 text-center text-[10px] font-medium text-gray-400"
                type="button"
              >
                <MdModeEdit className="mx-2" />
                {'EDIT'}
              </button>
              {/* )} */}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {/* Row 1 */}
            <div className="py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-3">
              <div className="sm:col-span-1">
                <dt className="text-sm font-light text-gray-500">
                  {'First Name'}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 max-lg:text-[11px] sm:mt-0">
                  {profile?.first_name || 'N/A'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-light text-gray-500">
                  {'Last Name'}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 max-lg:text-[11px] sm:mt-0">
                  {profile?.last_name || 'N/A'}
                </dd>
              </div>
            </div>
            {/* Row 2 */}
            <div className="py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-5">
              <div className="sm:col-span-1">
                <dt className="text-sm font-light text-gray-500">
                  {'Email Address'}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 max-lg:text-[11px] sm:mt-0">
                  {profile?.email || 'N/A'}
                </dd>
              </div>
            </div>
            {/* Row 3 */}
            <div className="py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-5">
              <div className="sm:col-span-1">
                <dt className="text-sm font-light text-gray-500">
                  {'Phone Number'}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 max-lg:text-[11px] sm:mt-0">
                  {profile?.phone_number
                    ? `+44 ${profile?.phone_number}`
                    : 'N/A'}
                </dd>
              </div>
            </div>
            {/* Row 4 */}
            <div className="py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-5">
              <div className="sm:col-span-1">
                <dt className="text-sm font-light text-gray-500">
                  {'Address'}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 max-lg:text-[11px] sm:mt-0">
                  {profile?.address || 'N/A'}
                </dd>
              </div>
            </div>
            {/* Row 5 */}
            <div className="py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-5">
              <div className="sm:col-span-1">
                <dt className="text-sm font-light text-gray-500">
                  {'Description'}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 max-lg:text-[11px] sm:mt-0">
                  {profile?.description || 'N/A'}
                </dd>
              </div>
            </div>
            {/* Row 6 */}
            <div className="py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 sm:py-5">
              <div className="sm:col-span-1">
                <dt className="text-sm font-light text-gray-500">
                  {'Date of birth'}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 max-lg:text-[11px] sm:mt-0">
                  {profile?.date_of_birth || 'N/A'}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {isModalOpen && (
        <EditProfile
          closeModal={closeModal}
          profile={profile}
          setProfile={setProfile}
          editingCustomerId={
            role === Roles.Customer || role === Roles.Leads ? profile.id : null
          }
        />
      )}
    </div>
  );
};

export default ProfileDetails;
