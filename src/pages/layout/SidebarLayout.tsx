import React, { ReactNode, useState } from 'react';
import { IconType } from 'react-icons';
import { useMediaQuery } from 'react-responsive';

import Header from '../../components/layout/Mainheader';
import Sidebar from '../../components/layout/Sidebar';
// import BottomNav from "./Bottom";
// import MobileHeader from "./MobileHeader";

export type SidebarLayoutProps = {
  menus?: { name: string; link: string; icon: IconType }[];
  children: ReactNode;
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, menus }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {isLaptop && (
        <div className="flex h-screen w-full flex-col bg-[#EDF3FF]">
          <Header />

          <div className="flex flex-grow overflow-hidden p-[2%]">
            <div className="w-[15.5%] flex-shrink-0 flex-grow-0 max-lg:w-[11%]">
              <Sidebar menus={menus} />
            </div>
            <main className="w-[84.5%] flex-grow overflow-auto bg-[#FFFFFF] p-4 max-lg:w-[88%]">
              {children}
            </main>
          </div>
        </div>
      )}
      {/* {isMobile && (
        <>
          <div className="flex flex-col bg-white fixed w-full min-h-screen">
            <MobileHeader />
            <main className="flex-grow overflow-auto">{children}</main>
            <BottomNav menus={menus}/>
          </div>
        </>
      )} */}
      {(isMobile || isTablet) && (
        <>
          <div className="fixed flex min-h-screen w-full flex-col bg-white">
            <Header
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
            <main className="flex-grow overflow-auto pb-4">{children}</main>
            <Sidebar
              menus={menus}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </div>
        </>
      )}
    </>
  );
};

export default SidebarLayout;
