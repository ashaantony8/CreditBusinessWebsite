import React from 'react';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

import { commonMenu } from '../../utils/constants';

export type SidebarProps = {
  menus?: { name: string; link?: string; icon: IconType; label: string }[];
  setSelectedMenu?: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu?: string;
};

const BottomNav: React.FC<SidebarProps> = ({
  menus = commonMenu,
  selectedMenu,
  setSelectedMenu
}) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 h-10 w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-lg justify-between px-2 font-medium">
        {menus.map(menu => (
          <Link
            to={menu.link}
            key={menu.name}
            className={`${
              menu.name === selectedMenu ? 'text-[#1A439A]' : ''
            } group mt-2 flex items-center gap-3.5 rounded-md p-1.5 text-sm font-medium`}
            onClick={() => setSelectedMenu(menu.name)}
          >
            {/* <p>{menu.name}</p> */}
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useLocation } from "react-router-dom";
// import { authSelector } from "../../store/auth/userSlice";
// import { PermittedRoutes, commonMenu } from "../../utils/constants";
// import { IconType } from "react-icons";

// export type SidebarProps = {
//   menus?: { name: string; link: string; icon: IconType; }[];
// };

// const BottomNav: React.FC<SidebarProps>  = ({menus=commonMenu}) => {
//   const { role } = useSelector(authSelector);

//   const location = useLocation();
//   const [selectedMenu, setSelectedMenu] = useState(location.pathname);

//   return (
//     <div className="fixed bottom-0 left-0 z-50 w-full h-10 bg-white border-t border-gray-200 ">
//       <div className="flex h-full max-w-lg justify-between mx-auto font-medium px-2">
//         {menus
//           .filter((menu) =>
//             [...PermittedRoutes.common, ...PermittedRoutes[role]].includes(
//               menu.link
//             )
//           )
//           .map((menu, index) => (
//             <Link
//               to={menu.link}
//               key={index}
//               className={`${
//                 selectedMenu === menu.link ? " text-[#1A439A]" : ""
//               } mt-2 group flex items-center text-sm gap-3.5 font-medium p-1.5 rounded-md`}
//               onClick={() => setSelectedMenu(menu.link)}
//             >
//               <div>{React.createElement(menu.icon, { size: "19" })}</div>
//             </Link>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default BottomNav;
