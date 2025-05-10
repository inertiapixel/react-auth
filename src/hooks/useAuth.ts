'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthProvider';
import { useNavigation } from '../utils/useNavigation';

export const useAuth = (redirectIfNotAuthenticated = '/login') => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    isAuthenticated,
    loading,
    loginError,
    login,
    logout,
    socialLogin
  } = context;

  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Your custom navigation hook
  const { current, full } = useNavigation();

  useEffect(() => {
    const isOnLoginPage = current === redirectIfNotAuthenticated;
    const alreadyRedirecting = full.includes('redirectTo=');

    if (!loading && !isAuthenticated && !isOnLoginPage && !alreadyRedirecting) {
      const redirectTarget = full.startsWith(redirectIfNotAuthenticated)
        ? '/'
        : full;

      const redirectUrl = `${redirectIfNotAuthenticated}?redirectTo=${encodeURIComponent(
        redirectTarget
      )}`;
      router.push(redirectUrl);
    } else if (!loading) {
      setIsLoaded(true);
    }
  }, [loading, isAuthenticated, redirectIfNotAuthenticated, router, current, full]);

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
    logout,
    socialLogin
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
