import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { authSelector } from '../../../store/auth/userSlice';
import { Roles } from '../../../utils/enums';
import DashboardAgentSubmissionList from './DashboardAgentSubmissionList';
import DashboardCreditMonitoring from './DashboardCreditMonitoring';
import DashboardHeader from './DashboardHeader';
import DashboardStatusCard from './DashboardStatusCard';
import FieldmangementDashboard from './FieldmangementDashboard';

const Dashboard = () => {
  const { role } = useSelector(authSelector);
  const navigate = useNavigate();

  // Tabs for different roles
  const agentTabs = [
    {
      id: 'tab1',
      label: 'Waiting for Submission',
      content: <DashboardAgentSubmissionList />
    }
    // { id: "tab2", label: "Waiting for Submission", content: <DashboardAgentSubmissionList /> },
  ];
  const adminTabs = [
    {
      id: 'tab1',
      label: 'Waiting for Disbursal',
      content: <DashboardAgentSubmissionList />
    }
  ];

  const managerTabs = [
    {
      id: 'tab1',
      label: 'Waiting for Approval',
      content: <DashboardAgentSubmissionList />
    }
  ];

  const underwriterTabs = [
    {
      id: 'tab1',
      label: 'Underwriting Review',
      content: <DashboardAgentSubmissionList />
    }
  ];

  const cbTabs = [
    { id: 'tab1', label: 'Failed', content: <DashboardCreditMonitoring /> }
  ];

  // Determine role
  const isAgent = role === Roles.FieldAgent;
  const isAdmin = role === Roles.Admin;
  const isManager = role === Roles.Manager;
  const isUnderWriter = role === Roles.UnderWriter;
  const isFinanceManager = role === Roles.FinanceManager;

  // Set state for active tabs based on role
  const [activeAgentTab, setActiveAgentTab] = useState(agentTabs[0].id);
  const [activeAdminTab, setActiveAdminTab] = useState(adminTabs[0].id);
  const [activeManagerTab, setActiveManagerTab] = useState(managerTabs[0].id);
  const [activeUnderWriterTab, setActiveUnderWriterTab] = useState(
    underwriterTabs[0].id
  );

  const [activeCbTab, setActiveCbTab] = useState(cbTabs[0].id);

  return (
    <>
      {isAgent &&
        !(isAdmin || isManager || isUnderWriter || isFinanceManager) && (
          <DashboardHeader />
        )}

      <div className="flex h-[98%] flex-1 flex-col overflow-y-scroll bg-white max-sm:h-[88vh]">
        <div className="px-2 max-sm:p-4">
          {/* Agent view */}
          {isAgent && (
            <>
              <DashboardStatusCard />
              <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="mx-auto w-full py-2">
                  <h2 className="mb-4 text-xl font-bold text-gray-800">
                    {'Funding'}
                  </h2>
                  <div className="rounded-lg border p-[2%]">
                    <div className="w-full">
                      <div className="w-full">
                        <div className="flex space-x-4 border-b">
                          {agentTabs.map(tab => (
                            <button
                              key={tab.id}
                              className={`px-4 py-2 text-[16px] font-medium focus:outline-none ${
                                activeAgentTab === tab.id
                                  ? 'border-b-2 border-[#1A449A] text-[#1A449A]'
                                  : 'text-black hover:text-blue-800'
                              }`}
                              onClick={() => setActiveAgentTab(tab.id)}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                        <div>
                          {agentTabs.map(tab => (
                            <div
                              key={tab.id}
                              className={
                                activeAgentTab === tab.id ? 'block' : 'hidden'
                              }
                            >
                              {tab.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center text-center">
                      <button
                        className="flex items-center font-semibold text-[#1A439A]"
                        onClick={() => navigate('/funding')}
                      >
                        {'VIEW MORE '}
                        <IoIosArrowForward size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* <div className="w-full mx-auto py-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Credit Monitoring</h2>
                  <div className="border p-[2%] rounded-lg">
                    <div className="w-full">
                      <div className="flex space-x-4 border-b">
                        {cbTabs.map((tab) => (
                          <button
                            key={tab.id}
                            className={`py-2 px-4 text-[16px] font-medium focus:outline-none ${
                              activeCbTab === tab.id
                                ? "border-b-2 border-[#1A449A] text-[#1A449A]"
                                : "text-black hover:text-blue-800"
                            }`}
                            onClick={() => setActiveCbTab(tab.id)}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <div>
                        {cbTabs.map((tab) => (
                          <div key={tab.id} className={activeCbTab === tab.id ? "block" : "hidden"}>
                            {tab.content}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-center flex justify-center">
                      <button className="text-[#1A439A] font-semibold flex items-center">
                        VIEW MORE <IoIosArrowForward size={20} />
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            </>
          )}

          {/* Admin view */}
          {isAdmin && (
            <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              <div className="mx-auto w-full py-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {'Funding'}
                </h2>
                <div className="rounded-lg border p-[2%]">
                  <div className="w-full">
                    <div className="flex space-x-4 border-b">
                      {adminTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 text-[16px] font-medium focus:outline-none ${
                            activeAdminTab === tab.id
                              ? 'border-b-2 border-[#1A449A] text-[#1A449A]'
                              : 'text-black hover:text-blue-800'
                          }`}
                          onClick={() => setActiveAdminTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      {adminTabs.map(tab => (
                        <div
                          key={tab.id}
                          className={
                            activeAdminTab === tab.id ? 'block' : 'hidden'
                          }
                        >
                          {tab.content}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center text-center">
                    <button
                      className="flex items-center font-semibold text-[#1A439A]"
                      onClick={() => navigate('/funding')}
                    >
                      {'VIEW MORE '}
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mx-auto w-full py-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {'Credit Monitoring'}
                </h2>
                <div className="rounded-lg border p-[2%]">
                  <div className="w-full">
                    <div className="flex space-x-4 border-b">
                      {cbTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 text-[16px] font-medium focus:outline-none ${
                            activeCbTab === tab.id
                              ? 'border-b-2 border-[#1A449A] text-[#1A449A]'
                              : 'text-black hover:text-blue-800'
                          }`}
                          onClick={() => setActiveCbTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      {cbTabs.map(tab => (
                        <div
                          key={tab.id}
                          className={
                            activeCbTab === tab.id ? 'block' : 'hidden'
                          }
                        >
                          {tab.content}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center text-center">
                    <button
                      className="flex items-center font-semibold text-[#1A439A]"
                      onClick={() => navigate('/credit-monitoring')}
                    >
                      {'VIEW MORE '}
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manager view */}
          {isManager && (
            <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              <div className="mx-auto w-full py-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {'Funding'}
                </h2>
                <div className="rounded-lg border p-[2%]">
                  <div className="w-full">
                    <div className="flex space-x-4 border-b">
                      {managerTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 text-[16px] font-medium focus:outline-none ${
                            activeManagerTab === tab.id
                              ? 'border-b-2 border-[#1A449A] text-[#1A449A]'
                              : 'text-black hover:text-blue-800'
                          }`}
                          onClick={() => setActiveManagerTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      {managerTabs.map(tab => (
                        <div
                          key={tab.id}
                          className={
                            activeManagerTab === tab.id ? 'block' : 'hidden'
                          }
                        >
                          {tab.content}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center text-center">
                    <button
                      className="flex items-center font-semibold text-[#1A439A]"
                      onClick={() => navigate('/funding')}
                    >
                      {'VIEW MORE '}
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mx-auto w-full py-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {'Credit Monitoring'}
                </h2>
                <div className="rounded-lg border p-[2%]">
                  <div className="w-full">
                    <div className="flex space-x-4 border-b">
                      {cbTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 text-[16px] font-medium focus:outline-none ${
                            activeCbTab === tab.id
                              ? 'border-b-2 border-[#1A449A] text-[#1A449A]'
                              : 'text-black hover:text-blue-800'
                          }`}
                          onClick={() => setActiveCbTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      {cbTabs.map(tab => (
                        <div
                          key={tab.id}
                          className={
                            activeCbTab === tab.id ? 'block' : 'hidden'
                          }
                        >
                          {tab.content}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center text-center">
                    <button
                      className="flex items-center font-semibold text-[#1A439A]"
                      onClick={() => navigate('/funding')}
                    >
                      {'VIEW MORE '}
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Underwriter view */}
          {isUnderWriter && (
            <div className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
              <div className="mx-auto w-full py-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {'Funding'}
                </h2>
                <div className="rounded-lg border p-[2%]">
                  <div className="w-full">
                    <div className="flex space-x-4 border-b">
                      {underwriterTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 text-[16px] font-medium focus:outline-none ${
                            activeUnderWriterTab === tab.id
                              ? 'border-b-2 border-[#1A449A] text-[#1A449A]'
                              : 'text-black hover:text-blue-800'
                          }`}
                          onClick={() => setActiveUnderWriterTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      {underwriterTabs.map(tab => (
                        <div
                          key={tab.id}
                          className={
                            activeUnderWriterTab === tab.id ? 'block' : 'hidden'
                          }
                        >
                          {tab.content}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center text-center">
                    <button
                      className="flex items-center font-semibold text-[#1A439A]"
                      onClick={() => navigate('/funding')}
                    >
                      {'VIEW MORE '}
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mx-auto w-full py-2">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  {'Credit Monitoring'}
                </h2>
                <div className="rounded-lg border p-[2%]">
                  <div className="w-full">
                    <div className="flex space-x-4 border-b">
                      {cbTabs.map(tab => (
                        <button
                          key={tab.id}
                          className={`px-4 py-2 text-[16px] font-medium focus:outline-none ${
                            activeCbTab === tab.id
                              ? 'border-b-2 border-[#1A449A] text-[#1A449A]'
                              : 'text-black hover:text-blue-800'
                          }`}
                          onClick={() => setActiveCbTab(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div>
                      {cbTabs.map(tab => (
                        <div
                          key={tab.id}
                          className={
                            activeCbTab === tab.id ? 'block' : 'hidden'
                          }
                        >
                          {tab.content}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center text-center">
                    <button
                      className="flex items-center font-semibold text-[#1A439A]"
                      onClick={() => navigate('/funding')}
                    >
                      {'VIEW MORE '}
                      <IoIosArrowForward size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FinanceManager view */}
          {isFinanceManager && (
            // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-8">
            //   <div className="w-full mx-auto py-2">
            //     <h2 className="text-xl font-bold text-gray-800 mb-4">Funding</h2>
            //     <div className="border p-[2%] rounded-lg">
            //       <div className="w-full">
            //         <div className="flex space-x-4 border-b">
            //           {financemanagerTabs.map((tab) => (
            //             <button
            //               key={tab.id}
            //               className={`py-2 px-4 text-[16px] font-medium focus:outline-none ${
            //                 financeManagerTab === tab.id
            //                   ? "border-b-2 border-[#1A449A] text-[#1A449A]"
            //                   : "text-black hover:text-blue-800"
            //               }`}
            //               onClick={() => setfinanceManagerTab(tab.id)}
            //             >
            //               {tab.label}
            //             </button>
            //           ))}
            //         </div>
            //         <div>
            //           {financemanagerTabs.map((tab) => (
            //             <div key={tab.id} className={financeManagerTab === tab.id ? "block" : "hidden"}>
            //               {tab.content}
            //             </div>
            //           ))}
            //         </div>
            //       </div>
            //       <div className="mt-4 text-center flex justify-center">
            //         <button
            //           className="text-[#1A439A] font-semibold flex items-center"
            //           onClick={() => navigate("/funding")}
            //         >
            //           VIEW MORE <IoIosArrowForward size={20} />
            //         </button>
            //       </div>
            //     </div>
            //   </div>

            //   <div className="w-full mx-auto py-2">
            //     <h2 className="text-xl font-bold text-gray-800 mb-4">Credit Monitoring</h2>
            //     <div className="border p-[2%] rounded-lg">
            //       <div className="w-full">
            //         <div className="flex space-x-4 border-b">
            //           {cbTabs.map((tab) => (
            //             <button
            //               key={tab.id}
            //               className={`py-2 px-4 text-[16px] font-medium focus:outline-none ${
            //                 activeCbTab === tab.id
            //                   ? "border-b-2 border-[#1A449A] text-[#1A449A]"
            //                   : "text-black hover:text-blue-800"
            //               }`}
            //               onClick={() => setActiveCbTab(tab.id)}
            //             >
            //               {tab.label}
            //             </button>
            //           ))}
            //         </div>
            //         <div>
            //           {cbTabs.map((tab) => (
            //             <div key={tab.id} className={activeCbTab === tab.id ? "block" : "hidden"}>
            //               {tab.content}
            //             </div>
            //           ))}
            //         </div>
            //       </div>
            //       <div className="mt-4 text-center flex justify-center">
            //         <button className="text-[#1A439A] font-semibold flex items-center"
            //         onClick={() => navigate("/funding")}
            //         >
            //           VIEW MORE <IoIosArrowForward size={20} />
            //         </button>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            <>
              <FieldmangementDashboard />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
