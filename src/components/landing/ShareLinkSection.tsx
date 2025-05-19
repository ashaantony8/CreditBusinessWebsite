import { FiChevronRight } from 'react-icons/fi';

import shareLanding from '../../assets/images/shareLanding.png';

const ShareLinkSection = () => {
  return (
    <div className="">
      <div className="container mx-auto mt-12 lg:px-12">
        {' '}
        <div className="my-4 flex w-auto flex-wrap items-center bg-[#FFFFFF] p-4 shadow-md">
          <div className="mr-1 pr-2">
            <img src={shareLanding} className="w-24" />
          </div>
          <div className="flex-1">
            <div className="text-[18px] font-semibold text-[#02002E]">
              {'Share referral link'}
            </div>

            <div className="text-[12px] font-medium text-[#929292]">
              {'Get 40 Credit for each'}
              <div className="">{'referral with Credit4business'}</div>
            </div>
          </div>
          <div>
            <span className="mb-6 inline-flex rounded-full px-3 text-xs leading-5 max-sm:mb-2 max-sm:px-2">
              <FiChevronRight size={32} color="#1A439A" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkSection;
