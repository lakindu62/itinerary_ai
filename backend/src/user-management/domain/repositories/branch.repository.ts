import { Branch } from '../branch/branch.entity';

export abstract class BranchRepository {
  abstract save(branch: Branch): Promise<Branch>;
  //   abstract findById(id: string): Promise<Branch | null>;
  //   abstract findByBusinessAccountId(
  //     businessAccountId: string,
  //   ): Promise<Branch[]>;
  //   abstract update(id: string, updates: Partial<Branch>): Promise<Branch>;
  //   abstract delete(id: string): Promise<void>;
}
