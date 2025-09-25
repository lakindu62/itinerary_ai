export class EventOrganizer {
  constructor(
    public id: string | null,
    public organizerName: string,
    public contactEmail: string,
    public contactPhone: string,
    public organization: string,
    // public created_at?: string,
    // public updated_at?: string,
  ) {}
}
