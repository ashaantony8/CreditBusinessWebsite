import axios from 'axios';

import store from '../store';
import { onSignOutSuccess, setToken } from '../store/auth/sessionSlice';
import { refreshTokenApi } from './userServices';

type ApiParamsType = { request: object; url: string };

export const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const CreateInstance = () => {
  const state = store.getState();
  const accessToken = state.auth.session.accessToken;
  const refreshToken = state.auth.session.refreshToken;
  const apiWithHeaders = axios.create({
    baseURL: baseUrl
  });

  apiWithHeaders.interceptors.request.use(async config => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  apiWithHeaders.interceptors.response.use(async response => {
    if (response.data.status_code === 401) {
      const originalRequest = response.config;
      try {
        const response = await refreshTokenApi({ refresh: refreshToken });
        if (response.status_code === 200) {
          const newAccessToken = response.access;
          const newRefreshToken = response.refresh;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          store.dispatch(
            setToken({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken
            })
          );
          return axios(originalRequest);
        } else if (response.status_code === 422) {
          console.log('Refresh token failed');
          delete originalRequest.headers['Authorization'];
          store.dispatch(onSignOutSuccess());
        }
      } catch (refreshError) {
        console.log('Refresh token failed', refreshError);
        delete originalRequest.headers['Authorization'];
        store.dispatch(onSignOutSuccess());
      }
    }
    return response;
  });

  return apiWithHeaders;
};

export const Post = async ({ request, url }: ApiParamsType) => {
  const instance = CreateInstance();
  try {
    const result = await instance.post(url, request);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

export const Get = async ({ request, url }: ApiParamsType) => {
  const instance = CreateInstance();
  try {
    const result = await instance.get(url, request);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

export const Patch = async ({ request, url }: ApiParamsType) => {
  const instance = CreateInstance();
  try {
    const result = await instance.patch(url, request);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

export const Put = async ({ request, url }: ApiParamsType) => {
  const instance = CreateInstance();
  try {
    const result = await instance.put(url, request);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

export const Delete = async ({ request, url }: ApiParamsType) => {
  const instance = CreateInstance();
  try {
    const result = await instance.delete(url, { data: request });
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};
