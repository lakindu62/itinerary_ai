import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuItemService } from './application/services/menu-item.service';
import { MenuItemController } from './presentation/controllers/menu-item.controller';
import { MenuItemMongoRepository } from './infrastructure/repositories/menu-item.mongo.repository';
import { MenuItem, MenuItemSchema } from './infrastructure/schemas/menu-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MenuItem.name, schema: MenuItemSchema }
    ]),
  ],
  providers: [
    MenuItemMongoRepository,
    MenuItemService,
  ],
  controllers: [
    MenuItemController,
  ],
  exports: [MenuItemService],
})
export class BusinessProfileModule {}