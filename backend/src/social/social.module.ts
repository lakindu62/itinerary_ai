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

//Friendships
import { HasFriendshipSchema } from './infrastructure/schemas/friendships.schema';
import { FriendshipRepository } from './domain/repositories/friendship.repository';
import { FriendshipRepositoryImpl } from './infrastructure/repositories/friendship.repository.impl';

//Media
import { PostMediaController } from './presentation/controllers/post-media.controller';
import { StorageModule } from 'src/shared/kernel/storage/storage.module';

//Shared (for auth and othe infra)
import { SharedModule } from 'src/shared/shared.module';

//User
import { UserManagementModule } from 'src/user-management/user-management.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'Like', schema: LikeSchema },
      { name: 'HasFriendship', schema: HasFriendshipSchema },
    ]),
    StorageModule,
    SharedModule,
    UserManagementModule,
  ],
  controllers: [
    PostController,
    LikeController,
    CommentController,
    PostMediaController,
  ],
  providers: [
    PostService,
    LikeService,
    CommentService,
    { provide: PostRepository, useClass: PostRepositoryImpl },
    { provide: LikeRepository, useClass: LikeRepositoryImpl },
    { provide: CommentRepository, useClass: CommentRepositoryImpl },
    { provide: FriendshipRepository, useClass: FriendshipRepositoryImpl },
  ],
  exports: [PostService, LikeService, CommentService],
})
export class SocialModule {}
