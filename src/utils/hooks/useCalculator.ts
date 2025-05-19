import { useCallback, useEffect, useState } from 'react';

const useCalculator = (watchFundRequest, watchDuration) => {
  watchDuration = watchDuration == '' ? 0 : watchDuration;
  const [rePaymentAmount, setRePaymentAmount] = useState(0);
  const [weeklyInstallments, setWeeklyInstallments] = useState(0);
  const [interestPayable, setInterestPayable] = useState(0);

  const calculate = useCallback(() => {
    const merchantFactor = 1.2;
    const calculatedInterestRate = merchantFactor * 1;
    const interestRateDecimal = calculatedInterestRate / 100;

    // Calculate weekly installments
    const weeklyInstallment =
      watchDuration !== 0
        ? (watchFundRequest * (1 + interestRateDecimal)) / watchDuration
        : 0;

    // Calculate total payment
    const totalPayment = weeklyInstallment * watchDuration;

    // Calculate total interest payable
    const totalInterestPayable = totalPayment - watchFundRequest;

    // Update state
    setInterestPayable(parseFloat(totalInterestPayable.toFixed(2)));
    setRePaymentAmount(parseFloat(totalPayment.toFixed(2)));
    setWeeklyInstallments(parseFloat(weeklyInstallment.toFixed(2)));
  }, [watchFundRequest, watchDuration]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  return {
    loanAmount: watchFundRequest,
    rePaymentAmount,
    weeklyInstallments,
    interestPayable
  };
};

export default useCalculator;
