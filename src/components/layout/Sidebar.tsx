import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { authSelector } from '../../store/auth/userSlice';
import {
  commonMenu,
  financialSubMenu,
  masterSubMenu,
  PermittedRoutes
} from '../../utils/constants';

export type SidebarProps = {
  menus?: { name: string; link: string; icon: IconType }[];
};

const Nav = ({ menus }) => {
  const { role } = useSelector(authSelector);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);
  const [openMenu, setOpenMenu] = useState('');
  const [selectedSubMenu, setSelectedSubMenu] = useState('');

  const isRoutePermitted = (role, pathname) => {
    const permittedRoutes = [
      ...PermittedRoutes.common,
      ...(PermittedRoutes[role] || [])
    ];
    return permittedRoutes.some(route => {
      if (route.includes(':')) {
        const baseRoute = route.split(':')[0];
        return pathname.startsWith(baseRoute);
      }
      return route === pathname;
    });
  };

  const handleMainMenuClick = (menu, subMenu) => {
    if (menu.name === openMenu) {
      setOpenMenu('');
      setSelectedMenu(menu.link);
    } else if (menu.name === 'Financial Statement' || menu.name === 'Master') {
      setOpenMenu(menu.name);
      setSelectedMenu(menu.link);
      if (subMenu.length > 0) {
        const firstSubMenu = subMenu[0];
        setSelectedSubMenu(firstSubMenu.link);
        navigate(firstSubMenu.link);
      }
    } else {
      setOpenMenu('');
      setSelectedMenu(menu.link);
      navigate(menu.link);
    }
  };

  return (
    <>
      {menus.map((menu, i) => {
        const isFinancialStatement = menu.name === 'Financial Statement';
        const isMaster = menu.name === 'Master';

        const isSubMenuOpen =
          (isFinancialStatement && openMenu === 'Financial Statement') ||
          (isMaster && openMenu === 'Master');

        return (
          isRoutePermitted(role, menu.link) && (
            <React.Fragment key={i}>
              <div
                className={`${
                  selectedMenu === menu.link ||
                  (isMaster && openMenu === 'Master') ||
                  (isFinancialStatement && openMenu === 'Financial Statement')
                    ? 'bg-[#EDF3FF] text-[#1A439A]'
                    : ''
                } group mt-4 flex cursor-pointer items-center gap-3.5 rounded-md p-2 text-sm font-medium max-xl:text-[12px]`}
                onClick={() =>
                  handleMainMenuClick(
                    menu,
                    isFinancialStatement ? financialSubMenu : masterSubMenu
                  )
                }
              >
                <div>{React.createElement(menu.icon, { size: '20' })}</div>
                <p>{menu.name}</p>
                {(isFinancialStatement || isMaster) && (
                  <div className="-ml-3">
                    {isSubMenuOpen ? (
                      <IoIosArrowUp size={16} />
                    ) : (
                      <IoIosArrowDown size={16} />
                    )}
                  </div>
                )}
              </div>

              {(isFinancialStatement && openMenu === 'Financial Statement') ||
              (isMaster && openMenu === 'Master') ? (
                <div className="pl-2.5">
                  {(isFinancialStatement
                    ? financialSubMenu
                    : masterSubMenu
                  ).map((subMenu, index) => (
                    <Link
                      key={index}
                      to={subMenu.link}
                      className={`${
                        selectedSubMenu === subMenu.link
                          ? 'bg-[#EDF3FF] text-[#1A439A]'
                          : ''
                      } mt-2 flex items-center gap-2 rounded-md p-2 text-sm`}
                      onClick={() => {
                        setSelectedMenu(subMenu.link);
                        setSelectedSubMenu(subMenu.link);
                      }}
                    >
                      <div>
                        {React.createElement(subMenu.icon, { size: '20' })}
                      </div>
                      <p>{subMenu.name}</p>
                    </Link>
                  ))}
                </div>
              ) : null}
            </React.Fragment>
          )
        );
      })}
    </>
  );
};

const Sidebar: React.FC<{
  menus?: { name: string; link: string; icon: IconType | string }[];
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}> = ({ menus = commonMenu, isSidebarOpen, toggleSidebar }) => {
  const isMobileOrTablet = useMediaQuery({ query: '(max-width: 1023px)' });
  const isLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <>
      {/* {isMobileOrTablet && (
        <div className="fixed top-0 left-0 z-50 p-4 bg-white ">
          <button onClick={toggleSidebar}>
            {isSidebarOpen ? <MdClose size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      )} */}
      {(isLaptop || isSidebarOpen) && (
        <div
          className={`${
            isMobileOrTablet
              ? 'fixed left-0 z-40 h-full w-full translate-x-0 transform bg-white py-20 transition-transform duration-300'
              : 'h-full'
          }`}
        >
          <div className="flex h-full flex-col overflow-y-auto border-r bg-[#FFFFFF]">
            <nav className="flex-1 bg-[#FFFFFF] px-2 py-4 text-[#929292]">
              <Nav menus={menus} />
            </nav>
          </div>
        </div>
      )}
      {isSidebarOpen && isMobileOrTablet && (
        <div
          className="z-80 fixed left-0 top-0 h-full w-full bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
