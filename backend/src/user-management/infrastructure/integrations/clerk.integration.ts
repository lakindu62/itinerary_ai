import { ClerkClient, createClerkClient, User } from '@clerk/express';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

// Assume you have a Clerk client SDK imported here
// import { clerkClient } from 'clerk-sdk-node'; // Uncomment and adjust as needed

@Injectable()
export class ClerkIntegration {
  private readonly logger = new Logger(ClerkIntegration.name);
  private readonly clerkClient: ClerkClient;

  constructor(private configService: ConfigService) {
    const requiredEnvVars = ['CLERK_SECRET_KEY'];

    for (const varName of requiredEnvVars) {
      const value = this.configService.get<string>(varName);
      if (!value) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }

    this.clerkClient = createClerkClient({
      secretKey: configService.get<string>('CLERK_SECRET_KEY')!,
    });
  }

  /**
   * Updates the public metadata for a Clerk user.
   * @param userId The Clerk user ID.
   * @param metadata The metadata object to set in publicMetadata.
   */
  async updateUserPublicMetadata(
    userId: string,
    metadata: Record<string, unknown>,
  ): Promise<User> {
    // Placeholder for demonstration:
    this.logger.log(
      `Updating public metadata for user ${userId}: ${JSON.stringify(metadata)}`,
    );
    try {
      const response: User = await this.clerkClient.users.updateUserMetadata(
        userId,
        {
          publicMetadata: metadata,
        },
      );
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ ClerkIntegration ~ updateUserPublicMetadata ~ error:',
        error,
      );
      throw new Error(`Failed to update user metadata: ${error}`);
    }
  }
}
