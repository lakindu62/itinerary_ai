import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessReview } from '../entities/business-review.entity';

@Injectable()
export class BusinessReviewRepository {
  constructor(
    @InjectRepository(BusinessReview)
    private readonly repository: Repository<BusinessReview>,
  ) {}

  async create(review: Partial<BusinessReview>): Promise<BusinessReview> {
    const newReview = this.repository.create(review);
    return await this.repository.save(newReview);
  }

  async findById(id: string): Promise<BusinessReview | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByBusinessId(businessProfileId: string): Promise<BusinessReview[]> {
    return await this.repository.find({ 
      where: { businessProfileId },
      order: { createdAt: 'DESC' }
    });
  }

  async findApprovedByBusinessId(businessProfileId: string): Promise<BusinessReview[]> {
    return await this.repository.find({ 
      where: { businessProfileId, isApproved: true },
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: string, data: Partial<BusinessReview>): Promise<BusinessReview | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getAverageRating(businessProfileId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.businessProfileId = :businessProfileId', { businessProfileId })
      .andWhere('review.isApproved = :isApproved', { isApproved: true })
      .getRawOne();
    
    return parseFloat(result?.average) || 0;
  }
}