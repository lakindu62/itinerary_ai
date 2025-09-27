import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuItemMongoRepository } from '../../infrastructure/repositories/menu-item.mongo.repository';
import { MenuItem } from '../../infrastructure/schemas/menu-item.schema';

@Injectable()
export class MenuItemService {
  constructor(private readonly menuItemRepository: MenuItemMongoRepository) {}

  async create(data: Partial<MenuItem>): Promise<MenuItem> {
    return await this.menuItemRepository.create(data);
  }

  async getMenuItems(businessProfileId: string): Promise<MenuItem[]> {
    return await this.menuItemRepository.findByBusinessId(businessProfileId);
  }

  async getMenuItem(id: string): Promise<MenuItem> {
    const menuItem = await this.menuItemRepository.findById(id);
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }
    return menuItem;
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    await this.getMenuItem(id); // Verify it exists
    const updated = await this.menuItemRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException('Failed to update menu item');
    }
    return updated;
  }

  async deleteMenuItem(id: string): Promise<void> {
    await this.getMenuItem(id); // Verify it exists
    await this.menuItemRepository.delete(id);
  }
}