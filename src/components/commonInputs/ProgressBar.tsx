import React, { useEffect, useState } from 'react';

import { generateEmiCalculatorData } from '../../utils/data';
import useCalculator from '../../utils/hooks/useCalculator';
interface ProgressBarProps {
  onRepaymentCalculated: (repaymentData: Record<string, number>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ onRepaymentCalculated }) => {
  const [progressBars, setProgressBars] = useState<Record<string, number[]>>({
    'Loan Amount': [0],
    'Interest Rate': [12], // Set initial value to the minimum
    'Loan Tenure': [5] // Set initial value to the minimum
  });

  const emiCalculatorData = generateEmiCalculatorData(progressBars);
  // Set min and max amounts for Interest Rate
  const minInterestRate = 10;
  const maxInterestRate = 40;

  // Set min and max amounts for Loan Tenure
  const minLoanTenure = 5;
  const maxLoanTenure = 40;

  const { rePaymentAmount, weeklyInstallments, interestPayable } =
    useCalculator(
      progressBars['Loan Amount'][0],
      progressBars['Loan Tenure'][0]
    );

  useEffect(() => {
    onRepaymentCalculated({
      WeeklyEMI: weeklyInstallments,
      PrincipalAmount: parseFloat(progressBars['Loan Amount'][0].toFixed(2)),
      TotalInterestPayable: parseFloat(interestPayable.toFixed(2)),
      TotalPayment: parseFloat(rePaymentAmount.toFixed(2))
    });
  }, [progressBars, weeklyInstallments]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = parseInt(e.target.value, 10);
    setProgressBars(prevState => ({
      ...prevState,
      [field]: [value]
    }));

    // calculateRepayment();
  };
  // useEffect(() => {
  //   calculateRepayment();
  // }, [progressBars]);

  // Function to update the color of the progress bar track
  const updateTrackColor = (progress: number, field: string) => {
    let minAmount = 0;
    let maxAmount = 0;

    if (field === 'Interest Rate') {
      minAmount = minInterestRate;
      maxAmount = maxInterestRate;
    } else if (field === 'Loan Tenure') {
      minAmount = minLoanTenure;
      maxAmount = maxLoanTenure;
    } else {
      minAmount = 0;
      maxAmount = 50000;
    }

    const percentage = ((progress - minAmount) / (maxAmount - minAmount)) * 100;
    const trackColor = `linear-gradient(90deg, #1B4398 ${percentage}%, #ccc ${percentage}%)`;
    return trackColor;
  };

  return (
    <>
      {emiCalculatorData.map((item, index) => (
        <div key={index} className="grid gap-x-12 text-[#000000]">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <span className="text-[16px]">{item.label}</span>
            </div>
            <div className="text-right">
              <span className="inline-block w-[150px] bg-[#EBEBEB] px-2 py-1 text-[16px] font-semibold uppercase">
                {item.name}
              </span>
            </div>
          </div>
          <div className="w-[100%]">
            <input
              type="range"
              id={`progress-${index}`}
              name={`progress-${index}`}
              className="mt-1 h-1 w-full appearance-none rounded-lg accent-[#1B4398] hover:accent-[#274c95]"
              min={
                item.label === 'Interest Rate'
                  ? minInterestRate
                  : item.label === 'Loan Tenure'
                    ? minLoanTenure
                    : 0
              }
              max={
                item.label === 'Interest Rate'
                  ? maxInterestRate
                  : item.label === 'Loan Tenure'
                    ? maxLoanTenure
                    : 50000
              }
              value={progressBars[item.label][0]}
              onChange={e => handleChange(e, item.label)}
              style={{
                background: updateTrackColor(
                  progressBars[item.label][0],
                  item.label
                )
              }}
            />
          </div>

          <div className="mb-1 flex items-center justify-between">
            <div className="relative h-4 w-[20%] overflow-hidden rounded-full">
              <div className="absolute h-full w-full bg-white"></div>
              <div
                className="absolute h-full bg-white"
                style={{
                  width: `${
                    ((progressBars[item.label][0] -
                      (item.label === 'Loan Tenure'
                        ? minLoanTenure
                        : minInterestRate)) /
                      ((item.label === 'Loan Tenure'
                        ? maxLoanTenure
                        : maxInterestRate) -
                        (item.label === 'Loan Tenure'
                          ? minLoanTenure
                          : minInterestRate))) *
                    100
                  }%`
                }}
              ></div>
              <div className="absolute left-0 top-0 flex h-full w-full pl-1 text-[14px] font-medium text-[#929292]">
                {item.data}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-1 text-[13px] font-medium uppercase text-[#929292]">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProgressBar;
