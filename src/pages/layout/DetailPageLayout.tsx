import React, { ReactNode, useState } from 'react';
import { IconType } from 'react-icons';
import { useMediaQuery } from 'react-responsive';

import Header from '../../components/layout/Mainheader';
// import BottomNav from "./Bottom";
import DetailPageLayoutSideBar from './DetailPageLayoutSideBar';
// import MobileHeader from "./MobileHeader";

export type SidebarLayoutProps = {
  menus?: { name: string; link: string; icon: IconType | string }[];
  children: ReactNode;
  backHandler: () => void;
};

const DetailsPageLayout: React.FC<SidebarLayoutProps> = ({
  children,
  menus,
  backHandler
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(prev => !prev);

  return (
    <>
      {isLaptop && (
        <div className="flex h-screen w-full flex-col bg-[#EDF3FF]">
          <Header backHandler={backHandler} fromUnitsPage={true} />
          <div className="flex flex-grow overflow-hidden p-[2%]">
            <div className="w-[15%] flex-shrink-0 flex-grow-0 max-lg:w-[10%]">
              <DetailPageLayoutSideBar menus={menus} />
            </div>
            <main className="flex-grow overflow-auto bg-[#FFFFFF] p-4">
              {children}
            </main>
          </div>
        </div>
      )}

      {/* {isMobile && (
        <>
          <div className="flex flex-col bg-white fixed w-full min-h-screen">
            <MobileHeader />
            <main className=" h-full ">{children}</main>
            <BottomNav />
          </div>
        </>
      )} */}
      {(isMobile || isTablet) && (
        <>
          <Header
            backHandler={backHandler}
            isSidebarOpen={isModalOpen}
            toggleSidebar={toggleModal}
          />
          <main className="flex-grow overflow-auto pb-4">{children}</main>
          <DetailPageLayoutSideBar
            menus={menus}
            isSidebarOpen={isModalOpen}
            toggleSidebar={toggleModal}
          />
        </>
      )}
    </>
  );
};

export default DetailsPageLayout;
