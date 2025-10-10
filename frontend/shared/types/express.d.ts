import { AuthenticatedUser } from "./user-management";


declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
