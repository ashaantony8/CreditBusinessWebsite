import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { authSelector } from '../store/auth/userSlice';
import { PermittedRoutes } from '../utils/constants';
import useAuth from '../utils/hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { role } = useSelector(authSelector);
  const location = useLocation();

  const { authenticated } = useAuth();
  const [isOffline, setIsOffline] = useState(false);

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

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-80 rounded-lg bg-white p-6 text-center shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {'Connection Error'}
          </h2>
          <p className="mb-6 text-gray-600">
            {
              'No internet connection detected. Please check your connection and'
            }
            {'try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer rounded-md bg-[#1A439A] px-4 py-2 text-white transition"
          >
            {'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (!authenticated || !isRoutePermitted(role, location.pathname)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
