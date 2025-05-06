import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthProvider';

export const useAuth = (redirectIfNotAuthenticated = '/login') => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, isAuthenticated, loading, loginError, login, logout } = context;
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const redirectUrl = `${redirectIfNotAuthenticated}?redirectTo=${window.location.pathname}`;
      router.push(redirectUrl); // Redirect to login with the current page as `redirectTo`
    } else {
      setIsLoaded(true); // Set to true once authentication state is determined
    }
  }, [loading, isAuthenticated, redirectIfNotAuthenticated, router]);

  const getToken = async () => {
    // Assuming you store the token somewhere like localStorage or a cookie
    return localStorage.getItem('token') || '';
  };

  const isSignedIn = isAuthenticated;

  return {
    user,
    isAuthenticated,
    loading,
    isLoaded,
    isSignedIn,
    getToken,
    loginError,
    login,
    logout,
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
