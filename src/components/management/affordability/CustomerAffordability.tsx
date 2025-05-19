import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchAffordabilityApi } from '../../../api/loanServices';
import { authSelector } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import { AffordabilityCurrentTab } from '../../../utils/helpers';
import { NotificationType } from '../../../utils/hooks/toastify/enums';
import useToast from '../../../utils/hooks/toastify/useToast';
import ProgressCircle from '../../fundingForms/StepProgressCircle';
import AffordabilityApprovalForm from './AffordabilityApprovalForm';
import AffordabilityGeneralForm from './AffordabilityGeneralForm';
import AffordabilityGrossForm from './AffordabilityGrossForm';

const CustomerAffordability = ({
  loanId,
  affordabilityActiveStage,
  setAffordabilityActiveStage,
  setRef,
  setStatueUpdate
}) => {
  const [data, setData] = useState(null);
  const { showToast } = useToast();
  const { role } = useSelector(authSelector);

  const isHigherAuthority = [Roles.Admin, Roles.Manager].includes(role);

  const fetchAffordabilityData = async () => {
    try {
      const response = await fetchAffordabilityApi(loanId);
      if (response.status_code >= 200 && response.status_code < 300) {
        setData(response?.data);
      } else {
        showToast(response.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      console.log('Exception', error);
      showToast('something wrong!', { type: NotificationType.Error });
    }
  };

  const renderAffordabilityContent = () => {
    switch (affordabilityActiveStage) {
      case 'general_form':
        return (
          <AffordabilityGeneralForm
            fetchData={fetchAffordabilityData}
            loanId={loanId}
            setAffordabilityActiveStage={setAffordabilityActiveStage}
            data={data}
            setRef={setRef}
          />
        );
      case 'gross_form':
        return (
          <AffordabilityGrossForm
            fetchData={fetchAffordabilityData}
            isHigherAuthority={isHigherAuthority}
            setAffordabilityActiveStage={setAffordabilityActiveStage}
            data={data}
            loanId={loanId}
            setRef={setRef}
          />
        );
      case 'approval_form':
      case 'affordability_completed':
        if ([Roles.UnderWriter].includes(role)) {
          return (
            <AffordabilityGrossForm
              fetchData={fetchAffordabilityData}
              isHigherAuthority={isHigherAuthority}
              setAffordabilityActiveStage={setAffordabilityActiveStage}
              data={data}
              loanId={loanId}
              setRef={setRef}
            />
          );
        }
        return (
          <AffordabilityApprovalForm
            data={data}
            loanId={loanId}
            setRef={setRef}
          />
        );
      default:
        return <h1>{'Empty!'}</h1>;
    }
  };

  const NumberOfForms = Roles.UnderWriter === role ? 2 : 3;
  useEffect(() => {
    if ([Roles.UnderWriter, Roles.Manager, Roles.Admin].includes(role)) {
      fetchAffordabilityData();
    }
  }, []);

  useEffect(() => {
    if (affordabilityActiveStage && setStatueUpdate) {
      setStatueUpdate(prevState => !prevState);
    }
  }, [affordabilityActiveStage]);

  return (
    <div>
      <span className="flex h-16 justify-end bg-white pr-16 max-sm:mt-1 max-sm:h-12">
        <ProgressCircle
          currentStep={
            AffordabilityCurrentTab(affordabilityActiveStage) == 0
              ? NumberOfForms
              : AffordabilityCurrentTab(affordabilityActiveStage)
          }
          totalSteps={NumberOfForms}
        />
      </span>
      {/* <RenderAffordabilityScreen /> */}
      {renderAffordabilityContent()}
    </div>
  );
};

export default CustomerAffordability;
