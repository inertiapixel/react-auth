'use client';

import {
  createContext,
  useState,
  useEffect,
  FC,
} from 'react';
import { useRouter } from 'next/navigation';
import { getToken, setToken, removeToken } from '../utils/tokenStorage';
import { loginRequest } from '../utils/authClient';
import {
  AuthContextType,
  AuthProviderProps,
  User,
  AuthResponse,
  LoginPayload,
} from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children, config }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  // Decode user from JWT
  const decodeUserFromToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload as User;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = getToken(config.tokenKey);
    if (token) {
      const decodedUser = decodeUserFromToken(token);
      setUser(decodedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [config.tokenKey]);

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

      setToken(config.tokenKey, response.accessToken);

      const decodedUser = decodeUserFromToken(response.accessToken);
      setUser(decodedUser || response.user || null);
      setIsAuthenticated(true);

      if (config.onLoginSuccess) config.onLoginSuccess(decodedUser);
      if (config.redirectTo) setShouldRedirect(true);
    } catch (error) {
      setIsAuthenticated(false);
      const message = error instanceof Error ? error.message : 'Login failed';
      setLoginError(message);
      if (config.onLoginFail) config.onLoginFail(message);
    }
  };

  const logout = (): void => {
    removeToken(config.tokenKey);
    setUser(null);
    setIsAuthenticated(false);

    if (config.onLogout) config.onLogout();
    if (config.redirectTo) setShouldRedirect(true);
  };

  useEffect(() => {
    if (shouldRedirect && config.redirectTo) {
      router.push(config.redirectTo);
      setShouldRedirect(false);
    }
  }, [shouldRedirect, config.redirectTo, router]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, loginError }}
    >
      {children}
    </AuthContext.Provider>
  );
};
