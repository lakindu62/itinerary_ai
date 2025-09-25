export class Itinerary {
  constructor(
    public id: string,
    public title: string,
    public destination: string,
    public isActive?: boolean,
    public createdAt?: string,
    public updatedAt?: string,
  ) {}
}
