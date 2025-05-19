import { useState } from 'react';

import proof from '../../../assets/images/proof.png';
import eye from '../../../assets/svg/eye.svg';
import trash from '../../../assets/svg/trash.svg';
const AddressProofCutomer = () => {
  const [isSelected] = useState(false);

  return (
    <>
      <div className="mb-8 h-96 w-full rounded-lg bg-white sm:p-8 lg:px-6 xl:px-8">
        <p className="my-4 text-[16px] font-medium">{'File name '}</p>
        <div
          className={`border shadow ${
            isSelected ? 'border-[#1A439A]' : 'border-[#C5C5C5]'
          }`}
        >
          <div className="flex justify-around">
            <div className="w-[20%] border-r border-[#C5C5C5] p-2 text-center">
              <div className="flex h-full items-center justify-center">
                <img src={proof} alt="File name " />
              </div>
            </div>
            <div className="w-[40%] p-4">
              <div>
                <p className="text-[12px] font-light text-[#646464]">
                  {'File name'}
                </p>
                <p className="text-[12px] font-light text-[#646464]">
                  {'Size : '}
                  <a className="font-medium text-black">{' : 785 kb'}</a>
                </p>
              </div>
            </div>
            <div className="flex items-center bg-white p-4">
              <div className="flex max-sm:grid">
                <p
                  className="flex pr-4 text-[12px] font-medium text-[#1A439A]"
                  // onClick={() => handleViewLinkClick()}
                >
                  <img src={eye} className="px-2" /> {'VIEW'}
                </p>
                <p className="flex pr-2 text-[12px] font-medium text-[#840000]">
                  <img src={trash} className="px-2" /> {'DELETE'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressProofCutomer;
