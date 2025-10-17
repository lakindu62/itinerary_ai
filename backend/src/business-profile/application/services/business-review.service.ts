import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessReviewRepository } from '../../domain/repositories/business-review.repository';
import { BusinessReview } from '../../domain/entities/business-review.entity';
import { CreateReviewDto, UpdateReviewDto } from '../dtos/review.dto';

@Injectable()
export class BusinessReviewService {
  constructor(
    private readonly reviewRepository: BusinessReviewRepository,
  ) {}

  async createReview(createReviewDto: CreateReviewDto, businessProfileId: string): Promise<BusinessReview> {
    const reviewData = {
      ...createReviewDto,
      businessProfileId,
      isApproved: false, // Reviews need approval by default
    };

    return await this.reviewRepository.create(reviewData);
  }

  async getReviewsByBusinessId(businessProfileId: string): Promise<BusinessReview[]> {
    return await this.reviewRepository.findByBusinessId(businessProfileId);
  }

  async getApprovedReviewsByBusinessId(businessProfileId: string): Promise<BusinessReview[]> {
    return await this.reviewRepository.findApprovedByBusinessId(businessProfileId);
  }

  async getReviewById(id: string): Promise<BusinessReview> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async updateReview(id: string, updateReviewDto: UpdateReviewDto): Promise<BusinessReview> {
    const review = await this.getReviewById(id);
    const updatedReview = await this.reviewRepository.update(id, updateReviewDto);
    
    if (!updatedReview) {
      throw new NotFoundException('Review not found after update');
    }
    
    return updatedReview;
  }

  async approveReview(id: string): Promise<BusinessReview> {
    return await this.updateReview(id, { isApproved: true });
  }

  async rejectReview(id: string): Promise<BusinessReview> {
    return await this.updateReview(id, { isApproved: false });
  }

  async deleteReview(id: string): Promise<void> {
    await this.getReviewById(id); // Verify it exists
    await this.reviewRepository.delete(id);
  }

  async getBusinessRatingStats(businessProfileId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    approvedReviews: number;
  }> {
    const [allReviews, approvedReviews] = await Promise.all([
      this.reviewRepository.findByBusinessId(businessProfileId),
      this.reviewRepository.findApprovedByBusinessId(businessProfileId),
    ]);

    const averageRating = await this.reviewRepository.getAverageRating(businessProfileId);

    return {
      averageRating,
      totalReviews: allReviews.length,
      approvedReviews: approvedReviews.length,
    };
  }
}