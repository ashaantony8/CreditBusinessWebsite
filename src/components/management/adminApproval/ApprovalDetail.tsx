import { BiArrowBack } from 'react-icons/bi';

// import DocumentEditApproval from "./DocumentEditApproval";
import { ApprovalType } from '../../../utils/enums';
import { UserProfile } from '../../../utils/types';
import DocumentEditApproval from './DocumentEditApproval';
import PhotoEditApproval from './PhotoEditApproval';
import UnitProfileEditApproval from './UnitProfileEditApproval';
import UserProfileEditApproval from './UserProfileEditApproval';

const ApprovalDetail = ({ selectedType, selectedApproval, setIsModalOpen }) => {
  const renderContent = () => {
    switch (selectedType) {
      case ApprovalType.CustomerProfile:
        return (
          <UserProfileEditApproval
            profile={selectedApproval as Partial<UserProfile>}
          />
        );
      case ApprovalType.UnitProfile:
        return (
          <UnitProfileEditApproval
            profile={selectedApproval}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case ApprovalType.AddressProof:
        return (
          <DocumentEditApproval
            profile={selectedApproval}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case ApprovalType.PhotoId:
        return (
          <PhotoEditApproval
            profile={selectedApproval}
            setIsModalOpen={setIsModalOpen}
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <div
          onClick={() => setIsModalOpen(false)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
        >
          <BiArrowBack className="text-lg" />
        </div>
        {renderContent()}
      </div>
    </>
  );
};

export default ApprovalDetail;
