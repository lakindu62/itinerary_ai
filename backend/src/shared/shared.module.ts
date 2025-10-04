// shared.module.ts
import { Module, Global } from '@nestjs/common';
import { ClerkAuthGuard } from './guards/clerk-auth-guard';

@Global()
@Module({
  providers: [ClerkAuthGuard],
  exports: [ClerkAuthGuard], // Export the service to make it available
})
export class SharedModule {}
