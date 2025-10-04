import { Reflector } from '@nestjs/core';
import { UserRole } from '@shared/types/user-management';

export const Roles = Reflector.createDecorator<UserRole[]>();
