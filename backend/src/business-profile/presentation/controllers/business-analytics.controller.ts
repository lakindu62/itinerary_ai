import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

export interface BusinessAnalytics {
  totalViews: number;
  totalPosts: number;
  totalVideos: number;
  totalMenuItems: number;
  recentVisits: number;
}

@Controller('business/analytics')
@UseGuards(JwtAuthGuard)
export class BusinessAnalyticsController {
  @Get()
  async getAnalytics(
    @CurrentUser('businessProfileId') businessProfileId: string,
  ): Promise<BusinessAnalytics> {
    // Mock analytics data - replace with actual analytics service
    return {
      totalViews: 0,
      totalPosts: 0,
      totalVideos: 0,
      totalMenuItems: 0,
      recentVisits: 0,
    };
  }
}