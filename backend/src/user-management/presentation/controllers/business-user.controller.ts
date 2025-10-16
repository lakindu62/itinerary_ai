import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BusinessAccountService } from '../../application/services/business-account.service';

import { ZodBody } from 'src/shared/decorators/zod-body.decorator';
import {
  BusinessOnboardingSchema,
  BusinessOnboardingData,
} from '@shared/types/user-management';
import { Request } from 'express';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';

@Controller('business')
export class BusinessUserController {
  constructor(private readonly businessUserService: BusinessAccountService) {}

  @Post('/onboarding/complete')
  @UseGuards(ClerkAuthGuard)
  completeOnboarding(
    @ZodBody(BusinessOnboardingSchema) body: BusinessOnboardingData,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user) throw new Error('Authenticated User not found');
    return this.businessUserService.completeOnboarding(user, body);
  }
}
