import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { getToken } from '../utils/tokenStorage';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, isAuthenticated, loading, loginError, login, logout } = context;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsLoaded(true);
    }
  }, [loading]);

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

Usage

import { useAuth } from '@inertiapixel/react-auth';

export default function Page() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (!isSignedIn) {
    return <p>Sign in to view this page</p>;
  }

  const fetchDataFromExternalResource = async () => {
    const token = await getToken();
    // Add logic to fetch your data with the token, e.g., from an API
    return data;
  };

  return <div>Protected Content</div>;
}


*/