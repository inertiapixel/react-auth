'use client';

import { useEffect, ComponentType, ReactNode, useRef } from 'react';
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

    // ❗ Capture the path before redirect — only once
    const originalPathRef = useRef<string | null>(null);
    if (!originalPathRef.current && pathname !== '/login') {
      originalPathRef.current = pathname;
    }

    useEffect(() => {
      if (!loading && isLoaded) {
        if (options?.requireAuth && !isAuthenticated) {
          const redirectPath = encodeURIComponent(originalPathRef.current || '/');
          router.replace(`/login?redirectTo=${redirectPath}`);
        }

        if (options?.redirectIfAuthenticated && isAuthenticated) {
          router.replace('/');
        }
      }
    }, [isAuthenticated, loading, isLoaded]);

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