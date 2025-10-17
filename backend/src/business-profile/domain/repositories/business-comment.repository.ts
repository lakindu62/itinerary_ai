import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessComment } from '../entities/business-comment.entity';

@Injectable()
export class BusinessCommentRepository {
  constructor(
    @InjectRepository(BusinessComment)
    private readonly repository: Repository<BusinessComment>,
  ) {}

  async create(comment: Partial<BusinessComment>): Promise<BusinessComment> {
    const newComment = this.repository.create(comment);
    return await this.repository.save(newComment);
  }

  async findById(id: string): Promise<BusinessComment | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByBusinessId(businessProfileId: string): Promise<BusinessComment[]> {
    return await this.repository.find({ 
      where: { businessProfileId },
      order: { createdAt: 'DESC' }
    });
  }

  async findApprovedByBusinessId(businessProfileId: string): Promise<BusinessComment[]> {
    return await this.repository.find({ 
      where: { businessProfileId, isApproved: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findRepliesByParentId(parentCommentId: string): Promise<BusinessComment[]> {
    return await this.repository.find({ 
      where: { parentCommentId },
      order: { createdAt: 'ASC' }
    });
  }

  async update(id: string, data: Partial<BusinessComment>): Promise<BusinessComment | null> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getCommentsWithReplies(businessProfileId: string): Promise<BusinessComment[]> {
    const comments = await this.repository
      .createQueryBuilder('comment')
      .where('comment.businessProfileId = :businessProfileId', { businessProfileId })
      .andWhere('comment.parentCommentId IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .getMany();

    // Get replies for each comment
    for (const comment of comments) {
      const replies = await this.findRepliesByParentId(comment.id);
      (comment as any).replies = replies;
    }

    return comments;
  }
}