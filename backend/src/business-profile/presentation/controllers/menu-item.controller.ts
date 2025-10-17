import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { MenuItemService } from '../../application/services/menu-item.service';
import { ClerkAuthGuard } from '../../../shared/guards/clerk-auth-guard';
import { MenuItem } from '../../infrastructure/schemas/menu-item.schema';
import { Request } from 'express';
import { AuthenticatedUser, UserRole } from '@shared/types/user-management';

@Controller('business/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  async createMenuItem(
    @Body() menuItemData: Partial<MenuItem>,
    @Req() req: Request,
  ): Promise<MenuItem> {
    const user = req.user as AuthenticatedUser;
    if (!user) throw new Error('Authenticated User not found');
    
    // Ensure only business users can create menu items
    if (user.role !== UserRole.BUSINESS_OWNER && user.role !== UserRole.CONTENT_MANAGER) {
      throw new Error('Insufficient permissions to create menu items');
    }
    
    // Use the business_account_id from the authenticated user
    const businessProfileId = user.business_account_id || user._id || 'default-business';
    
    return await this.menuItemService.create({
      ...menuItemData,
      businessProfileId,
    });
  }

  @Get()
  async getMenuItems(
    @Query('businessProfileId') businessProfileId?: string,
    @Req() req?: Request,
  ): Promise<MenuItem[]> {
    let profileId = businessProfileId;
    
    // If no businessProfileId provided in query, try to get from authenticated user
    if (!profileId && req?.user) {
      const user = req.user as AuthenticatedUser;
      profileId = user.business_account_id || user._id;
    }
    
    // Default fallback for development
    if (!profileId) {
      profileId = 'default-business';
    }
    
    return await this.menuItemService.getMenuItems(profileId);
  }

  @Get(':id')
  async getMenuItem(@Param('id') id: string): Promise<MenuItem> {
    return await this.menuItemService.getMenuItem(id);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  async deleteMenuItem(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user as AuthenticatedUser;
    if (!user) throw new Error('Authenticated User not found');
    
    // Ensure only business users can delete menu items
    if (user.role !== UserRole.BUSINESS_OWNER && user.role !== UserRole.CONTENT_MANAGER) {
      throw new Error('Insufficient permissions to delete menu items');
    }
    
    await this.menuItemService.deleteMenuItem(id);
  }

  @Post(':id/like')
  async likeMenuItem(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ): Promise<MenuItem> {
    return await this.menuItemService.toggleLike(id, body.userId);
  }
}