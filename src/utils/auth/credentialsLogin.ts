import { AuthResponse, LoginPayload } from "../../types";
import { ApiClient } from "../apiClient";
import { parseToken } from "../tokenUtils";

const api = new ApiClient();

export const loginWithCredentials = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const data = await api.post<{ accessToken: string; message: string }>('/auth/login', credentials);
  const user = parseToken(data.accessToken);
  return { isAuthenticated: true, accessToken: data.accessToken, message: data.message, user };
};