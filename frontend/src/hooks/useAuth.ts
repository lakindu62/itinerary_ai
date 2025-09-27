import { useUser } from '@clerk/nextjs'

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  
  return {
    userId: user?.id || null,
    user,
    isLoaded,
    isSignedIn,
    isAuthenticated: isLoaded && isSignedIn
  }
}