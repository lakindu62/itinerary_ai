import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from '@shared/types/social/create-post.dto';

/**
 * Data Transfer Object for updating posts
 * Extends CreatePostDto with PartialType to make all fields optional
 * Adds additional fields specific to update operations for media management
 *
 * Inherited fields (all optional):
 * - content?: string
 * - mediaFiles?: string[]
 * - isArchived?: boolean (Privacy: toggle archive status)
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {
  mediaFilesToAdd?: string[];
  mediaFilesToRemove?: string[];
}
