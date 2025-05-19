import { useEffect, useState } from 'react';

import Header from './Mainheader';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <>
      <div className="flex flex-col bg-[#EDF3FF]">
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="container mx-auto flex flex-row py-12 lg:px-16">
          <aside className="sticky w-[15%] self-start max-xl:w-[10%] max-md:w-[10%] max-sm:w-[20%]">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </aside>
          <main className="hide-scrollbar h-screen w-[85%] overflow-y-scroll">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
