export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export class BusinessAccount {
  constructor(
    public readonly id: string | undefined,
    public readonly brandName: string,
    public readonly owner: string,
    public readonly type: string,
    public readonly primaryContactNumber: string,
    public readonly legalEntityName: string,
    public readonly legalEntityAddress: string,
    public readonly legalEntitySigner: string,
    public readonly status: BusinessStatus = BusinessStatus.ACTIVE,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  public isActive(): boolean {
    return this.status === BusinessStatus.ACTIVE;
  }
}
