import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/nextjs';

export interface UseAuth {
  user: { id: string; email: string; name: string } | null;
  userId: string | null;
  isAuthenticated: boolean;
  getToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuth => {
  const { isSignedIn, getToken, signOut, userId } = useClerkAuth();
  const { user } = useClerkUser();

  let userObj: { id: string; email: string; name: string } | null = null;
  if (user) {
    userObj = {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      name: user.firstName + ' ' + (user.lastName || ''),
    };
  }

  const login = async (email: string, password: string) => {
    throw new Error('Use Clerk UI for login.');
  };

  const logout = () => {
    signOut();
  };

  return {
    user: userObj,
    userId: userId ?? null,
    isAuthenticated: !!isSignedIn,
    getToken,
    login,
    logout,
  };
};