import { useEffect } from 'react';

import Footer from '../components/layout/Footer';
import Header from '../components/layout/Mainheader';
import CreditDisbursement from '../components/ourLendingProcess/CreditDisbursement';
import CreditEvaluation from '../components/ourLendingProcess/CreditEvaluation';
import CreditMonitoring from '../components/ourLendingProcess/CreditMonitoring';
import LoanApplication from '../components/ourLendingProcess/LoanApplication';
import LoanRepayments from '../components/ourLendingProcess/LoanRepayments';
import OurLendingProcessBanner from '../components/ourLendingProcess/OurLendingProcessBanner';

const OurLendingProcessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Header />
      <OurLendingProcessBanner />
      <LoanApplication />
      <CreditEvaluation />
      <CreditDisbursement />
      <LoanRepayments />
      <CreditMonitoring />
      <Footer />
    </>
  );
};

export default OurLendingProcessPage;
