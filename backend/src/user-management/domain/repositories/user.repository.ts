import { User } from '../user/user.entity';

export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  //   abstract findById(id: string): Promise<User | null>;
  //   abstract findByClerkUserId(clerkUserId: string): Promise<User | null>;
  //   abstract findByEmail(email: string): Promise<User | null>;
  //   abstract update(id: string, updates: Partial<User>): Promise<User>;
  //   abstract delete(id: string): Promise<void>;
  //   abstract findByBusinessAccount(businessAccountId: string): Promise<User[]>;
  //   abstract findByBranch(branchId: string): Promise<User[]>;
}
