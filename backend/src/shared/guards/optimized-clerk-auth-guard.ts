import { getAuth, createClerkClient } from '@clerk/express';
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

// Simple in-memory cache for user data (in production, consider Redis)
const userCache = new Map<string, { user: AuthenticatedUser; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

@Injectable()
export class OptimizedClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(OptimizedClerkAuthGuard.name);
  
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    try {
      const auth = getAuth(req);
      
      if (!auth.userId) {
        return false;
      }

      // Check cache first
      const cached = userCache.get(auth.userId);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        // Use cached user data
        req.user = cached.user;
        console.log('🚀 ~ OptimizedClerkAuthGuard ~ Using cached user:', auth.userId);
        return true;
      }

      // Build user from auth session (faster than DB lookup)
      const user: AuthenticatedUser = {
        clerk_id: auth.userId,
        business_account_id: auth.sessionClaims?.metadata?.business_account_id,
        branch_id: auth.sessionClaims?.metadata?.branch_id,
        _id: auth.sessionClaims?.metadata?._id,
        role: UserRole.BUSINESS_OWNER,
      };

      // Cache the user data
      userCache.set(auth.userId, { user, timestamp: now });
      
      // Clean up old cache entries periodically (every 100 requests)
      if (Math.random() < 0.01) {
        this.cleanupCache();
      }

      req.user = user;
      console.log('🔍 User authentication data:', {
        clerk_id: user.clerk_id,
        role: user.role,
        business_account_id: user.business_account_id,
        branch_id: user.branch_id,
        _id: user._id
      });
      
      return true;
    } catch (error) {
      this.logger.error('Authentication error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [userId, data] of userCache.entries()) {
      if (now - data.timestamp > CACHE_DURATION) {
        userCache.delete(userId);
      }
    }
  }

  // Static method to clear cache for a specific user (useful for logout)
  static clearUserCache(userId: string): void {
    userCache.delete(userId);
  }

  // Static method to clear all cache (useful for maintenance)
  static clearAllCache(): void {
    userCache.clear();
  }
}