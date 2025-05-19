import React from 'react';

const ProgressCircle: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <>
      {/* <div className="relative h-12 max-lg:h-8">
        <div className=" absolute  w-10 h-10 top-3  max-lg:-top-1 rounded-full border-2 border-[#1A439A] flex items-center justify-center ">
          <span className="text-[9px] font-bold text-black" >
            {currentStep} of {totalSteps}
          </span>
        </div>
      </div> */}
      <div className="relative flex h-12 items-center justify-center max-lg:h-8 max-sm:h-6">
        <svg width="48" height="48" className="absolute top-2 max-lg:-top-1">
          <g transform="rotate(-90 24 24)">
            <circle
              r="20"
              cx="24"
              cy="24"
              fill="transparent"
              stroke="lightgrey"
              strokeWidth="2.5"
              strokeDasharray="125.6"
              strokeDashoffset="0"
            ></circle>
            <circle
              r="20"
              cx="24"
              cy="24"
              fill="transparent"
              stroke="#1A439A"
              strokeWidth="2.5"
              strokeDasharray="125.6"
              strokeDashoffset={125.6 - (currentStep / totalSteps) * 125.6}
              className="transition-all duration-300"
            ></circle>
          </g>
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            className="text-[8px] font-bold text-black"
          >
            {currentStep}
            {' of '}
            {totalSteps}
          </text>
        </svg>
      </div>
    </>
  );
};

export default ProgressCircle;
