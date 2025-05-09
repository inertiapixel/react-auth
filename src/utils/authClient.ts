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
  return new Promise<AuthResponse>((resolve, reject) => {
    const oauthWindow = window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/${payload.provider}`,
      '_blank',
      'width=500,height=600'
    );

    const messageListener = async (event: MessageEvent) => {
      // You may want to verify event.origin here for security
      if (event.data?.accessToken) {
        try {
          const user = parseToken(event.data.accessToken);
          resolve({
            isAuthenticated: true,
            accessToken: event.data.accessToken,
            message: 'Login successful',
            user,
          });
        } catch (err) {
          reject(err);
        } finally {
          window.removeEventListener('message', messageListener);
          oauthWindow?.close();
        }
      }
    };

    window.addEventListener('message', messageListener);

    // Optional: timeout or cancel logic
  });
};


export const loginWithOTP = async (payload: OTPPayload): Promise<AuthResponse> => {
  const data = await api.post<{ accessToken: string; message: string }>('/auth/otp/verify', payload);
  const user = parseToken(data.accessToken);
  return { isAuthenticated: true, accessToken: data.accessToken, message: data.message, user };
};
