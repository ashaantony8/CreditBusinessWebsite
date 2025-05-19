import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ProfileSchema } from '../../utils/Schema';
import Security from './tabContents/Security';
import { userProfileApi } from '../../api/userServices';
import Notification from '../../components/management/notification/Notification';
import { authSelector } from '../../store/auth/userSlice';
import { NotificationType } from '../../utils/hooks/toastify/enums';
import useToast from '../../utils/hooks/toastify/useToast';
import { LoanData, UserProfile } from '../../utils/types';
import {
  ApprovalType,
  FundingFromCurrentStatus,
  Roles
} from '../../utils/enums';
import ProfileDetails from './tabContents/ProfileDetails';
import Referalform from './Referalform';
// import RequestPending from "./tabContents/RequestPending";
import FundingCard from './tabContents/FundingCards';
import UnitCard from './tabContents/UnitCards';
import DetailsPageLayout from '../customerLayout/DetailPageLayout';
import PhotoId from './tabContents/PhotoId';
import AddressProof from './tabContents/AddressProof';
import OtherDocuments from './tabContents/OtherDocuments';
import BankStatement from './tabContents/BankStatement';
import UnitProfile from '../../components/management/unit/UnitProfile';
import LoanDetails from '../../components/customerDocuments/LoanDetails';
import PaymentDetails from './tabContents/PaymentDetails';
import FundingGoCardless from '../../components/management/funding/GoCardless';
import FundingOffers from './tabContents/FundingOffers';
import CustomerIdentityVerification from '../../components/management/customer/IdentityVerification';
import { getFundingTabs, roleTabs, unitTabs } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import ApprovalList from '../../components/management/adminApproval/ApprovalList';
import UnitBusinessPartnerCustomerView from '../../components/management/unit/UnitBusinessPartnerCustomerView';

const CustomerProfile: React.FC = () => {
  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      councilTax: '',
      drivingLicence: '',
      utilityBill: ''
    }
  });

  const [referForm, setReferForm] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [menuHistory, setMenuHistory] = useState<
    { profileDetails?: undefined[]; nestedArray?: undefined }[]
  >([{ profileDetails: [] }]);

  const closeReferForm = () => {
    setReferForm(false);
  };

  const { role } = useSelector(authSelector);
  const { showToast } = useToast();

  const fetchProfile = async () => {
    try {
      const fetchProfileResponse = await userProfileApi();
      if (fetchProfileResponse?.status_code == 200) {
        setProfile(fetchProfileResponse.data);
      } else {
        showToast(fetchProfileResponse.status_message, {
          type: NotificationType.Error
        });
      }
    } catch (error) {
      showToast('Something went wrong!', { type: NotificationType.Error });
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const tabs = {
    default: roleTabs[role] || [],
    unitProfile: unitTabs,
    photoId: unitTabs,
    customerLinked: unitTabs,
    addressProof: unitTabs,
    otherFiles: unitTabs,
    bankStatement: unitTabs,
    unitFunding: unitTabs,
    unitRequestPending: unitTabs,
    fundingUnitProfile: getFundingTabs(),
    fundingDetails: getFundingTabs(),
    ...(Roles.Customer === role && {
      contract: getFundingTabs()
    }),
    goCardLess: getFundingTabs(),
    fundingOffer: getFundingTabs()
  };

  const [menu, setMenu] = useState(tabs['default']);
  const [selectedMenu, setSelectedMenu] = useState('profileDetails');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedFundingId, setSelectedFundingId] = useState(null);
  const [funding, setFunding] = useState<Partial<LoanData>>({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderTabContent = () => {
    switch (selectedMenu) {
      case 'profileDetails':
        return <ProfileDetails />;
      case 'funding':
      case 'unitFunding':
        return (
          <FundingCard
            unitId={selectedCompanyId}
            customerId={profile.id}
            setSelectedFundingId={setSelectedFundingId}
            setSelectedCompanyId={setSelectedCompanyId}
            setSelectedMenu={setSelectedMenu}
            setMenuHistory={setMenuHistory}
          />
        );
      case 'fundingDetails':
        return (
          <LoanDetails fundingId={selectedFundingId} setFunding={setFunding} />
        );
      case 'units':
        return (
          <UnitCard
            customerId={profile.id}
            setSelectedCompanyId={setSelectedCompanyId}
            setSelectedMenu={setSelectedMenu}
            setMenuHistory={setMenuHistory}
          />
        );
      case 'unitProfile':
      case 'fundingUnitProfile':
        return <UnitProfile unitId={selectedCompanyId} />;
      case 'notification':
        return <Notification whichUser={Roles.Customer} />;
      case 'security':
        return <Security />;
      case 'requestPending':
        return (
          <ApprovalList
            type={ApprovalType.CustomerProfile}
            userId={profile.id}
            whichUser={Roles.Customer}
          />
        );
      case 'unitRequestPending':
        return (
          <ApprovalList
            type={ApprovalType.UnitProfile}
            whichUser={Roles.Customer}
            unitId={selectedCompanyId}
            isUnit={true}
          />
        );
      case 'photoId':
        return <PhotoId unitId={selectedCompanyId} />;
      case 'addressProof':
        return <AddressProof unitId={selectedCompanyId} />;
      case 'otherFiles':
        return <OtherDocuments unitId={selectedCompanyId} />;
      case 'bankStatement':
        return <BankStatement unitId={selectedCompanyId} />;
      case 'customerLinked':
        return <UnitBusinessPartnerCustomerView unitId={selectedCompanyId} />;
      case 'contract':
        return <PaymentDetails loanId={selectedFundingId} />;
      case 'goCardLess':
        return (
          <FundingGoCardless
            fundingId={selectedFundingId}
            fundingStatus={
              funding?.loan_status?.current_status as FundingFromCurrentStatus
            }
          />
        );
      case 'fundingOffer':
        return <FundingOffers loanId={selectedFundingId} />;
      case 'identityVerification':
        return <CustomerIdentityVerification leadId={profile.id} />;
      default:
        return <h1>Empty!</h1>;
    }
  };

  useEffect(() => {
    if (
      funding?.loan_status?.current_status &&
      ![FundingFromCurrentStatus.AdminCashDisbursed].includes(
        funding?.loan_status?.current_status as FundingFromCurrentStatus
      )
    ) {
      // hiding contract from non loan holders
      const updatedData = tabs[selectedMenu]?.filter(
        item => item.name !== 'contract'
      );
      setMenu(updatedData || tabs[selectedMenu] || tabs['default']);
    } else {
      setMenu(tabs[selectedMenu] || tabs['default']);
    }
  }, [selectedMenu, funding]);

  // const handleMenuChange = (menuName: string) => {
  //   if (menuName !== selectedMenu) {
  //     setMenuHistory((prev) => [...prev, selectedMenu]); // Store current tab in history
  //     setSelectedMenu(menuName); // Switch to new tab
  //   }
  // };

  // const handleMenuChange = (menuName: string) => {
  //   setMenuHistory((prev) => {
  //     // Create a new array based on the previous state
  //     const updatedHistory = [...prev];

  //     // Replace the second object with the new item
  //     updatedHistory[1] = { [menuName]: [] };

  //     // If the second object doesn't exist (i.e., prev has fewer than 2 items),
  //     // we push the new item at the second position
  //     if (updatedHistory.length < 2) {
  //       updatedHistory.push({ [menuName]: [] });
  //     }

  //     return updatedHistory;
  //   });

  //   console.log("menuHistory", menuHistory);
  //   setSelectedMenu(menuName);
  // };

  const navigate = useNavigate();

  console.log('menuHistory', menuHistory);
  const handleMenuChange = (menuName: string) => {
    // Dynamically handle empty menu data
    const currentMenuData = menuHistory[menuHistory.length - 1]?.[menuName];
    if (Array.isArray(currentMenuData) && currentMenuData.length === 0) {
      console.log(`"${menuName}" has no data. Redirecting to home.`);
      navigate('/'); // Redirect to home if the array is empty
      return;
    }

    // Update menu history and selected menu
    setMenuHistory(prev => [...prev, { [menuName]: currentMenuData || [] }]);
    setSelectedMenu(menuName);
  };

  const [isBackClicked, setIsBackClicked] = useState(false);

  const profileBackHandler = () => {
    // Mark the back click event
    setIsBackClicked(true);

    // Filter out keys with empty arrays
    const validMenus = menuHistory.filter(menu =>
      Object.keys(menu).some(key => menu[key]?.length)
    );

    if (validMenus.length) {
      const lastMenu = validMenus[validMenus.length - 1];
      const lastMenuKey = Object.keys(lastMenu)[0];
      setSelectedMenu(lastMenuKey);
      setMenuHistory(validMenus);
    } else {
      // No valid menus, reset and navigate to profile
      setMenuHistory([]);
      setSelectedMenu('profileDetails'); // Default menu
      navigate('/profile');
    }

    // After the "back" click, delete the array details
    if (isBackClicked) {
      // Reset menu history (empty it) after navigating back
      setMenuHistory([]);
    }
  };

  const toggleReferForm = () => {
    setReferForm(!referForm);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <DetailsPageLayout
      {...(selectedMenu !== 'profileDetails' &&
        selectedMenu !== 'funding' &&
        selectedMenu !== 'units' &&
        selectedMenu !== 'identityVerification' &&
        selectedMenu !== 'notification' &&
        selectedMenu !== 'security' &&
        selectedMenu !== 'requestPending' && {
          backHandler: profileBackHandler
        })}
      menus={menu}
      setSelectedMenu={handleMenuChange}
      selectedMenu={selectedMenu}
      toggleReferForm={toggleReferForm}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
    >
      <div className="h-full overflow-y-auto bg-white">
        <FormProvider {...methods}>
          {referForm && <Referalform closeModal={closeReferForm} />}
          {/* <div className="flex justify-center flex-col  px-4"> */}
          {renderTabContent()}
          {/* </div> */}
        </FormProvider>
      </div>
    </DetailsPageLayout>
  );
};

export default CustomerProfile;
