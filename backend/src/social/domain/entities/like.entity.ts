export class Like {
  constructor(
    public id: string,
    public user: string,
    public post: string,
    public createdAt?: string,
    public updatedAt?: string,
  ) {}
}
