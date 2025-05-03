import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export const SignedIn = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return isAuthenticated ? <>{children}</> : null;
};

/*
Usage
// pages/_app.tsx
import { AppProps } from 'next/app';
import { AuthProvider, SignedIn } from '@inertiapixel/react-auth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider config={{ tokenKey: 'my_token', redirectTo: '/dashboard' }}>
      <SignedIn>
        <p>You are signed in</p>
      </SignedIn>
      <SignedIn>
        <p>You are signed out</p>
      </SignedIn>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
*/