export class Comment {
  constructor(
    public id: string,
    public user: string,
    public post: string,
    public content: string,
    public createdAt?: string,
    public updatedAt?: string,
  ) {}
}

export class CommentUserInfo {
  constructor(
    public id: string,
    public name: string,
    public profilePicture?: string,
  ) {}
}

export class CommentWithUserInfo {
  constructor(
    public id: string,
    public user: string,
    public post: string,
    public content: string,
    public createdAt?: string,
    public updatedAt?: string,
    public userInfo?: CommentUserInfo,
    public isOwner?: boolean,
  ) {}
}
