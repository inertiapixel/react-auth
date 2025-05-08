import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

export const parseToken = (token: string): User => {
  const decoded: User = jwtDecode(token);
  return {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
    avatar: decoded.avatar
  };
};