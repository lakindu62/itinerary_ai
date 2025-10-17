import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessProfile, BusinessProfileSchema } from './domain/entities/business-profile.entity';
import { BusinessProfileService } from './application/services/business-profile-new.service';
import { BusinessProfileController } from './presentation/controllers/business-profile-new.controller';
import { MongoBusinessProfileRepository } from './infrastructure/repositories/mongo-business-profile.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessProfile.name, schema: BusinessProfileSchema },
    ]),
  ],
  providers: [
    {
      provide: 'IBusinessProfileRepository',
      useClass: MongoBusinessProfileRepository,
    },
    BusinessProfileService,
  ],
  controllers: [BusinessProfileController],
  exports: [BusinessProfileService],
})
export class BusinessProfileNewModule {}