export class EventOrganizer {
  constructor(
    public id: string | null,
    public readonly businessAccountId: string,
    public organizerName: string,
    public contactEmail: string,
    public contactPhone: string,
    public organization: string,
  ) {}
}
