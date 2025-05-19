// import ChangePasswordPage from "../pages/ChangePasswordPage";
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import GocardlessSuccessWindow from '../components/management/common/GocardlessSuccessWindow';
import InstantPayFailed from '../components/management/common/InstantPayFailed';
import InstantPayPending from '../components/management/common/InstantPayPending';
import CreditDefaultDetailPage from '../components/management/creditMonitoring/CreditDefaultDetailPage';
import CreditMonitoring from '../components/management/creditMonitoring/CreditMonitoring';
import CustomerIdentityVerification from '../components/management/customer/IdentityVerification';
import CustomerNotifications from '../components/management/customer/Notifications';
import CustomerProfile from '../components/management/customer/Profile';
import BusinessPartner from '../components/management/financeManager/BusinessPartner';
import BusinessPartnerGroup from '../components/management/financeManager/BusinessPartnerGroup';
// import Customers from "../components/management/Customers";
import { AddEntry } from '../components/management/financeManager/entry/AddEntry';
import StatementBalanceSheet from '../components/management/financeManager/statement/BalanceSheet';
import StatementBpTrialBalance from '../components/management/financeManager/statement/BusinessPartnerTrialBalance';
import EntryList from '../components/management/financeManager/statement/Ledger';
import StatementPl from '../components/management/financeManager/statement/ProfitAndLossAccount';
import StatementTrialBalance from '../components/management/financeManager/statement/TrialBalance';
import Affordability from '../components/management/funding/Affordability';
import FundingApplicationStatus from '../components/management/funding/ApplicationStatus';
import FundingContract from '../components/management/funding/Contract';
import ManagementFundingApplication from '../components/management/funding/FundingApplication';
import Fundings from '../components/management/funding/Fundings';
import FundingGoCardless from '../components/management/funding/GoCardless';
import FundingIdentityVerification from '../components/management/funding/IdentityVerification';
import SubscriptionCreateView from '../components/management/mandate/SubscriptionCreateView';
import ReportAgent from '../components/management/reports/ReportAgent';
import ReportAgentPerformance from '../components/management/reports/ReportAgentPerformance';
import ReportContractExpired from '../components/management/reports/ReportContractExpired';
import ReportContractExpiring from '../components/management/reports/ReportContractExpiring';
import ReportCustomer from '../components/management/reports/ReportCustomer';
import ReportDefault from '../components/management/reports/ReportDefault';
import ReportDefaultUser from '../components/management/reports/ReportDefaultUser';
import ReportFunding from '../components/management/reports/ReportFunding';
import ReportGoodStanding from '../components/management/reports/ReportGoodStanding';
import ReportOutstanding from '../components/management/reports/ReportOutstanding';
import ReportPayment from '../components/management/reports/ReportPayment';
import ReportPendingDue from '../components/management/reports/ReportPendingDue';
import ReportReferral from '../components/management/reports/ReportReferral';
import ReportSnapshot from '../components/management/reports/ReportSnapshot';
import ReportSummary from '../components/management/reports/ReportSummary';
import Documents from '../components/management/unit/Documents';
import UnitBusinessPartner from '../components/management/unit/UnitBusinessPartner';
import UnitProfile from '../components/management/unit/UnitProfile';
import Units from '../components/management/unit/Units';
import AssetManager from '../components/master/assets/AssetManager';
import AboutPage from '../pages/AboutPage';
import ApprovalListPage from '../pages/approvalList/ApprovalListPage';
import BlogPage from '../pages/BlogPage';
import BlogViewPage from '../pages/BlogViewpage';
import BusinessCashPage from '../pages/BusinessCashPage';
import CashReceiptDetailPage from '../pages/cashPayment/CashReceiptDetailPage';
import CashReceiptPage from '../pages/cashPayment/CashReceiptPage';
import ContactUsPage from '../pages/ContactUsPage';
import CustomerPage from '../pages/customer/Customer';
import CustomerApprovalListPage from '../pages/customer/CustomerApprovalListPage';
import CustomerDetail from '../pages/customer/CustomerDetail';
import DashboardPage from '../pages/dashboard/Dashboard';
import EquityPage from '../pages/Equity/EquityPage';
import ExpensePage from '../pages/Expense/ExpensePage';
import FaqPage from '../pages/FaqPage';
import FieldAgentPage from '../pages/fieldAgent/FieldAgentPage';
import FinanceManagerPage from '../pages/financeManager/FinanceManagerPage';
import FundingPage from '../pages/funding/Funding';
import FundingsPage from '../pages/funding/Fundings';
import IncomePage from '../pages/Income/IncomePage';
import LandingPage from '../pages/LandingPage';
import LeadPage from '../pages/leads/Lead';
import LeadsPage from '../pages/leads/Leads';
import LiabilitiesPage from '../pages/liabilities/LiabilitiesPage';
import LoanForm from '../pages/LoanFormPage';
import Login from '../pages/LoginPage';
import ManagerPage from '../pages/manager/ManagerPage';
import MandateDetailPage from '../pages/mandate/MandateDetailPage';
import MandatePage from '../pages/mandate/MandatePage';
import NotificationPage from '../pages/notification/Notification';
import OurLendingProcessPage from '../pages/OurLendingProcessPage';
import PapDetailViewPage from '../pages/pap/PapDetailViewPage';
import PapPage from '../pages/pap/PapPage';
import Profile from '../pages/profile/Profile';
import ManagementOffers from '../pages/profile/tabContents/FundingOffers';
import ReferralPage from '../pages/referral/ReferralPage';
import ReportMenuPage from '../pages/ReportMenuPage';
import TransationSortingPage from '../pages/TransationSorting';
// import StatementMenuPage from "../pages/StatementMenuPage";
import UnderwriterPage from '../pages/underwriter/UnderwriterPage';
import UnitPage from '../pages/units/Unit';
import UnitApprovalListPage from '../pages/units/UnitApprovalListPage';
import UnitsPage from '../pages/units/Units';
import UnsecuredbusinessPage from '../pages/UnsecuredbusinessPage';
// import UwMasterMenuPage from "../pages/UwMasterMenuPage";
import UwMenuPage from '../pages/UwMenuPage';
import { authSelector } from '../store/auth/userSlice';
import { Roles } from '../utils/enums';
import useAuth from '../utils/hooks/useAuth';
import ProtectedRoute from './ProtectedRoutes';
import BulkUploadFundingPage from '../pages/bulkUploadFunding/BulkUploadFundingPage';
import BulkUploadFundingDetailPage from '../pages/bulkUploadFunding/BulkUploadFundingDetailPage';

const AppRoute = () => {
  const { authenticated } = useAuth();
  const { role } = useSelector(authSelector);
  const isDashboardAuthorizedUser =
    authenticated &&
    [
      Roles.FieldAgent,
      Roles.Manager,
      Roles.Admin,
      Roles.UnderWriter,
      Roles.FinanceManager
    ].includes(role as Roles);
  const dashboardRedirect = <Navigate to="/dashboard" />;
  const landingPageRedirect = isDashboardAuthorizedUser ? (
    <Navigate to="/dashboard" />
  ) : (
    <LandingPage />
  );
  const landingPage = isDashboardAuthorizedUser
    ? dashboardRedirect
    : landingPageRedirect;

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/bulk-upload-funding"
          element={<BulkUploadFundingPage />}
        />
        <Route
          path="/bulk-upload-funding/:id"
          element={<BulkUploadFundingDetailPage />}
        />
        <Route path="leads/:query_params_customerId" element={<LeadPage />}>
          <Route path="" element={<Navigate to="funding-form" replace />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route index path="funding-form" element={<Fundings />} />
          <Route
            path="identity-verification"
            element={<CustomerIdentityVerification />}
          />
          <Route path="edit-approval" element={<CustomerApprovalListPage />} />
          <Route path="notification" element={<CustomerNotifications />} />
        </Route>

        <Route
          path="customer/:query_params_customerId"
          element={<CustomerDetail />}
        >
          <Route path="" element={<Navigate to="funding-form" replace />} />
          <Route index path="profile" element={<CustomerProfile />} />
          <Route path="units" element={<Units />} />
          <Route path="funding-form" element={<Fundings />} />
          <Route
            path="identity-verification"
            element={<CustomerIdentityVerification />}
          />
          <Route path="edit-approval" element={<CustomerApprovalListPage />} />
          <Route path="notification" element={<CustomerNotifications />} />
        </Route>
        <Route path="funding/:query_params_loanId" element={<FundingPage />}>
          <Route path="" element={<Navigate to="funding-form" replace />} />
          <Route path="unit-profile" element={<UnitProfile />} />
          <Route path="gocardless" element={<FundingGoCardless />} />
          <Route
            index
            path="funding-form"
            element={<ManagementFundingApplication />}
          />
          <Route
            path="application-status"
            element={<FundingApplicationStatus />}
          />
          <Route index path="funding-offer" element={<ManagementOffers />} />
          <Route
            path="identity-verification"
            element={<FundingIdentityVerification />}
          />
          <Route path="affordability" element={<Affordability />} />
          <Route path="contract" element={<FundingContract />} />

          {/* <Route path="notification" element={<FundingNotifications />} /> */}

          <Route path="subscriptions" element={<SubscriptionCreateView />} />
          {/* <Route path="/subscriptions/:id" element={<SubscriptionPage />} /> */}
          <Route path="pap" element={<PapPage />} />
          <Route path="pap-details/:planId" element={<PapDetailViewPage />} />
          <Route path="cash-receipt" element={<CashReceiptPage />} />
          <Route path="cash-receipt/:id" element={<CashReceiptDetailPage />} />
          <Route path="mandate" element={<MandatePage />} />
          <Route path="mandate/:id" element={<MandateDetailPage />} />
        </Route>
        <Route path="units/:query_params_unitId" element={<UnitPage />}>
          <Route path="" element={<Navigate to="funding-form" replace />} />
          <Route path="unit-profile" element={<UnitProfile />} />
          <Route path="bp" element={<UnitBusinessPartner />} />
          <Route path="documents" element={<Documents />} />
          <Route index path="funding-form" element={<Fundings />} />
          <Route path="edit-approval" element={<UnitApprovalListPage />} />
          {/* <Route path="notification" element={<UnitNotifications />} /> */}
        </Route>
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/funding" element={<FundingsPage />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/field-agent" element={<FieldAgentPage />} />
        <Route path="/finance-manager" element={<FinanceManagerPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/change-password" element={<ChangePasswordPage />} /> */}
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/approval-list" element={<ApprovalListPage />} />

        <Route path="/underwriter" element={<UnderwriterPage />} />
        <Route path="/credit-monitoring" element={<CreditMonitoring />} />
        <Route path="/default/:id" element={<CreditDefaultDetailPage />} />
        <Route path="/pap" element={<PapPage path="main" />} />
        <Route
          path="/pap-details/:planId"
          element={<PapDetailViewPage path="main" />}
        />
        {/* <Route path="/disbursement-advice" element={<DisbursementAdvicePage />} /> */}
        <Route path="/cash-receipt" element={<CashReceiptPage path="main" />} />
        <Route
          path="/cash-receipt/:id"
          element={<CashReceiptDetailPage path="main" />}
        />

        <Route path="/mandate" element={<MandatePage path="main" />} />
        <Route
          path="/mandate/:id"
          element={<MandateDetailPage path="main" />}
        />
        <Route
          path="/transaction-sorting"
          element={<TransationSortingPage />}
        />
        <Route element={<UwMenuPage />}>
          <Route path="assets" element={<AssetManager />} />
          <Route path="liabilities" element={<LiabilitiesPage />} />
          <Route path="equity" element={<EquityPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expense" element={<ExpensePage />} />
          {/* </Route>
        <Route element={<UwMenuPage />}> */}
          <Route path="/bp" element={<BusinessPartner />} />
          <Route path="/bp-groups" element={<BusinessPartnerGroup />} />

          <Route path="/entry/:entry_id" element={<AddEntry />} />
          <Route path="/entry" element={<AddEntry />} />
          {/* <Route path="/add-entry" element={<AddEntry />} /> */}
        </Route>
        <Route path="/reports/" element={<ReportMenuPage />}>
          <Route path="" element={<Navigate to="default" replace />} />
          <Route path="default" element={<ReportDefault />} />
          <Route path="customer" element={<ReportCustomer />} />
          <Route path="good-standing" element={<ReportGoodStanding />} />
          <Route path="default-user" element={<ReportDefaultUser />} />
          <Route path="pending-due" element={<ReportPendingDue />} />
          <Route path="payment" element={<ReportPayment />} />
          <Route path="funding" element={<ReportFunding />} />
          <Route path="outstanding" element={<ReportOutstanding />} />
          <Route path="summary" element={<ReportSummary />} />
          <Route
            path="agent-performance"
            element={<ReportAgentPerformance />}
          />
          <Route path="agent" element={<ReportAgent />} />
          <Route
            path="contract-expiring"
            element={<ReportContractExpiring />}
          />
          <Route path="contract-expired" element={<ReportContractExpired />} />
          <Route path="referral" element={<ReportReferral />} />
          <Route path="snapshot" element={<ReportSnapshot />} />
        </Route>
        {/* <Route path="/statements/" element={<StatementMenuPage />}> */}
        <Route path="/statements/" element={<UwMenuPage />}>
          <Route path="" element={<Navigate to="pl" replace />} />
          <Route path="pl" element={<StatementPl />} />
          <Route path="trial-balance" element={<StatementTrialBalance />} />
          <Route
            path="bp-trial-balance"
            element={<StatementBpTrialBalance />}
          />
          <Route path="balance-sheet" element={<StatementBalanceSheet />} />
          <Route path="ledger" element={<EntryList />} />
        </Route>
        <Route
          path="/funding-form/:query_params_loanId"
          element={<LoanForm />}
        />
      </Route>
      <Route path="/" element={landingPage} />
      {!isDashboardAuthorizedUser && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog-inner" element={<BlogViewPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route
            path="/our-lending-process"
            element={<OurLendingProcessPage />}
          />
          <Route path="/funding-form/" element={<LoanForm />} />
          <Route path="/business-cash-advance" element={<BusinessCashPage />} />
          <Route path="/business-funding" element={<UnsecuredbusinessPage />} />
          <Route
            path="/gocadless-success"
            element={<GocardlessSuccessWindow />}
          />
          <Route path="/instant-pay-pending" element={<InstantPayPending />} />
          <Route path="/instant-pay-failed" element={<InstantPayFailed />} />
        </>
      )}
      {/* <Route path="*" element={landingPage} /> */}
    </Routes>
  );
};

export default AppRoute;
