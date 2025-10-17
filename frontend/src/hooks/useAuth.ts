import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'
import { UserType } from '@shared/types/user-management/user.types'

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const { getToken } = useClerkAuth()
  
  // Get user type from unsafe_metadata
  const userType = user?.unsafeMetadata?.userType as UserType
  const isBusinessUser = userType === UserType.BUSINESS_USER
  const isTraveller = userType === UserType.TRAVELER
  
  return {
    userId: user?.id || null,
    user,
    userType,
    isBusinessUser,
    isTraveller,
    isLoaded,
    isSignedIn,
    isAuthenticated: isLoaded && isSignedIn,
    getToken
  }
}