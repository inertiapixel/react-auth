import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

type AuthRedirectOptions = {
  redirectIfNotAuthenticated?: string; // default: '/login'
  redirectIfAuthenticated?: string;   // default: '/' should redirect to home by default
};

export const useAuthRedirect = ({
  redirectIfNotAuthenticated = '/login',
  redirectIfAuthenticated = '/',
}: AuthRedirectOptions = {}) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push(`${redirectIfNotAuthenticated}?redirectTo=${pathname}`);
    }

    if (isAuthenticated && redirectIfAuthenticated) {
      router.push(redirectIfAuthenticated);
    }
  }, [
    isAuthenticated,
    loading,
    pathname,
    redirectIfNotAuthenticated,
    redirectIfAuthenticated,
  ]);
};
