'use client';

import { useEffect, ComponentType, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface WithAuthOptions {
  requireAuth?: boolean;
  redirectIfAuthenticated?: boolean;
  loader?: ReactNode;
}

export function withAuth<P extends { children?: ReactNode }>(
  Component: ComponentType<P>,
  options?: WithAuthOptions
): ComponentType<P> {
  const WithAuthWrapper = (props: P) => {
    const { isAuthenticated, loading, isLoaded } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!loading && isLoaded) {
        if (options?.requireAuth && !isAuthenticated) {
          const encodedPath = encodeURIComponent(pathname || '/');
          const loginUrl = `/login?redirectTo=${encodedPath}`;
          console.log('loginUrl:',loginUrl);

          if (pathname !== '/login') {
            router.replace(loginUrl); // use replace to prevent back nav to protected page
          }
        }

        if (options?.redirectIfAuthenticated && isAuthenticated) {
          router.replace('/');
        }
      }
    }, [isAuthenticated, loading, isLoaded, options, router, pathname]);

    if (!isLoaded || loading) {
      return <>{options?.loader || <p>Loading...</p>}</>;
    }

    return <Component {...props} />;
  };

  return WithAuthWrapper;
}


/*

Usage Example

For a protected page:

import { withAuth } from '@inertiapixel/react-auth';

function DashboardPage() {
  return <div>Welcome to your dashboard!</div>;
}

export default withAuth(DashboardPage, { requireAuth: true });

=========

For a login page that redirects if already authenticated:

import { withAuth } from '@inertiapixel/react-auth';

function LoginPage() {
  return <div>Login Form</div>;
}

export default withAuth(LoginPage, { redirectIfAuthenticated: true });

*/