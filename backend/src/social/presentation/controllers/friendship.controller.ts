// friendship.controller.ts

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SendFriendRequestDto } from 'src/social/application/dtos/send-friend-request.dto';
import { RespondFriendRequestDto } from 'src/social/application/dtos/respond-friend-request.dto';
import { FriendshipWithOtherUserDto } from 'src/social/application/dtos/friendship-response.dto';
import { FriendshipService } from 'src/social/application/services/friendship.service';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';

/**
 * Controller for handling friendship-related HTTP requests.
 * All endpoints require Clerk authentication.
 * Provides endpoints for managing friend requests and friendships.
 */
@Controller('social/friendships')
export class FriendshipController {
  private readonly logger = new Logger(FriendshipController.name);

  constructor(private readonly friendshipService: FriendshipService) {}

  /**
   * Send a friend request to another user.
   * POST /social/friendships/request
   *
   * @param body - Contains receiverId
   * @param req - Express request with authenticated user
   * @returns Created friendship entity
   */
  @UseGuards(ClerkAuthGuard)
  @Post('request')
  async sendFriendRequest(
    @Body() body: SendFriendRequestDto,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const requesterId = req.user._id;

    this.logger.log(`POST /friendships/request`, {
      requesterId,
      receiverId: body.receiverId,
      rawBody: body,
    });

    // Validate receiverId is provided
    if (!body.receiverId) {
      throw new BadRequestException('receiverId is required');
    }

    const friendship = await this.friendshipService.sendFriendRequest(
      requesterId,
      body.receiverId,
    );

    return {
      success: true,
      message: 'Friend request sent successfully',
      data: friendship,
    };
  }

  /**
   * Accept a pending friend request.
   * PATCH /social/friendships/:friendshipId/accept
   *
   * @param friendshipId - The ID of the friendship to accept
   * @param req - Express request with authenticated user
   * @returns Updated friendship entity
   */
  @UseGuards(ClerkAuthGuard)
  @Patch(':friendshipId/accept')
  async acceptFriendRequest(
    @Param('friendshipId') friendshipId: string,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`PATCH /friendships/:friendshipId/accept`, {
      userId,
      friendshipId,
    });

    const friendship = await this.friendshipService.acceptFriendRequest(
      friendshipId,
      userId,
    );

    return {
      success: true,
      message: 'Friend request accepted',
      data: friendship,
    };
  }

  /**
   * Reject a pending friend request.
   * PATCH /social/friendships/:friendshipId/reject
   *
   * @param friendshipId - The ID of the friendship to reject
   * @param req - Express request with authenticated user
   * @returns Updated friendship entity
   */
  @UseGuards(ClerkAuthGuard)
  @Patch(':friendshipId/reject')
  async rejectFriendRequest(
    @Param('friendshipId') friendshipId: string,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`PATCH /friendships/:friendshipId/reject`, {
      userId,
      friendshipId,
    });

    const friendship = await this.friendshipService.rejectFriendRequest(
      friendshipId,
      userId,
    );

    return {
      success: true,
      message: 'Friend request rejected',
      data: friendship,
    };
  }

  /**
   * Remove a friendship or cancel a pending request.
   * DELETE /social/friendships/:friendshipId
   *
   * @param friendshipId - The ID of the friendship to remove
   * @param req - Express request with authenticated user
   * @returns Success response
   */
  @UseGuards(ClerkAuthGuard)
  @Delete(':friendshipId')
  async removeFriendship(
    @Param('friendshipId') friendshipId: string,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`DELETE /friendships/:friendshipId`, {
      userId,
      friendshipId,
    });

    await this.friendshipService.removeFriendship(friendshipId, userId);

    return {
      success: true,
      message: 'Friendship removed successfully',
    };
  }

  /**
   * Get all friends of the authenticated user.
   * GET /social/friendships
   *
   * @param req - Express request with authenticated user
   * @returns Array of friendship entities with user info
   */
  @UseGuards(ClerkAuthGuard)
  @Get()
  async getFriends(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`GET /friendships`, { userId });

    const friends = await this.friendshipService.getFriendsWithUserInfo(userId);

    // Transform friendships to include otherUser field for frontend
    const transformedFriends = FriendshipWithOtherUserDto.fromEntities(
      friends,
      userId,
    );

    return {
      success: true,
      data: transformedFriends,
      count: transformedFriends.length,
    };
  }

  /**
   * Get all pending friend requests received by the authenticated user.
   * GET /social/friendships/pending/received
   *
   * @param req - Express request with authenticated user
   * @returns Array of pending friendship entities with sender info
   */
  @UseGuards(ClerkAuthGuard)
  @Get('pending/received')
  async getPendingReceivedRequests(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`GET /friendships/pending/received`, { userId });

    const requests =
      await this.friendshipService.getPendingReceivedRequestsWithUserInfo(
        userId,
      );

    // Transform requests to include otherUser field for frontend
    const transformedRequests = FriendshipWithOtherUserDto.fromEntities(
      requests,
      userId,
    );

    return {
      success: true,
      data: transformedRequests,
      count: transformedRequests.length,
    };
  }

  /**
   * Get all pending friend requests sent by the authenticated user.
   * GET /social/friendships/pending/sent
   *
   * @param req - Express request with authenticated user
   * @returns Array of pending friendship entities with receiver info
   */
  @UseGuards(ClerkAuthGuard)
  @Get('pending/sent')
  async getPendingSentRequests(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`GET /friendships/pending/sent`, { userId });

    const requests =
      await this.friendshipService.getPendingSentRequestsWithUserInfo(userId);

    // Transform requests to include otherUser field for frontend
    const transformedRequests = FriendshipWithOtherUserDto.fromEntities(
      requests,
      userId,
    );

    return {
      success: true,
      data: transformedRequests,
      count: transformedRequests.length,
    };
  }

  /**
   * Get friendship status between authenticated user and another user.
   * GET /social/friendships/status/:userId
   *
   * @param userId - The ID of the other user
   * @param req - Express request with authenticated user
   * @returns Friendship status response
   */
  @UseGuards(ClerkAuthGuard)
  @Get('status/:userId')
  async getFriendshipStatus(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const currentUserId = req.user._id;

    this.logger.log(`GET /friendships/status/:userId`, {
      currentUserId,
      targetUserId: userId,
    });

    const status = await this.friendshipService.getFriendshipStatus(
      currentUserId,
      userId,
    );

    return {
      success: true,
      data: status,
    };
  }

  /**
   * Get the count of friends for the authenticated user.
   * GET /social/friendships/count
   *
   * @param req - Express request with authenticated user
   * @returns Friend count
   */
  @UseGuards(ClerkAuthGuard)
  @Get('count')
  async getFriendsCount(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`GET /friendships/count`, { userId });

    const count = await this.friendshipService.getFriendsCount(userId);

    return {
      success: true,
      data: { count },
    };
  }

  /**
   * Get the count of pending received friend requests.
   * GET /social/friendships/pending/count
   *
   * @param req - Express request with authenticated user
   * @returns Pending request count
   */
  @UseGuards(ClerkAuthGuard)
  @Get('pending/count')
  async getPendingRequestsCount(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const userId = req.user._id;

    this.logger.log(`GET /friendships/pending/count`, { userId });

    const count =
      await this.friendshipService.getPendingReceivedRequestsCount(userId);

    return {
      success: true,
      data: { count },
    };
  }
}
