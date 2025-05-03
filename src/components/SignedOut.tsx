import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export const SignedOut = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return !isAuthenticated ? <>{children}</> : null;
};

/*
Usage
// pages/_app.tsx
import { AppProps } from 'next/app';
import { AuthProvider, SignedOut } from '@inertiapixel/react-auth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider config={{ tokenKey: 'my_token', redirectTo: '/dashboard' }}>
      <SignedOut>
        <p>You are signed in</p>
      </SignedOut>
      <SignedOut>
        <p>You are signed out</p>
      </SignedOut>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
*/