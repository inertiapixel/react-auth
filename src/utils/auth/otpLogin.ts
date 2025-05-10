import { ApiClient } from '@/utils/apiClient';
import { parseToken } from '@/utils/tokenUtils';
import { AuthResponse, OTPPayload } from '@/types';

const api = new ApiClient();

export const loginWithOTP = async (payload: OTPPayload): Promise<AuthResponse> => {
  const data = await api.post<{ accessToken: string; message: string }>('/auth/otp/verify', payload);
  const user = parseToken(data.accessToken);
  return { isAuthenticated: true, accessToken: data.accessToken, message: data.message, user };
};
