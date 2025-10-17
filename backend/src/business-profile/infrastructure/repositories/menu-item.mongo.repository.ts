import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from '../../infrastructure/schemas/menu-item.schema';

@Injectable()
export class MenuItemMongoRepository {
  constructor(
    @InjectModel(MenuItem.name) 
    private readonly menuItemModel: Model<MenuItemDocument>,
  ) {}

  async create(menuItemData: Partial<MenuItem>): Promise<MenuItem> {
    const menuItem = new this.menuItemModel(menuItemData);
    return await menuItem.save();
  }

  async findById(id: string): Promise<MenuItem | null> {
    return await this.menuItemModel.findById(id).exec();
  }

  async findByBusinessId(businessProfileId: string): Promise<MenuItem[]> {
    return await this.menuItemModel
      .find({ businessProfileId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCategory(businessProfileId: string, category: string): Promise<MenuItem[]> {
    return await this.menuItemModel
      .find({ businessProfileId, category })
      .sort({ name: 1 })
      .exec();
  }

  async update(id: string, data: Partial<MenuItem>): Promise<MenuItem | null> {
    return await this.menuItemModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.menuItemModel.findByIdAndDelete(id).exec();
  }

  async getCategories(businessProfileId: string): Promise<string[]> {
    const categories = await this.menuItemModel
      .distinct('category', { businessProfileId })
      .exec();
    return categories;
  }
}