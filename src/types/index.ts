import { ReactNode } from "react";

export interface User<T = unknown> {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  extra?: T;
}

export type LoginPayload =
  | {
      provider: 'credentials';
      email: string;
      password: string;
    }
  | {
      provider: 'otp';
      email: string;
      otp: string;
    }
  | {
      provider: 'google' | 'facebook' | (string & {});
      email: string;
    };

export interface AuthResponse {
  isAuthenticated: boolean;
  message: string;
  accessToken?: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  socialLogin: (payload: SocialAuthPayload) => Promise<void>;
  logout: () => void;
  loginError: string | null;
}

export interface AuthProviderProps {
  children: ReactNode;
  config?: {
    tokenKey: string;

    /**
     * Default redirect destination after login.
     * If `redirectTo` is provided, it overrides the `redirectTo` query param.
     */
    redirectTo?: string;

    /**
     * Optional redirect if already authenticated (e.g., trying to visit `/login`)
     * Defaults to `/` (home page) if not specified.
     */
    redirectIfAuthenticated?: string;

    /**
     * Optional redirect if not authenticated and accessing a protected route.
     * Defaults to `/login` if not specified.
     */
    redirectIfNotAuthenticated?: string;

    /**
     * Optional redirect destination after logout.
     * Defaults to `/login` if not specified.
     */
    redirectAfterLogout?: string;

    onLoginSuccess?: (user: User | null) => void;
    onLoginFail?: (error: string) => void;
    onLogout?: () => void;
  };
}

export type OTPPayload = {
  phone: string;
  otp: string;
};

export type SocialAuthPayload = {
  code: string;
  provider: 'google' | 'facebook' | 'github' | string;
};