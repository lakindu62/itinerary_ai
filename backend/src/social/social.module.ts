// src/social/social.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//Posts
import { PostSchema } from './infrastructure/schemas/post.schema';
import { PostController } from './presentation/controllers/post.controller';
import { PostService } from './application/services/post.service';
import { PostRepository } from './domain/repositories/post.repository';
import { PostRepositoryImpl } from './infrastructure/repositories/post.repository.impl';

//Likes
import { LikeSchema } from './infrastructure/schemas/like.schema';
import { LikeController } from './presentation/controllers/like.controller';
import { LikeService } from './application/services/like.service';
import { LikeRepository } from './domain/repositories/like.repository';
import { LikeRepositoryImpl } from './infrastructure/repositories/like.repository.impl';

//Comments
import { CommentSchema } from './infrastructure/schemas/comment.schema';
import { CommentController } from './presentation/controllers/comment.controller';
import { CommentService } from './application/services/comment.service';
import { CommentRepository } from './domain/repositories/comment.repository';
import { CommentRepositoryImpl } from './infrastructure/repositories/comment.repository.impl';

//
import { HasFriendshipSchema } from './infrastructure/schemas/friendships.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'Like', schema: LikeSchema },
      { name: 'HasFriendship', schema: HasFriendshipSchema },
    ]),
  ],
  controllers: [PostController, LikeController, CommentController],
  providers: [
    PostService,
    LikeService,
    CommentService,
    { provide: PostRepository, useClass: PostRepositoryImpl },
    { provide: LikeRepository, useClass: LikeRepositoryImpl },
    { provide: CommentRepository, useClass: CommentRepositoryImpl },
  ],
  exports: [PostService, LikeService, CommentService],
})
export class SocialModule {}
