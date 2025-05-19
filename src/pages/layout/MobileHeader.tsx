import { useEffect, useRef, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoIosLogIn } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import Logo from '../../assets/images/Logo.png';
import userIcon from '../../assets/svg/user.png';
import { sessionSliceSelector } from '../../store/auth/sessionSlice';
import { authSelector } from '../../store/auth/userSlice';
import useAuth from '../../utils/hooks/useAuth';

const MobileHeader = () => {
  const [nav, setNav] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();

  const { authenticated, signOut } = useAuth();
  const { signedIn } = useSelector(sessionSliceSelector);

  const [isOpen, setIsOpen] = useState(false);

  const user = useSelector(authSelector);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {}, [signedIn]);

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNav(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={navRef} className="sticky top-0 z-50">
      <div className="container mx-auto flex h-24 items-center justify-between text-white md:px-4">
        <NavLink to="/" className="flex items-center px-1 py-3">
          <img src={Logo} alt="Logo" className="mr-2 w-[220px]" />
        </NavLink>

        {signedIn && authenticated ? (
          <div className="relative px-2">
            <button
              type="button"
              className="flex rounded-full bg-blue-800 text-sm focus:ring-1 focus:ring-blue-300"
              id="user-menu-button"
              aria-expanded={isOpen}
              onClick={toggleMenu}
            >
              <img
                className="h-12 w-12 rounded-full"
                src={user?.image || userIcon}
                alt="user photo"
              />
            </button>
            {isOpen && (
              <div
                className="absolute right-0 mx-4 mt-2 w-60 divide-y divide-gray-100 rounded-lg bg-white py-2 shadow"
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <div className="flex">
                    <div className="mr-2 h-10 w-10">
                      <img
                        className="h-full w-full rounded-full object-cover object-center ring ring-white"
                        src={user?.image || userIcon}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="text-[14px] font-normal text-gray-900">
                        {`${user?.first_name} ${user.last_name}`}
                      </div>
                      <div className="text-[14px] font-normal text-gray-900">
                        {user?.email}
                      </div>
                      <div className="flex text-[12px] text-gray-900">
                        <span className="text-[#929292]">{'Role: '}</span>
                        <span className="mx-2 text-[#1A439A]">
                          {user?.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <hr />
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li className="">
                      <a
                        // href="/profile"
                        onClick={() => {
                          navigate('/profile');
                        }}
                        className="flex items-center px-4 py-2 text-sm text-[#929292] hover:bg-gray-100"
                      >
                        <FaRegUser />
                        <a className="mx-2">{'Profile'}</a>
                      </a>
                    </li>

                    <li>
                      <a
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-[#929292] hover:bg-gray-100"
                      >
                        <IoIosLogIn size={16} />{' '}
                        <a className="mx-2">{'Sign out'}</a>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to="/login"
            // onClick={() => handleTabClick()}
            className={({ isActive }) =>
              `px-1 py-3 font-semibold md:text-[12px] lg:text-[16px] ${
                isActive ? 'text-[#FF0000]' : 'text-[#02002E]'
              }`
            }
          >
            <button className="bg-color-text-secondary px-6 py-1 text-white hover:bg-blue-800">
              {'Login'}
            </button>
          </NavLink>
        )}

        <ul
          className={
            nav
              ? 'fixed left-0 top-0 h-full w-[80%] border-r border-r-gray-50 bg-white duration-500 ease-in-out md:hidden'
              : 'fixed bottom-0 left-[-100%] top-0 w-[60%] duration-500 ease-in-out'
          }
        >
          <NavLink to="/" className="flex items-center px-1 py-3">
            <img
              src={Logo}
              alt="Logo"
              className="mr-2 max-sm:w-[200px] md:h-[50px] md:w-[150px] lg:h-[66px] lg:w-[190px] xl:w-[100%]"
            />
          </NavLink>
        </ul>
      </div>
    </div>
  );
};

export default MobileHeader;
