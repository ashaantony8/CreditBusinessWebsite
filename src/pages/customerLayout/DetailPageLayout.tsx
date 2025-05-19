import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';
import Header from '../../components/layout/Mainheader';
import { RiUserSharedLine } from 'react-icons/ri';
import { IoMdClose, IoMdHome } from 'react-icons/io';

export type SidebarLayoutProps = {
  menus?: { name: string; link?: string; icon: IconType; label: string }[];
  children: ReactNode;

  backHandler?: () => void;
  setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu?: string;
  toggleReferForm: () => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
};

export type SidebarProps = {
  menus?: { name: string; link?: string; icon: IconType; label: string }[];
  setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu?: string;
};

const DetailsPageLayout: React.FC<SidebarLayoutProps> = ({
  children,
  menus,

  backHandler, // Destructure profileBackHandler
  selectedMenu,
  setSelectedMenu,
  toggleReferForm,
  isSidebarOpen = true,
  toggleSidebar
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });

  // Use profileBackHandler if it is passed, otherwise use backHandler

  return (
    <>
      {isTablet || isMobile ? (
        <div className="flex h-screen w-full flex-col bg-[#EDF3FF]">
          <Header
            backHandler={backHandler}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          {/* <div className="flex flex-grow overflow-hidden p-[2%] bg-[#EDF3FF]"> */}
          <div className="flex w-full flex-col gap-2 bg-white px-[2%] pb-[4%]">
            <div className="flex flex-col items-end text-[#818181] max-sm:mr-4">
              <button
                onClick={toggleReferForm}
                className="mt-12 flex h-[41px] w-[187px] items-center border border-blue-800 px-4 text-color-text-secondary"
              >
                <RiUserSharedLine size={24} />
                <a className="mx-2">Refer a Client</a>
              </button>
            </div>
            {/* <div className="flex flex-grow border border-[#929292] w-full overflow-hidden"> */}
            {isSidebarOpen && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                <div
                  className={`fixed inset-y-0 left-0 ${
                    isTablet ? 'w-2/4' : 'w-full'
                  } overflow-y-auto bg-white shadow-lg`}
                >
                  <div className="flex items-center justify-between border-b p-4">
                    <IoMdClose
                      size={24}
                      className="cursor-pointer"
                      onClick={toggleSidebar}
                    />
                    <div className="flex space-y-2">
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          `${
                            isActive ? 'bg-[#EDF3FF] text-[#1A439A]' : ''
                          } group flex items-center gap-3.5 rounded-md p-2 text-sm font-medium`
                        }
                      >
                        <div className="flex items-center gap-2">
                          {React.createElement(IoMdHome, { size: '20' })}
                          <span>Home</span>
                        </div>
                      </NavLink>
                    </div>
                  </div>

                  <div className="p-4 text-[#929292]">
                    {menus.map(menu => (
                      <NavLink
                        to={menu.link}
                        key={menu.label}
                        className={`${
                          menu.name === selectedMenu ? 'text-[#1A439A]' : ''
                        } group mt-4 flex items-center gap-3.5 rounded-md p-2 text-sm font-medium`}
                        onClick={() => {
                          setSelectedMenu(menu.name);
                          toggleSidebar();
                        }}
                      >
                        <div>
                          {typeof menu.icon === 'string'
                            ? React.createElement('img', {
                                src: menu.icon,
                                alt: menu.name,
                                width: '20',
                                height: '16'
                              })
                            : React.createElement(menu.icon, {
                                size: '20'
                              })}
                        </div>
                        <p className=" ">{menu.name}</p>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <main className="h-screen bg-white p-4">{children}</main>
            {/* </div> */}
          </div>
        </div>
      ) : (
        // </div>
        <div className="flex h-screen w-full flex-col bg-[#EDF3FF]">
          <Header backHandler={backHandler} />
          <div className="flex flex-col items-end px-[2%] text-[#818181]">
            <button
              onClick={toggleReferForm}
              className="my-4 flex h-[41px] items-center border border-blue-800 px-4 text-color-text-secondary"
            >
              <RiUserSharedLine size={24} />
              <a className="mx-2">Refer a Client</a>
            </button>
          </div>
          <div className="flex flex-grow overflow-hidden bg-[#EDF3FF] px-[2%] pb-[2%]">
            <div className="flex w-full flex-col gap-2 bg-white">
              <div className="flex w-full flex-grow overflow-hidden border border-[#929292]">
                <aside className="h-screen w-64 border-r border-[#929292] max-lg:w-56">
                  <nav className=" ">
                    {menus.map(menu => (
                      <NavLink
                        to={menu.link}
                        key={menu.label}
                        className={`relative grid border-b border-l border-[#929292] py-3 pl-7 text-[16px] font-medium text-[#929292] transition-colors duration-300 hover:bg-white max-lg:text-[14px] ${
                          menu.name === selectedMenu
                            ? 'w-64 border-l-[3px] border-l-[#1A439A] bg-white text-black max-lg:w-56'
                            : ''
                        }`}
                        onClick={() => setSelectedMenu(menu.name)}
                      >
                        <p>{menu.label}</p>
                      </NavLink>
                    ))}
                  </nav>
                </aside>
                <main className="h-screen flex-grow bg-white pl-8 pt-8 max-lg:w-[90%] lg:w-[85%]">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailsPageLayout;
