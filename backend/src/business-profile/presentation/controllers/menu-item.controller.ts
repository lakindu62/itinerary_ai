import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MenuItemService } from '../../application/services/menu-item.service';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { MenuItem } from '../../infrastructure/schemas/menu-item.schema';

@Controller('business/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  async createMenuItem(
    @Body() menuItemData: Partial<MenuItem>,
    @CurrentUser('businessProfileId') businessProfileId: string,
  ): Promise<MenuItem> {
    return await this.menuItemService.create({
      ...menuItemData,
      businessProfileId,
    });
  }

  @Get()
  async getMenuItems(
    @CurrentUser('businessProfileId') businessProfileId: string,
  ): Promise<MenuItem[]> {
    return await this.menuItemService.getMenuItems(businessProfileId);
  }

  @Get(':id')
  async getMenuItem(@Param('id') id: string): Promise<MenuItem> {
    return await this.menuItemService.getMenuItem(id);
  }

  @Delete(':id')
  async deleteMenuItem(@Param('id') id: string): Promise<void> {
    await this.menuItemService.deleteMenuItem(id);
  }
}