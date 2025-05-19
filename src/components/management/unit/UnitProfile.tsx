import { useEffect, useState } from 'react';
// import { CiMail, CiMobile3 } from "react-icons/ci";
// import { IoDocumentTextOutline } from "react-icons/io5";
import { MdModeEdit } from 'react-icons/md';
import { useSelector } from 'react-redux';

import { companyDetailsApi } from '../../../api/loanServices';
import EditUnitProfile from '../../../pages/profile/tabContents/EditUnitProfile';
import { managementSliceSelector } from '../../../store/managementReducer';
// import adress from "../../../assets/svg/address.svg";
// import identity from "../../../assets/svg/identity.svg";
// import userIcon from "../../../assets/svg/user.svg";
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import { UnitProfileDetails } from '../../../utils/types';
import Header from '../common/Header';

const ProfileField: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: string | undefined;
}> = ({ icon, label, value }) => (
  <div className="col-span-1 flex items-center p-4 max-sm:p-2">
    {icon && <div className="flex-shrink-0">{icon}</div>}
    <div className="ml-4">
      <div className="text-[14px] font-medium text-[#929292]">{label}</div>
      <div className="text-[17px] font-semibold max-sm:text-[15px]">
        {value}
      </div>
    </div>
  </div>
);

const UnitProfile: React.FC<{ unitId?: string }> = ({ unitId }) => {
  const [profile, setProfile] = useState<Partial<UnitProfileDetails>>({});
  const { unit } = useSelector(managementSliceSelector);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const companyId = unit.id || unitId;
  const { showToast } = useToast();

  const fetchProfile = async companyId => {
    try {
      const response = await companyDetailsApi(companyId);
      if (response?.status_code === 200) {
        setProfile(response.data);
      } else {
        showToast(response.status_message, { type: NotificationType.Error });
      }
    } catch (error) {
      showToast('Something went wrong!', { type: NotificationType.Error });
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (companyId) fetchProfile(companyId);
  }, [companyId]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  // console.log(profile,'profileee');

  return (
    <>
      <Header title="Unit Profile" />

      <div className="flex h-[75%] flex-col justify-end overflow-y-auto max-sm:h-[64vh] max-sm:p-4 sm:flex-row-reverse">
        <div className="items-center justify-end text-[#818181]">
          {companyId && (
            <button
              onClick={toggleModal}
              className="flex items-center justify-end rounded-lg bg-transparent px-5 text-sm font-medium text-gray-400"
            >
              <MdModeEdit className="mx-2" />
              {'EDIT'}
            </button>
          )}
        </div>

        <div className="grid w-full grid-cols-1 gap-4 max-sm:gap-1 sm:grid-cols-2">
          <ProfileField
            // icon={<img src={userIcon} className="w-7 h-7" />}
            label="Name"
            value={profile?.company_name || 'N/A'}
          />
          <ProfileField
            // icon={<img src={identity} className="w-7 h-7" />}
            label="ID"
            value={profile?.company_id ? `${profile?.company_id}` : 'N/A'}
          />
          <ProfileField
            // icon={<CiMail className="text-[#929292] stroke-1" size={28} />}
            label="Business Type"
            value={profile?.business_type || 'N/A'}
          />
          <ProfileField
            // icon={<CiMobile3 className="text-[#929292] stroke-1" size={28} />}
            label="Phone Number"
            value={
              profile?.phone_number ? `+44 ${profile?.phone_number}` : 'N/A'
            }
          />
          {/* <ProfileField
            // icon={<img src={adress} className="w-7 h-7" />}
            label="Customer"
            value={profile?.customer}
          /> */}
          <ProfileField
            // icon={<IoDocumentTextOutline className="text-[#929292] stroke-1" size={28} />}
            label="Company Status"
            value={profile?.company_status || 'N/A'}
          />
          <ProfileField
            label="Funding Purpose"
            value={profile?.funding_purpose || 'N/A'}
          />
          <ProfileField
            // icon={<IoDocumentTextOutline className="text-[#929292] stroke-1" size={28} />}
            label="Trading Style"
            value={profile?.trading_style || 'N/A'}
          />
          <ProfileField
            // icon={<IoDocumentTextOutline className="text-[#929292] stroke-1" size={28} />}
            label="Company Number"
            value={profile?.company_number || 'N/A'}
          />
          <ProfileField
            label="Other Funding Purpose"
            value={profile?.other_funding_purpose || 'N/A'}
          />
        </div>
        {isModalOpen && (
          <EditUnitProfile
            closeModal={closeModal}
            profile={profile}
            unitId={companyId}
          />
        )}
      </div>
    </>
  );
};

export default UnitProfile;
