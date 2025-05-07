'use client';

import {
  createContext,
  useState,
  useEffect,
  FC,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import { loginRequest } from '../utils/authClient';
import {
  AuthContextType,
  AuthProviderProps,
  User,
  AuthResponse,
  LoginPayload,
} from '../types';
import { API_BASE_URL } from '../utils/config';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children, config }) => {
  const tokenKey = config?.tokenKey || 'token';
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const decodeUserFromToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload as User;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = getToken(tokenKey);
    if (token) {
      const decodedUser = decodeUserFromToken(token);
      setUser(decodedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [tokenKey]);

  const login = async (credentials: LoginPayload): Promise<void> => {
    setLoginError(null);

    try {
      // Validate credentials
      if ('password' in credentials && !credentials.password) {
        throw new Error('Password is required.');
      }
      if ('otp' in credentials && !credentials.otp) {
        throw new Error('OTP is required.');
      }

      const response: AuthResponse = await loginRequest(credentials);

      if (!response.accessToken) {
        throw new Error('Access token missing in response.');
      }

      setToken(tokenKey, response.accessToken);

      const decodedUser = decodeUserFromToken(response.accessToken);
      setUser(decodedUser || response.user || null);
      setIsAuthenticated(true);

      if (config?.onLoginSuccess) config.onLoginSuccess(decodedUser);

      const redirectUrl = searchParams.get('redirectTo');
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (config?.redirectTo) {
        router.push(config.redirectTo);
      }

    } catch (error) {
      setIsAuthenticated(false);
      const message = error instanceof Error ? error.message : 'Login failed';
      setLoginError(message);
      if (config?.onLoginFail) config.onLoginFail(message);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = getToken(tokenKey);
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }

    removeToken(tokenKey);
    setUser(null);
    setIsAuthenticated(false);

    if (config?.onLogout) config.onLogout();

    const redirectUrl = config?.redirectAfterLogout || config?.redirectTo;
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, loginError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
