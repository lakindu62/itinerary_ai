import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';

@Injectable()
export class MenuItemRepository {
  constructor(
    @InjectRepository(MenuItem)
    private readonly repository: Repository<MenuItem>,
  ) {}

  async create(item: Partial<MenuItem>): Promise<MenuItem> {
    const menuItem = this.repository.create(item);
    return await this.repository.save(menuItem);
  }

  async findById(id: string): Promise<MenuItem | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByBusinessId(businessProfileId: string): Promise<MenuItem[]> {
    return await this.repository.find({ where: { businessProfileId } });
  }

  async update(id: string, data: Partial<MenuItem>): Promise<MenuItem | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}