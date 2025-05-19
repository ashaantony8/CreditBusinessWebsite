import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  changePasswordAPI,
  loginAPI,
  verifyOtpAPI
} from '../../api/userAuthServices';
import { userProfileApi } from '../../api/userServices';
import { RootState } from '../../store';
import {
  onSignInSuccess,
  onSignOutSuccess
} from '../../store/auth/sessionSlice';
import { setUser, userLoggedOut } from '../../store/auth/userSlice';
import { resetFundingState } from '../../store/fundingStateReducer';
import { Roles } from '../enums';

function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { accessToken, signedIn, refreshToken } = useSelector(
    (state: RootState) => state.auth.session
  );
  const [isAccessTokenExpired, setAccessTokenExpired] = useState(false);
  const [isRefreshTokenExpired, setRefreshTokenExpired] = useState(false);

  const decodeJwt = (token: string) => {
    try {
      const segments = token.split('.');
      return JSON.parse(atob(segments[1]));
    } catch {
      return false;
    }
  };

  const isExpired = (dateToCheck: number) => {
    const currentDate = dayjs();
    const providedDate = dayjs.unix(dateToCheck);
    return currentDate.isAfter(providedDate);
  };

  // const payload = decodeJwt(accessToken);
  // isAccessTokenExpired = payload ? isExpired(payload.exp) : isAccessTokenExpired;

  const fetchLead = async () => {
    try {
      const fetchCustomerApiResponse = await userProfileApi();
      if (
        fetchCustomerApiResponse.status_code >= 200 &&
        fetchCustomerApiResponse.status_code < 300
      ) {
        return fetchCustomerApiResponse?.data;
      } else {
        console.log('error');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const verifyOtp = async values => {
    const resp = await verifyOtpAPI(values);
    try {
      if (resp) {
        const token = resp.access;

        dispatch(
          onSignInSuccess({ accessToken: token, refreshToken: resp.refresh })
        );
        const data = await fetchLead();
        const payload = decodeJwt(token);
        if (payload) {
          dispatch(
            setUser({
              ...data,
              // email: payload.email,
              role: payload.role || Roles.Leads
            })
          );
        }
        return resp;
      }
    } catch (error) {
      console.log(error);
      return resp;
    }

    return resp;
  };

  const signIn = async values => {
    try {
      const resp = await loginAPI(values);
      if (resp && resp.access) {
        const token = resp.access;
        dispatch(
          onSignInSuccess({ accessToken: token, refreshToken: resp.refresh })
        );
        const payload = decodeJwt(token);
        // need to change
        if (payload) {
          const data = await fetchLead();
          dispatch(setUser(data));
        }
        return resp;
      }
      return resp;
    } catch (error) {
      return error;
    }
  };

  const changePassword = async values => {
    try {
      const resp = await changePasswordAPI(values);

      // if (resp && !resp.detail && resp.status_code == 200) {
      //   const token = resp.access;
      //   dispatch(
      //     onSignInSuccess({ accessToken: token, refreshToken: resp.refresh })
      //   );
      //   const payload = decodeJwt(token);
      //   console.log("payload", payload);

      //   if (payload && payload.role) {
      //     dispatch(
      //       setUser({
      //         // role: Roles[payload.role],
      //         role: Roles.customer,
      //         name: payload.user_id,
      //       })
      //     );
      //   }

      //   return resp;
      // }
      return resp;
    } catch (error) {
      return error;
    }
  };

  //   const signUp = async (values) => {
  //     try {
  //       const resp = await apiSignUp(values);
  //       if (resp.data) {
  //         const { token } = resp.data;
  //         dispatch(onSignInSuccess(token));
  //         if (resp.data.user) {
  //           dispatch(
  //             setUser(
  //               resp.data.user || {
  //                 avatar: "",
  //                 userName: "Anonymous",
  //                 authority: ["USER"],
  //                 email: "",
  //               }
  //             )
  //           );
  //         }
  //         const redirectUrl = query.get(REDIRECT_URL_KEY);
  //         navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
  //         return {
  //           status: "success",
  //           message: "",
  //         };
  //       }
  //     } catch (errors) {
  //       return {
  //         status: "failed",
  //         message: errors?.response?.data?.message || errors.toString(),
  //       };
  //     }
  //   };
  // const clearLocalStorageTokens = () => {
  //   localStorage.removeItem("refreshToken");
  // };

  const handleSignOut = () => {
    // clearLocalStorageTokens()
    dispatch(resetFundingState());
    dispatch(onSignOutSuccess());
    dispatch(userLoggedOut());
    navigate('/');
  };

  const signOut = async () => {
    handleSignOut();
  };

  useEffect(() => {
    if (accessToken && refreshToken) {
      const accessPayload = decodeJwt(accessToken);
      const refreshPayload = decodeJwt(refreshToken);

      if (
        accessPayload &&
        isExpired(accessPayload.exp) &&
        accessPayload &&
        !isExpired(refreshPayload.exp)
      ) {
        setAccessTokenExpired(true);
      } else if (
        accessPayload &&
        isExpired(accessPayload.exp) &&
        refreshPayload &&
        isExpired(refreshPayload.exp)
      ) {
        setAccessTokenExpired(true);
        setRefreshTokenExpired(true);
      }
    }
  }, [accessToken, refreshToken, isAccessTokenExpired]);

  return {
    authenticated:
      accessToken &&
      accessToken !== '' &&
      signedIn &&
      !isAccessTokenExpired &&
      !isRefreshTokenExpired,
    verifyOtp,
    signIn,
    // signUp,
    signOut,
    changePassword
  };
}

export default useAuth;
