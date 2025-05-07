'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthProvider';
import { useNavigation } from '../utils/useNavigation';

export const useAuth = (redirectIfNotAuthenticated = '/login') => {
  const context = useContext(AuthContext);
  const { full, previous } = useNavigation();
  const router = useRouter();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, isAuthenticated, loading, loginError, login, logout } = context;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const redirectPath = previous || full; // fallback to current if previous is null
      const redirectUrl = `${redirectIfNotAuthenticated}?redirectTo=${encodeURIComponent(redirectPath)}`;
      router.push(redirectUrl);
    } else {
      setIsLoaded(true);
    }
  }, [loading, isAuthenticated, redirectIfNotAuthenticated, router, full, previous]);

  const getToken = async () => {
    return localStorage.getItem('token') || '';
  };

  return {
    user,
    isAuthenticated,
    loading,
    isLoaded,
    getToken,
    loginError,
    login,
    logout
  };
};

/*

Usage Example:

import { useAuth } from '@inertiapixel/react-auth';

export default function ProtectedPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth('/login');

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    return <p>Sign in to view this page</p>;
  }

  const fetchDataFromExternalResource = async () => {
    const token = await getToken();
    // Fetch your data with the token, e.g., from an API
    return data;
  };

  return <div>Protected Content</div>;
}
*/
