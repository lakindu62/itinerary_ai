export class EventCategory {
  constructor(
    public id: string | null,
    public readonly businessAccountId: string,
    public categoryName: string,
    public description: string,
  ) {}
}