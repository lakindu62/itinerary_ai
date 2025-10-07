//post.entity.ts

export class Post {
  constructor(
    public id: string,
    public user: string,
    public content?: string,
    public likeCount: number = 0,
    public commentCount: number = 0,
    public createdAt?: string,
    public updatedAt?: string,
    public image?: string, // Keep for backward compatibility
    public mediaFiles?: string[], // New field for multiple files
  ) {}
}

export interface PostUserInfo {
  _id: string;
  clerkUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
}

export class PostWithLikeStatus {
  constructor(
    public id: string,
    public user: string,
    public content?: string,
    public likeCount: number = 0,
    public commentCount: number = 0,
    public userLiked: boolean = false, // Domain property
    public createdAt?: string,
    public updatedAt?: string,
    public image?: string, // Keep for backward compatibility
    public mediaFiles?: string[], // New field for multiple files
    public userInfo?: PostUserInfo, // Populated user information
  ) {}
}

// export class PostWithLikeAndUser {
//   constructor(
//     public id: string,
//     public user: string,
//     public content?: string,
//     public likeCount: number = 0,
//     public commentCount: number = 0,
//     public userLiked: boolean = false, // Domain property
//     public createdAt?: string,
//     public updatedAt?: string,
//     public image?: string, // Keep for backward compatibility
//     public mediaFiles?: string[], // New field for multiple files
//     public userFirstName?: string,
//     public userLastName?: string,
//   ) {}
// }
