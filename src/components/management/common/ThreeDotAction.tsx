import { MdOutlineEdit } from 'react-icons/md';

import Cancel from '../../../assets/svg/cancel.svg';
import Delete from '../../../assets/svg/Delete.svg';
import Eye from '../../../assets/svg/eye_gray.svg';
import Assist from '../../../assets/svg/Group.svg';
import kpi from '../../../assets/svg/kpi.svg';
import Renew from '../../../assets/svg/renew.png';
import Unlink from '../../../assets/svg/Unlink.png';
import { ThreeDotActionModalInterface } from '../../../utils/types';

const ThreeDotAction: React.FC<ThreeDotActionModalInterface> = ({
  setIsAction,
  setIsModalOpen,
  setIsDeleteModalOpen,
  setIsAssignAgentModalOpen,
  setIsKPIModalOpen,
  setCancel,
  setRenew,
  setIsEditModalOpen,
  setIsUnlinkModalOpen
}) => {
  const actions = [
    {
      condition: setIsModalOpen,
      onClick: () => {
        setIsModalOpen(true);
        setIsAction(false);
      },
      imgSrc: Eye,
      altText: 'View',
      text: 'View'
    },
    {
      condition: setIsAssignAgentModalOpen,
      onClick: () => {
        setIsAssignAgentModalOpen(true);
        setIsAction(false);
      },
      imgSrc: Assist,
      altText: 'Assist',
      text: 'Assist'
    },
    {
      condition: setIsKPIModalOpen,
      onClick: () => {
        setIsKPIModalOpen(true);
        setIsAction(false);
      },
      imgSrc: kpi,
      altText: 'Add KPI',
      text: 'Add KPI'
    },
    {
      condition: setIsDeleteModalOpen,
      onClick: () => {
        setIsDeleteModalOpen(true);
        setIsAction(false);
      },
      imgSrc: Delete,
      altText: 'Delete',
      text: 'Delete'
    },
    {
      condition: setIsUnlinkModalOpen,
      onClick: () => {
        setIsUnlinkModalOpen(true);
        setIsAction(false);
      },
      imgSrc: Unlink,
      altText: 'Unlink',
      text: 'Unlink'
    },
    {
      condition: setRenew,
      onClick: () => {
        setRenew(true);
        setIsAction(false);
      },
      imgSrc: Renew,
      altText: 'Renew',
      text: 'Renew'
    },
    {
      condition: setCancel,
      onClick: () => {
        setCancel(true);
        setIsAction(false);
      },
      imgSrc: Cancel,
      altText: 'Cancel',
      text: 'Cancel'
    },
    {
      condition: setIsEditModalOpen,
      onClick: () => {
        setIsEditModalOpen(true);
        setIsAction(false);
      },
      icon: <MdOutlineEdit />,
      altText: 'Edit',
      text: 'Edit'
    }
  ];

  return (
    <div className="relative mx-auto w-[155px] rounded-md bg-white p-4 shadow-xl">
      <div className="space-y-4">
        {actions.map(
          (action, index) =>
            action.condition && (
              <div
                key={index}
                className="flex cursor-pointer items-center space-x-2 rounded-md transition-colors hover:bg-gray-100"
                onClick={action.onClick}
              >
                {action.imgSrc && (
                  <img
                    src={action.imgSrc}
                    alt={action.altText}
                    className="h-6 w-6"
                  />
                )}
                {action.icon && action.icon}
                <div className="text-gray-700">{action.text}</div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default ThreeDotAction;
