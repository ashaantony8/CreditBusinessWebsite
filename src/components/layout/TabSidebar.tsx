import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { authSelector } from '../../store/auth/userSlice';
import {
  commonMenu,
  financialSubMenu,
  masterSubMenu,
  PermittedRoutes
} from '../../utils/constants';

export type TabSidebarProps = {
  menus?: { name: string; link: string; icon: IconType }[];
};

const Tooltip = ({ text, children }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 z-10 hidden -translate-x-1/2 transform rounded bg-[#EDF3FF] px-2 py-1 text-[8.5px] font-bold text-[#1A439A] group-hover:block">
        {text}
      </div>
    </div>
  );
};

const TabSidebar: React.FC<TabSidebarProps> = ({ menus = commonMenu }) => {
  const { role } = useSelector(authSelector);
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);
  const [isFinancialSubMenuOpen, setFinancialSubMenuOpen] = useState(false);
  const [isMasterSubMenuOpen, setMasterSubMenuOpen] = useState(false);
  const [selectedFinancialSubMenu, setSelectedFinancialSubMenu] = useState('');
  const [selectedMasterSubMenu, setSelectedMasterSubMenu] = useState('');

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

  return (
    <div className="flex h-full overflow-y-auto border-r bg-[#FFFFFF]">
      <div className="flex bg-[#FFFFFF]">
        <div className="flex flex-1 flex-col">
          <nav className="flex-1 bg-[#FFFFFF] px-2 py-4 text-[#929292]">
            {menus.map((menu, i) => {
              const isFinancialStatement = menu.name === 'Financial Statement';
              const isMaster = menu.name === 'Master';

              return (
                isRoutePermitted(role, menu.link) && (
                  <React.Fragment key={i}>
                    <Link
                      to={isFinancialStatement || isMaster ? '#' : menu.link}
                      className={`${
                        selectedMenu === menu.link ||
                        (isMaster && isMasterSubMenuOpen) ||
                        (isFinancialStatement && isFinancialSubMenuOpen)
                          ? 'bg-[#EDF3FF] text-[#1A439A]'
                          : ''
                      } group mt-4 flex items-center gap-3.5 rounded-md p-2 text-sm font-medium max-xl:text-[12px]`}
                      onClick={() => {
                        if (isFinancialStatement) {
                          setFinancialSubMenuOpen(!isFinancialSubMenuOpen);
                          setMasterSubMenuOpen(false);
                        } else if (isMaster) {
                          setMasterSubMenuOpen(!isMasterSubMenuOpen);
                          setFinancialSubMenuOpen(false);
                        } else {
                          setSelectedMenu(menu.link);
                        }
                      }}
                    >
                      <Tooltip text={menu.name}>
                        <div>
                          {React.createElement(menu.icon, {
                            size: '20'
                          })}
                        </div>
                      </Tooltip>

                      {(isFinancialStatement || isMaster) && (
                        <div className="-ml-1">
                          {isFinancialStatement && isFinancialSubMenuOpen ? (
                            <IoIosArrowUp size={14} />
                          ) : isFinancialStatement ? (
                            <IoIosArrowDown size={14} />
                          ) : isMaster && isMasterSubMenuOpen ? (
                            <IoIosArrowUp size={14} />
                          ) : isMaster ? (
                            <IoIosArrowDown size={14} />
                          ) : null}
                        </div>
                      )}
                    </Link>

                    {/* Sub-menu for Financial Statement */}
                    {isFinancialStatement && isFinancialSubMenuOpen && (
                      <div className="pl-2.5">
                        {financialSubMenu.map((subMenu, index) => (
                          <Link
                            key={index}
                            to={subMenu.link}
                            className={`${
                              selectedFinancialSubMenu === subMenu.link
                                ? 'bg-[#EDF3FF] text-[#1A439A]'
                                : ''
                            } group mt-2 flex items-center gap-2 rounded-md p-2 text-sm`}
                            onClick={() => {
                              setSelectedMenu(subMenu.link);
                              setSelectedFinancialSubMenu(subMenu.link);
                            }}
                          >
                            <Tooltip text={subMenu.name}>
                              <div>
                                {React.createElement(subMenu.icon, {
                                  size: '20'
                                })}
                              </div>
                            </Tooltip>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Sub-menu for Master */}
                    {isMaster && isMasterSubMenuOpen && (
                      <div className="pl-2.5">
                        {masterSubMenu.map((subMenu, index) => (
                          <Link
                            key={index}
                            to={subMenu.link}
                            className={`${
                              selectedMasterSubMenu === subMenu.link
                                ? 'bg-[#EDF3FF] text-[#1A439A]'
                                : ''
                            } group mt-2 flex items-center gap-2 rounded-md p-2 text-sm`}
                            onClick={() => {
                              setSelectedMenu(subMenu.link);
                              setSelectedMasterSubMenu(subMenu.link);
                            }}
                          >
                            <Tooltip text={subMenu.name}>
                              <div>
                                {React.createElement(subMenu.icon, {
                                  size: '20'
                                })}
                              </div>
                            </Tooltip>
                          </Link>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                )
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TabSidebar;
