export class EventVenue {
  constructor(
    public id: string | null,
    public venueName: string,
    public address: string,
    public city: string,
    public province: string,
    public postalCode: string,
    public country: string,
    public capacity: number,
    public facilities: string[],
  ) {}
}
