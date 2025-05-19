import { useEffect, useRef, useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { BiArrowBack } from 'react-icons/bi';
import { FaRegBell, FaRegUser } from 'react-icons/fa';
import { IoIosLogIn } from 'react-icons/io';
import { MdHomeFilled } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import Logo from '../../assets/images/Logo.png';
import userIcon from '../../assets/svg/user.png';
import { sessionSliceSelector } from '../../store/auth/sessionSlice';
import { authSelector } from '../../store/auth/userSlice';
import { Roles } from '../../utils/enums';
import useAuth from '../../utils/hooks/useAuth';
import HeaderNotification from './HeaderNotification';

const Navbar = ({
  backHandler,
  isSidebarOpen,
  toggleSidebar
}: {
  backHandler?: () => void;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  fromUnitsPage?: boolean;
}) => {
  const [nav, setNav] = useState(false);
  const navRef = useRef(null);
  const { role } = useSelector(authSelector);
  const navigate = useNavigate();
  const handleNav = () => {
    if (toggleSidebar) {
      toggleSidebar();
    } else {
      setNav(!nav);
    }
  };

  const navItems = [
    { id: 1, text: 'About Us', path: '/about-us' },
    {
      id: 2,
      text: 'Our Products',
      path: '',
      dropdown: [
        {
          id: '2a',
          text: 'Business Funding',
          path: '/business-funding'
        },
        {
          id: '2b',
          text: 'Business Cash Advance',
          path: '/business-cash-advance'
        }
      ]
    },
    { id: 3, text: 'Our Lending Process', path: '/our-lending-process' },
    { id: 4, text: 'Blog', path: '/blog' },
    { id: 5, text: 'FAQ', path: '/faq' },
    { id: 6, text: 'Contact Us', path: '/contact-us' }
  ];

  const { authenticated, signOut } = useAuth();
  const { signedIn } = useSelector(sessionSliceSelector);

  const getBackgroundColor = () => {
    // List of path endings to check
    const pathEndings = [
      '/about-us',
      '/our-lending-process',
      '/login',
      '/funding-form',
      '/leads',
      '/dashboard',
      '/bulk-upload-funding',
      '/customer',
      '/notification',
      '/approval-list',
      '/underwriter',
      '/referral',
      '/manager',
      '/field-agent',
      '/finance-manager',
      '/blog',
      '/profile',
      '/blog-inner',
      '/contact-us',
      '/faq',
      '/business-funding',
      '/business-cash-advance',
      '/funding',
      '/units',
      '/credit-monitoring',
      '/leads',
      '/subscriptions',
      '/mandate',
      '/application-status',
      '/funding-form',
      '/cash-receipt',
      '/transaction-sorting',
      '/contract',
      '/identity-verification',
      '/gocardless',
      '/edit-approval',
      '/unit-profile',
      '/funding-offer',
      '/disbursement-advice',
      '/affordability',
      '/documents',
      '/pap',
      '/pap-details',
      '/assets',
      '/liabilities',
      '/equity',
      '/income',
      '/expense',
      '/entry',
      '/bp',
      '/bp-groups',
      '/reports/default-user',
      '/reports/customer',
      '/reports/good-standing',
      '/reports/default',
      '/reports/pending-due',
      '/reports/payment',
      '/reports/funding',
      '/reports/outstanding',
      '/reports/summary',
      '/reports/agent-performance',
      '/reports/agent',
      '/reports/contract-expiring',
      '/reports/contract-expired',
      '/reports/snapshot',
      '/reports/referral',
      '/statements/pl',
      '/statements/trial-balance',
      '/statements/bp-trial-balance',
      '/statements/balance-sheet',
      '/statements/ledger'
    ];

    const staticPathEndings = new Set([
      // for dynamic paths like "/subscriptions/:id"
      '/subscriptions',
      '/mandate',
      '/cash-receipt',
      '/pap-details',
      '/entry',
      '/default',
      '/bulk-upload-funding'
    ]);

    const currentPath = location.pathname;

    // Check if the current path matches any static or dynamic patterns
    for (const ending of staticPathEndings) {
      const dynamicPathPattern = new RegExp(`^${ending}/[a-zA-Z0-9-]+$`);

      if (currentPath === ending) {
        return '#FFFFFF';
      }

      if (dynamicPathPattern.test(currentPath)) {
        return '#FFFFFF';
      }
    }

    for (const ending of pathEndings) {
      if (currentPath.endsWith(ending)) {
        return '#FFFFFF';
      }
    }

    return '#CDD6E9';
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [unReadedNotifications, setUnReadedNotifications] = useState(false);

  const user = useSelector(authSelector);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const toggleNotification = () => {
    setNotificationOpen(!isNotificationOpen);
  };
  useEffect(() => {}, [signedIn]);

  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNav(false);
        setDropdownOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = event => {
      if (isOpen && !event.target.closest('#user-menu-button')) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);
  return (
    <div
      ref={navRef}
      className="sticky top-0 z-50 px-[1%]"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="flex h-20 items-center justify-between text-white">
        {(!authenticated ||
          (authenticated &&
            ([
              Roles.FieldAgent,
              Roles.Manager,
              Roles.Admin,
              Roles.UnderWriter,
              Roles.FinanceManager
            ].includes(user?.role as Roles) ||
              location.pathname === '/profile') &&
            toggleSidebar)) && (
          <div className="block flex items-center">
            <div onClick={handleNav} className="block">
              <div className="mx-1 inline-block h-[46px] w-[46px] cursor-pointer rounded-lg p-3 text-[#55627c]">
                {nav || isSidebarOpen ? (
                  <AiOutlineClose size={20} />
                ) : (
                  <AiOutlineMenu size={20} />
                )}
              </div>
            </div>
          </div>
        )}
        {backHandler && (
          <div className="pl-[.6%]">
            <div
              onClick={() => backHandler()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200"
            >
              <BiArrowBack className="text-lg" color="black" />
            </div>
          </div>
        )}
        <div className="flex">
          <div className="mx-auto flex items-center px-1 py-2 md:mx-0 md:mr-auto">
            <img
              src={Logo}
              alt="Logo"
              // className="lg:h-[66px] w-[90%]  md:h-[50px] max-lg:w-[150px] max-sm:w-[170px] "
              className="w-auto max-lg:w-[150px] max-sm:w-[170px] md:h-[50px] lg:h-[66px]"
            />
          </div>
        </div>
        <div className="hidden items-center md:ml-auto md:flex">
          <NavLink
            to="/"
            className="mx-auto flex items-center px-1 py-2 max-lg:py-1 md:mx-0 md:mr-auto"
            onClick={toggleSidebar}
          >
            <div
              className={`" flex gap-2 rounded-lg bg-[#CDD6E9] p-1 px-2 font-medium text-[#1A439A] ${
                !backHandler && 'ml-12'
              }`}
            >
              <MdHomeFilled className="h-5 w-5 max-lg:h-4 max-lg:w-4" />
              <a className="max-lg:text-[10px]">{'Home'}</a>
            </div>
          </NavLink>
          {(!authenticated ||
            (authenticated &&
              ![
                Roles.FieldAgent,
                Roles.Manager,
                Roles.Admin,
                Roles.UnderWriter,
                Roles.FinanceManager
              ].includes(user?.role as Roles))) && (
            <ul className="hidden md:flex">
              {navItems.map(item => (
                <li
                  key={item.id}
                  className="relative mx-1 cursor-pointer rounded-xl p-1 text-[13px] font-semibold text-[#02002E] duration-300 hover:text-[#FF0000] max-lg:mx-0 max-lg:text-[9.5px]"
                >
                  <NavLink
                    to={item.path}
                    // className={({ isActive }) =>
                    //   `${isActive ? "text-[#FF0000]" : "text-[#02002E]"}`
                    // }
                    onClick={() => {
                      if (item.dropdown) {
                        toggleDropdown();
                      }
                    }}
                  >
                    {item.text}
                  </NavLink>
                  {item.dropdown && isDropdownOpen && (
                    <ul className="absolute left-0 mt-4 w-60 bg-white py-2">
                      {item.dropdown.map(subItem => (
                        <li
                          key={subItem.id}
                          className="p-2 text-[#02002E] first:border-b-2 hover:text-[#FF0000]"
                        >
                          <NavLink to={subItem.path}>{subItem.text}</NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
          {/* <NavLink
            to="/"
            className="flex items-center py-2 px-1 md:mr-auto mx-auto md:mx-0 "
          >
            <div
              className={`px-2 p-1 rounded-lg  font-medium flex gap-2 bg-[#DDE3F0] " text-[#1A439A] ${
                !backHandler && "ml-12"
              }`}
            >
              <MdHomeFilled  size={22} />
              <a>Home</a>
            </div>
          </NavLink> */}
          <div
            id="notification-icon"
            className="relative mx-1 cursor-pointer rounded-xl p-1 text-[16px] font-semibold text-[#02002E] duration-300 hover:text-[#FF0000] md:text-[12px] lg:text-[16px]"
          >
            {authenticated && (
              <span className="relative inline-block">
                <div
                  onClick={toggleNotification}
                  className="flex cursor-pointer items-center justify-center rounded-full bg-[#FFFFFF] p-1.5 opacity-75"
                >
                  <FaRegBell
                    className="h-5 w-5 max-lg:h-4 max-lg:w-4"
                    color="#1A439A"
                  />
                </div>

                {unReadedNotifications && (
                  <span className="absolute right-1 top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-500"></span>
                )}
              </span>
            )}

            <div className="absolute right-2 top-10 mt-2 w-[450px] rounded-lg shadow-lg">
              <HeaderNotification
                setUnReadedNotifications={setUnReadedNotifications}
                whichUser={role}
                isNotificationOpen={isNotificationOpen}
                setNotificationOpen={setNotificationOpen}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {signedIn && authenticated ? (
            <div className="relative px-1 pr-8">
              <button
                type="button"
                className="focus:none flex text-sm"
                id="user-menu-button"
                aria-expanded={isOpen}
                onClick={toggleMenu}
              >
                {/* <div className=" font-semibold mt-3">
                  <span className="mx-2 text-[#1A439A] ml-1 max-sm:text-[6.5px] text-[8px]">
                    {user?.role}
                  </span>
                </div> */}
                <img
                  className="h-10 w-10 rounded-full"
                  src={user?.image || userIcon}
                  alt="user photo"
                />
              </button>
              {isOpen && (
                <>
                  <div
                    aria-hidden="true"
                    className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-black bg-opacity-5"
                    onClick={() => setIsOpen(false)}
                  />
                  <div
                    className="w-70 absolute right-0 z-50 mt-2 divide-y divide-gray-100 rounded-lg bg-white py-2 shadow"
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
                          <div className="text-[12px] font-normal text-gray-900">
                            {`${user?.first_name} ${user?.last_name}`}
                          </div>
                          <div className="text-[12px] font-normal text-gray-900">
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
                        <li>
                          <a
                            // href="/profile"
                            onClick={() => {
                              navigate('/profile');
                            }}
                            className="flex items-center px-4 py-2 text-sm text-[#929292] hover:bg-gray-100"
                          >
                            <FaRegUser />
                            <span className="mx-2">{'Profile'}</span>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-sm text-[#929292] hover:bg-gray-100"
                          >
                            <IoIosLogIn size={16} />
                            <span className="mx-2">{'Sign out'}</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
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
        </div>

        <ul
          className={
            nav
              ? 'fixed left-0 top-0 h-full w-[80%] border-r border-r-gray-50 bg-white duration-500 ease-in-out md:hidden'
              : 'fixed bottom-0 left-[-100%] top-0 w-[60%] duration-500 ease-in-out'
          }
        >
          <div className="flex items-center justify-between px-4 py-3">
            <NavLink to="/" className="flex items-center">
              <img
                src={Logo}
                alt="Logo"
                className="mr-2 max-sm:w-[170px] md:h-[50px] md:w-[150px] lg:h-[66px] lg:w-[190px] xl:w-[100%]"
              />
            </NavLink>
            <button
              onClick={() => setNav(false)}
              className="text-xl font-semibold text-black"
            >
              &#x2715;
            </button>
          </div>
          {navItems.map(item => (
            <li
              key={item.id}
              className="relative mx-1 cursor-pointer rounded-xl p-4 text-[16px] font-semibold text-[#02002E] duration-300 hover:text-[#FF0000] md:text-[12px] lg:text-[16px]"
            >
              <NavLink
                to={item.path}
                onClick={() => {
                  if (item.dropdown) {
                    toggleDropdown();
                  }
                }}
              >
                {item.text}
              </NavLink>
              {item.dropdown && isDropdownOpen && (
                <ul className="absolute left-0 z-50 mt-2 w-60 rounded-lg bg-white py-2 shadow-lg">
                  {item.dropdown.map(subItem => (
                    <li
                      key={subItem.id}
                      className="p-2 text-[#02002E] first:border-b-2 hover:text-[#FF0000]"
                    >
                      <NavLink to={subItem.path}>{subItem.text}</NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
