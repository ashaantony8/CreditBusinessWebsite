// useBackButtonNavigation.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  addBaseRoute,
  baseRouteSliceSelector,
  resetBaseRoutes
} from '../../store/baseRouteSlice'; // Correct import

const useBackButton = () => {
  console.log('enter useBackButton ');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get the history from Redux store
  const history = useSelector(baseRouteSliceSelector);

  // Add the base route to the history when pathname changes
  useEffect(() => {
    const baseRoute = location.pathname.split('/')[1];
    const pathParts = location.pathname.split('/');

    if (baseRoute && pathParts.length > 2) {
      dispatch(addBaseRoute(`/${baseRoute}`));
    }
  }, [location.pathname, dispatch]);

  // Logic for navigating to the previous route
  const handleBackClick = () => {
    const previousRoute = history[history.history.length - 2];
    const lastRoute = history[history.history.length - 1];

    if (previousRoute) {
      navigate(previousRoute);
    } else if (lastRoute) {
      navigate(lastRoute);
    } else {
      // Fallback to browser's back action if no history exists
      navigate(-1);
    }
  };

  // Optional: Reset the history on component unmount or when needed
  useEffect(() => {
    return () => {
      dispatch(resetBaseRoutes());
    };
  }, [dispatch]);

  return {
    handleBackClick,
    history
  };
};

export default useBackButton;
