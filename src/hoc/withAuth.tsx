import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { ComponentType, JSX } from 'react'

export function withAuth<T extends JSX.IntrinsicAttributes>(
  Component: ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const { isSignedIn, isLoaded } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.push('/login')
      }
    }, [isLoaded, isSignedIn])

    if (!isLoaded) return <p>Loading...</p>
    if (!isSignedIn) return null

    return <Component {...props} />
  }
}

/*

USAGE

import { withAuth } from '@inertiapixel/react-auth'

function Dashboard() {
  return <div>Welcome to your dashboard</div>
}

export default withAuth(Dashboard)


*/