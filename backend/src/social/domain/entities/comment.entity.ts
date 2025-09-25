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
