export class Activity {
  constructor(
    public readonly time: string,
    public readonly name: string,
    public readonly description: string,
    public readonly address: string,
    public readonly type: string,
    public readonly coordinates: [number, number], // [longitude, latitude]
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.time || !this.time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      throw new Error('Invalid time format. Use HH:MM format.');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Activity name is required');
    }
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Activity description is required');
    }
    if (!this.address || this.address.trim().length === 0) {
      throw new Error('Activity address is required');
    }
    if (!this.type || this.type.trim().length === 0) {
      throw new Error('Activity type is required');
    }
    if (!this.coordinates || this.coordinates.length !== 2) {
      throw new Error('Invalid coordinates format');
    }
    const [lng, lat] = this.coordinates;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new Error('Invalid coordinate values');
    }
  }

  equals(other: Activity): boolean {
    return (
      this.time === other.time &&
      this.name === other.name &&
      this.description === other.description &&
      this.address === other.address &&
      this.type === other.type &&
      this.coordinates[0] === other.coordinates[0] &&
      this.coordinates[1] === other.coordinates[1]
    );
  }

  isMorningActivity(): boolean {
    const hour = parseInt(this.time.split(':')[0], 10);
    return hour >= 6 && hour < 12;
  }

  isAfternoonActivity(): boolean {
    const hour = parseInt(this.time.split(':')[0], 10);
    return hour >= 12 && hour < 18;
  }

  isEveningActivity(): boolean {
    const hour = parseInt(this.time.split(':')[0], 10);
    return hour >= 18 || hour < 6;
  }

  toString(): string {
    return `${this.time} - ${this.name} (${this.type}) at ${this.address}`;
  }
}
