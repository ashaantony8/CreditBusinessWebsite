import { GoChevronDown } from 'react-icons/go';
// import SearchBar from "../management/common/SearchBar";

const MasterHeader = ({ openModal, title }) => {
  return (
    <div className="flex items-center border-b bg-white px-4 py-4">
      <div className="flex items-center gap-2">
        <a className="flex items-center gap-2 text-[20px] font-semibold">
          {title} <GoChevronDown className="mt-1" color="#1A439A" />
        </a>
        {/* <div className="ml-4">
        <SearchBar onSearch={()=>{}} placeholder={""}/>
      </div> */}
      </div>
      <button
        className="ml-auto block px-0 py-3 text-[16px] font-semibold text-[#1A439A] md:p-4"
        onClick={openModal}
      >
        {'ADD NEW'}
      </button>
    </div>
  );
};

export default MasterHeader;
