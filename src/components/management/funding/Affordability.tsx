import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { managementSliceSelector } from '../../../store/managementReducer';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import AffordabilityHeader from './AffordabilityHeader';

export const badgeClassesHead = [
  {
    name: 'false'
  },
  {
    name: 'true'
  }
];

const Affordability = () => {
  const { loan } = useSelector(managementSliceSelector);
  const [loanId, setLoanId] = useState<string>(null);

  useEffect(() => {
    if (loan?.id) setLoanId(loan?.id);
  }, [loan]);

  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useToast();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  useEffect(() => {}, [loanId]);
  return (
    <>
      <form ref={formRef} className="mt-2 px-4" onSubmit={handleSubmit}>
        {/* {isLoading && (
          <div
            aria-hidden="true"
            className="fixed inset-0 overflow-x-hidden overflow-y-auto z-50 flex justify-center items-center bg-black bg-opacity-50"
          >
            <Loader />
          </div>
        )} */}
        <AffordabilityHeader />

        <div></div>
      </form>
    </>
  );
};

export default Affordability;
