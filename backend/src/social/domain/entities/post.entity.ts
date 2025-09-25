export class Post {
  constructor(
    public id: string,
    public user: string,
    public content?: string,
    public likeCount: number = 0,
    public commentCount: number = 0,
    public createdAt?: string,
    public updatedAt?: string,
  ) {}
}
