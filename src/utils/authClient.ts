'use client';
import { jwtDecode } from 'jwt-decode';
import {
    LoginPayload,
    AuthResponse,
    User
} from '../types';
import { API_BASE_URL } from './config';

export const loginRequest = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Login failed');
  }

  const data = await response.json();

  const token: string = data.accessToken;
  if (!token) throw new Error('No access token returned from server.');

  const decoded: User = jwtDecode(token);

  const user: User = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
    avatarUrl: decoded.avatarUrl
  };

  return {
    isAuthenticated: true,
    message: data.message,
    accessToken: token,
    user
  };
};
