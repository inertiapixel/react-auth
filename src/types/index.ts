import { ReactNode } from "react";

export interface User<T = unknown> {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
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
    logout: () => void;
    loginError: string | null;
  }
  
  export interface AuthProviderProps {
    children: ReactNode;
    config: {
      tokenKey: string;
      redirectTo?: string;
      onLoginSuccess?: (user: User | null) => void;
      onLoginFail?: (error: string) => void;
      onLogout?: () => void;
    };
  }