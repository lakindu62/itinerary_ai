export class EventVenue {
  constructor(
    public id: string | null,
    public readonly businessAccountId: string,
    public venueName: string,
    public address: string,
    public city: string,
    public province: string,
    public postalCode: string,
    public country: string,
    public coordinates: [number, number],
    public capacity: number,
    public facilities: string[],
  ) {}
}
