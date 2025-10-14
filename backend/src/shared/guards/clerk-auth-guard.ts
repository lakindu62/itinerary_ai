import { getAuth } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '@shared/types/user-management';
import { UserRole } from '@shared/types/user-management';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    try {
      const auth = getAuth(req);
      console.log('🚀 ~ ClerkAuthGuard ~ canActivate ~ auth:', auth);

      if (!auth.userId) {
        return false;
      }

      const user: AuthenticatedUser = {
        clerk_id: auth.userId,
        business_account_id: auth.sessionClaims?.metadata?.business_account_id,
        branch_id: auth.sessionClaims?.metadata?.branch_id,
        _id: auth.sessionClaims?.metadata?._id,
        role: (auth.sessionClaims?.metadata as any)?.role ? this.extractRole((auth.sessionClaims.metadata as any).role) : UserRole.TRAVELER,
      };
      req.user = user;

      const requiredRoles = this.reflector.get(Roles, context.getHandler());
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        throw new UnauthorizedException('You do not have permission to access this resource.');
      }

      return true;
    } catch (error) {
      this.logger.error('Authentication error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractRole(role: UserRole | undefined): UserRole {
    const validRoles = Object.values(UserRole);
    return role && validRoles.includes(role) ? role : UserRole.TRAVELER;
  }
}