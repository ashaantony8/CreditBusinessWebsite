import { Post } from './axios';

const baseUrl = '/user';
const signUpAPIUrl = `${baseUrl}/signup/`;
const verifyOtpURL = `${baseUrl}/verify-otp/`;
const resendOtpURL = `${baseUrl}/resend-otp/`;
const loginAPIUrl = `${baseUrl}/login/`;
const changePasswordAPIUrl = `${baseUrl}/change_password/`;
const forGotPasswordUrl = `${baseUrl}/password_reset/`;
const reSetPasswordUrl = `${baseUrl}/password_reset/confirm/`;

type SignUpAPIType = { phone_number: string; email: string };
type VerifyOtpAPIType = { phone_number: string; otp: string };
type resendOtpAPIType = { phone_number: string };
type forGotPasswordAPIType = { email: string };
type newPasswordAPIType = { password: string; token: string };

const signUpAPI = (payload: SignUpAPIType) => {
  return Post({ url: signUpAPIUrl, request: payload });
};

const verifyOtpAPI = (payload: VerifyOtpAPIType) => {
  return Post({ url: verifyOtpURL, request: payload });
};

const resendOtpAPI = (payload: resendOtpAPIType) => {
  return Post({ url: resendOtpURL, request: payload });
};

const loginAPI = (payload: SignUpAPIType) => {
  return Post({ url: loginAPIUrl, request: payload });
};

const changePasswordAPI = (payload: SignUpAPIType) => {
  return Post({ url: changePasswordAPIUrl, request: payload });
};

const forGotPasswordAPI = (payload: forGotPasswordAPIType) => {
  return Post({ url: forGotPasswordUrl, request: payload });
};

const resetPasswordAPI = (payload: newPasswordAPIType) => {
  return Post({ url: reSetPasswordUrl, request: payload });
};

export {
  changePasswordAPI,
  forGotPasswordAPI,
  loginAPI,
  resendOtpAPI,
  resetPasswordAPI,
  signUpAPI,
  verifyOtpAPI
};
