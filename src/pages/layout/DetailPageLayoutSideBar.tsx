import React from 'react';
import { IconType } from 'react-icons';
import { HiDotsHorizontal } from 'react-icons/hi';
import { IoMdClose, IoMdHome } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';

import { managementSliceSelector } from '../../store/managementReducer';

export type SidebarLayoutProps = {
  menus?: { name: string; link: string; icon: IconType | string }[];
  toggleSidebar?: () => void;
};

const Nav: React.FC<SidebarLayoutProps> = ({ menus, toggleSidebar }) => {
  const { user } = useSelector(managementSliceSelector);

  return (
    <>
      {menus.map((menu, i) => (
        <React.Fragment key={i}>
          {menu.name === 'Profile' ? (
            <NavLink
              to={menu.link}
              className={({ isActive }) =>
                `${
                  isActive ? 'text-[#1A439A]' : ''
                } group mt-4 flex items-center gap-3.5 rounded-md p-2 text-sm font-medium`
              }
              onClick={toggleSidebar && toggleSidebar}
            >
              <div className="w-full border-b">
                <span className="flex items-center justify-between gap-2 pb-2">
                  <img
                    src={user?.image || 'https://via.placeholder.com/40'}
                    alt=""
                    className="h-12 w-12 flex-shrink-0 self-center rounded-full border border-gray-300 bg-gray-500"
                  />
                  <>
                    <span className="px-2">
                      <p className="text-[14px] font-semibold text-black">
                        {`${user?.first_name} ${user?.last_name}`}
                      </p>
                      <p className="text-[10px] text-[#656565]">
                        {`+44 ${user?.phone_number}`}
                      </p>
                    </span>
                    <HiDotsHorizontal />
                  </>
                </span>
              </div>
            </NavLink>
          ) : (
            <NavLink
              to={menu.link}
              className={({ isActive }) =>
                `${
                  isActive ? 'bg-[#EDF3FF] text-[#1A439A]' : ''
                } group mt-4 flex items-center gap-3.5 rounded-md p-2 text-sm font-medium`
              }
              onClick={toggleSidebar && toggleSidebar}
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
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const DetailPageLayoutSideBar: React.FC<{
  menus?: { name: string; link: string; icon: IconType | string }[];
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}> = ({ menus = [], isSidebarOpen, toggleSidebar }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTablet = useMediaQuery({
    query: '(min-width: 768px) and (max-width: 1023px)'
  });

  return (
    <>
      {isMobile || isTablet ? (
        <>
          {/* <div className="fixed top-0 left-0 z-50 p-4 pb-12 bg-white">
            <HiOutlineMenuAlt3
              size={28}
              className="cursor-pointer text-[#1A439A]"
              onClick={toggleModal}
            />
          </div> */}
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
                        <span>{'Home'}</span>
                      </div>
                    </NavLink>
                  </div>
                </div>
                <div className="p-4 text-[#929292]">
                  <Nav menus={menus} toggleSidebar={toggleSidebar} />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full overflow-y-auto border-r bg-[#FFFFFF]">
          <div className="flex-col bg-[#FFFFFF] md:flex">
            <div className="flex flex-1 flex-col">
              <nav className="flex-1 bg-[#FFFFFF] px-2 py-4 text-[#929292]">
                <Nav menus={menus} toggleSidebar={toggleSidebar} />
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailPageLayoutSideBar;
