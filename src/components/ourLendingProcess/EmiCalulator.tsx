import { useState } from 'react';

import { emiData } from '../../utils/data'; // Import emiData from the separate file
import ProgressBar from '../commonInputs/ProgressBar';

const EmiCalculator = () => {
  const [repaymentData, setRepaymentData] = useState<Record<
    string,
    number
  > | null>(null);

  const handleRepaymentData = (data: Record<string, number>) => {
    // Set the received data in state
    setRepaymentData(data);
  };

  return (
    <>
      <div className="bg-white">
        <div className="grid gap-x-12 md:grid-cols-2 lg:grid-cols-2 lg:items-center">
          <div
            aria-hidden="true"
            className="bg-white pl-12 max-sm:pl-2 max-sm:pr-2"
          >
            <p className="my-2 text-start text-[22px] font-semibold text-[#02002E] lg:text-[34px]">
              {'EMI Calculator'}
            </p>
            <ProgressBar onRepaymentCalculated={handleRepaymentData} />
          </div>
          <div className="max-sm:t-1 border-[#e6e6e6] font-medium max-sm:border-t md:border-l lg:border-l">
            {emiData.map((item, index) => {
              // Transform the heading to match the keys in repaymentData
              const key = item.heading.replace(/\s+/g, ''); // Remove spaces from heading
              const value = repaymentData ? repaymentData[key] : null; // Get value from repaymentData
              return (
                <div key={index}>
                  <div
                    className={`py-4 text-[12px] lg:text-[16px] ${item.backgroundColor} ${item.headColor} `}
                  >
                    {item.heading} <br />{' '}
                    <a className={`${item.rscolor} `}>{item.rs}</a>
                    <a className={`${item.textColor} text-[30.1px]`}>
                      {' '}
                      {value !== null ? value.toLocaleString() : item.label}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
export default EmiCalculator;
