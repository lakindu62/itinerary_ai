import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessCommentRepository } from '../../domain/repositories/business-comment.repository';
import { BusinessComment } from '../../domain/entities/business-comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

@Injectable()
export class BusinessCommentService {
  constructor(
    private readonly commentRepository: BusinessCommentRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto, businessProfileId: string): Promise<BusinessComment> {
    const commentData = {
      ...createCommentDto,
      businessProfileId,
      isApproved: false, // Comments need approval by default
    };

    return await this.commentRepository.create(commentData);
  }

  async getCommentsByBusinessId(businessProfileId: string): Promise<BusinessComment[]> {
    return await this.commentRepository.findByBusinessId(businessProfileId);
  }

  async getApprovedCommentsByBusinessId(businessProfileId: string): Promise<BusinessComment[]> {
    return await this.commentRepository.findApprovedByBusinessId(businessProfileId);
  }

  async getCommentsWithReplies(businessProfileId: string): Promise<BusinessComment[]> {
    return await this.commentRepository.getCommentsWithReplies(businessProfileId);
  }

  async getCommentById(id: string): Promise<BusinessComment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<BusinessComment> {
    const comment = await this.getCommentById(id);
    const updatedComment = await this.commentRepository.update(id, updateCommentDto);
    
    if (!updatedComment) {
      throw new NotFoundException('Comment not found after update');
    }
    
    return updatedComment;
  }

  async approveComment(id: string): Promise<BusinessComment> {
    return await this.updateComment(id, { isApproved: true });
  }

  async rejectComment(id: string): Promise<BusinessComment> {
    return await this.updateComment(id, { isApproved: false });
  }

  async deleteComment(id: string): Promise<void> {
    await this.getCommentById(id); // Verify it exists
    
    // Also delete any replies to this comment
    const replies = await this.commentRepository.findRepliesByParentId(id);
    for (const reply of replies) {
      await this.commentRepository.delete(reply.id);
    }
    
    await this.commentRepository.delete(id);
  }

  async replyToComment(parentCommentId: string, createCommentDto: CreateCommentDto, businessProfileId: string): Promise<BusinessComment> {
    // Verify parent comment exists
    await this.getCommentById(parentCommentId);

    const replyData = {
      ...createCommentDto,
      businessProfileId,
      parentCommentId,
      isApproved: true, // Replies from business owner are auto-approved
    };

    return await this.commentRepository.create(replyData);
  }

  async getCommentStats(businessProfileId: string): Promise<{
    totalComments: number;
    approvedComments: number;
    pendingComments: number;
  }> {
    const [allComments, approvedComments] = await Promise.all([
      this.commentRepository.findByBusinessId(businessProfileId),
      this.commentRepository.findApprovedByBusinessId(businessProfileId),
    ]);

    return {
      totalComments: allComments.length,
      approvedComments: approvedComments.length,
      pendingComments: allComments.length - approvedComments.length,
    };
  }
}