import { AuthenticatedUser } from "@shared/types/user-management";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};