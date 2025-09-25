import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './application/services/user.service';
import { UserRepository } from './domain/repositories/user.repository';
import { BusinessAccountRepository } from './domain/repositories/business-account.repository';
import { BranchRepository } from './domain/repositories/branch.repository';
import { PermissionRepository } from './domain/repositories/permission.repository';
import { BranchRepositoryImpl } from './infrastructure/repositories/branch.repository.impl';
import { PermissionRepositoryImpl } from './infrastructure/repositories/permission.repository.impl';
import { BusinessAccountRepositoryImpl } from './infrastructure/repositories/business-account.repository.impl';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { UserController } from './presentation/controllers/user.controller';
import { UserSchema } from './infrastructure/schemas/user.schema';
import { BusinessAccountSchema } from './infrastructure/schemas/business-account.schema';
import { BranchSchema } from './infrastructure/schemas/branch.schema';
import { PermissionSchema } from './infrastructure/schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'BusinessAccount', schema: BusinessAccountSchema },
      { name: 'Branch', schema: BranchSchema },
      { name: 'Permission', schema: PermissionSchema },
    ]),
  ],
  providers: [
    UserService,

    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: BusinessAccountRepository,
      useClass: BusinessAccountRepositoryImpl,
    },
    {
      provide: BranchRepository,
      useClass: BranchRepositoryImpl,
    },
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryImpl,
    },
  ],
  controllers: [UserController],
  exports: [
    UserService,

    UserRepository,
    BusinessAccountRepository,
    BranchRepository,
    PermissionRepository,
  ],
})
export class UserManagementModule {}
