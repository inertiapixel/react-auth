import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ProtectProps {
  fallback?: ReactNode;
  children: ReactNode;
}

export const Protect = ({ fallback = null, children }: ProtectProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/*
Usage
import { Protect } from '@inertiapixel/react-auth';

export default function ProtectPage() {
  return (
    <Protect fallback={<p>Please log in to continue.</p>}>
      <h1>This content is protected</h1>
    </Protect>
  );
}
*/