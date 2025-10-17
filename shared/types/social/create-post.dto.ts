export class CreatePostDto {
  user: string;
  content?: string = "";
  image?: string;
  mediaFiles?: string[];
  isArchived?: boolean; // Privacy: set to true to create archived post (visible only to owner)
}
