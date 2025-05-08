'use client';

import { createContext, useState, useEffect, FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import { loginWithCredentials, loginWithSocial } from '../utils/authClient';
import { parseToken } from '../utils/tokenUtils';
import {
  AuthContextType,
  AuthProviderProps,
  User,
  AuthResponse,
  LoginPayload,
  SocialAuthPayload,
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

  useEffect(() => {
    const token = getToken(tokenKey);
    if (token) {
      const decodedUser = parseToken(token);
      setUser(decodedUser);
      setIsAuthenticated(!!decodedUser);
    }
    setLoading(false);
  }, [tokenKey]);

  const login = async (credentials: LoginPayload): Promise<void> => {
    setLoginError(null);
    try {
      if ('password' in credentials && !credentials.password) {
        throw new Error('Password is required.');
      }
      if ('otp' in credentials && !credentials.otp) {
        throw new Error('OTP is required.');
      }

      const response: AuthResponse = await loginWithCredentials(credentials);
      handleAuthSuccess(response);
    } catch (error) {
      handleAuthFailure(error);
    }
  };

  const socialLogin = async (payload: SocialAuthPayload): Promise<void> => {
    setLoginError(null);
    try {
      const response: AuthResponse = await loginWithSocial(payload);
      handleAuthSuccess(response);
    } catch (error) {
      handleAuthFailure(error);
    }
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    if (!response.accessToken) {
      throw new Error('Access token missing in response.');
    }

    const decodedUser = parseToken(response.accessToken);
    setToken(tokenKey, response.accessToken);
    setUser(decodedUser || response.user || null);
    setIsAuthenticated(true);
    config?.onLoginSuccess?.(decodedUser);

    const redirectUrl = searchParams.get('redirectTo') || config?.redirectTo || '/';
    router.push(redirectUrl);
  };

  const handleAuthFailure = (error: unknown) => {
    setIsAuthenticated(false);
    const message = error instanceof Error ? error.message : 'Login failed';
    setLoginError(message);
    config?.onLoginFail?.(message);
  };

  const logout = async (): Promise<void> => {
    try {
      const token = getToken(tokenKey);
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }

    removeToken(tokenKey);
    setUser(null);
    setIsAuthenticated(false);
    config?.onLogout?.();

    const redirectUrl = config?.redirectAfterLogout || config?.redirectTo;
    if (redirectUrl) router.push(redirectUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        loginError,
        socialLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
