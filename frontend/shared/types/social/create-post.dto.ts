export class CreatePostDto {
  // CHANGE: Removed user field - will be populated from authenticated request
  content?: string = "";
  image?: string;
  mediaFiles?: string[];

  // CHANGE: Internal field for service layer - not part of API contract
  user?: string; // This will be set internally by the controller
}
