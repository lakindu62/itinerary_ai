import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from '../../../../shared/types/social/create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
