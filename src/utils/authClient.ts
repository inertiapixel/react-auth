import { ApiClient } from './apiClient';
import { parseToken } from './tokenUtils';
import { AuthResponse, LoginPayload, OTPPayload, SocialAuthPayload } from '../types';

const api = new ApiClient();

export const loginWithCredentials = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const data = await api.post<{ accessToken: string; message: string }>('/auth/login', credentials);
  const user = parseToken(data.accessToken);
  return { isAuthenticated: true, accessToken: data.accessToken, message: data.message, user };
};

export const loginWithSocial = async (payload: SocialAuthPayload): Promise<AuthResponse> => {
  const data = await api.post<{ accessToken: string; message: string }>(
    `/auth/${payload.provider}/callback`,
    { code: payload.code }
  );
  const user = parseToken(data.accessToken);
  return { isAuthenticated: true, accessToken: data.accessToken, message: data.message, user };
};

export const loginWithOTP = async (payload: OTPPayload): Promise<AuthResponse> => {
  const data = await api.post<{ accessToken: string; message: string }>('/auth/otp/verify', payload);
  const user = parseToken(data.accessToken);
  return { isAuthenticated: true, accessToken: data.accessToken, message: data.message, user };
};
