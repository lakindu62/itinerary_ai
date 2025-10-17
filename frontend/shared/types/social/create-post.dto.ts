export class CreatePostDto {
  user: string;
  content?: string = "";
  image?: string;
  mediaFiles?: string[];
}
