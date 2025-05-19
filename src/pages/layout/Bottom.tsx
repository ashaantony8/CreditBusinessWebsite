import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

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

const BottomNav: React.FC<SidebarProps> = ({ menus = commonMenu }) => {
  const { role } = useSelector(authSelector);
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);
  const [isMasterSubMenuOpen, setMasterSubMenuOpen] = useState(false);
  const [isFinancialSubMenuOpen, setFinancialSubMenuOpen] = useState(false);

  const isMasterActive =
    selectedMenu.startsWith('/master') ||
    masterSubMenu.some(sub => selectedMenu.startsWith(sub.link));
  const isFinancialActive =
    selectedMenu.startsWith('/financial') ||
    financialSubMenu.some(sub => selectedMenu.startsWith(sub.link));

  return (
    <div className="fixed bottom-0 left-0 z-50 h-auto w-full overflow-x-auto border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-lg justify-between whitespace-nowrap px-2 font-medium">
        {menus
          .filter(menu =>
            [...PermittedRoutes.common, ...PermittedRoutes[role]].includes(
              menu.link
            )
          )
          .map((menu, index) => {
            const isMaster = menu.name === 'Master';
            const isFinancialStatement = menu.name === 'Financial Statement';

            return (
              <React.Fragment key={index}>
                <Link
                  to={isMaster || isFinancialStatement ? '#' : menu.link}
                  className={`flex items-center rounded-md p-1.5 text-sm ${
                    selectedMenu === menu.link ||
                    (isMaster && isMasterActive) ||
                    (isFinancialStatement && isFinancialActive)
                      ? 'bg-[#EDF3FF] text-[#1A439A]'
                      : ''
                  }`}
                  onClick={() => {
                    if (isMaster) {
                      setMasterSubMenuOpen(!isMasterSubMenuOpen);
                      setFinancialSubMenuOpen(false);
                    } else if (isFinancialStatement) {
                      setFinancialSubMenuOpen(!isFinancialSubMenuOpen);
                      setMasterSubMenuOpen(false);
                    } else {
                      setSelectedMenu(menu.link);
                    }
                  }}
                >
                  <div>{React.createElement(menu.icon, { size: '19' })}</div>
                </Link>

                {isMaster && isMasterSubMenuOpen && (
                  <div className="flex">
                    {masterSubMenu.map((subMenu, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subMenu.link}
                        className={`flex items-center rounded-md p-1.5 ${
                          selectedMenu === subMenu.link
                            ? 'bg-[#EDF3FF] text-[#1A439A]'
                            : ''
                        }`}
                        onClick={() => {
                          setSelectedMenu(subMenu.link);
                          setMasterSubMenuOpen(false);
                          setFinancialSubMenuOpen(false);
                        }}
                      >
                        <div>
                          {React.createElement(subMenu.icon, { size: '19' })}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {isFinancialStatement && isFinancialSubMenuOpen && (
                  <div className="flex">
                    {financialSubMenu.map((subMenu, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subMenu.link}
                        className={`flex items-center rounded-md p-1.5 ${
                          selectedMenu === subMenu.link
                            ? 'bg-[#EDF3FF] text-[#1A439A]'
                            : ''
                        }`}
                        onClick={() => {
                          setSelectedMenu(subMenu.link);
                          setFinancialSubMenuOpen(false);
                          setMasterSubMenuOpen(false);
                        }}
                      >
                        <div>
                          {React.createElement(subMenu.icon, { size: '19' })}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default BottomNav;
