import { Activity } from './activity.vo';

export class Day {
  constructor(
    public readonly dayNumber: number,
    public readonly date: string,
    public readonly destination: string,
    public readonly activities: Activity[],
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.dayNumber < 1) {
      throw new Error('Day number must be positive');
    }
    if (!this.date || !this.isValidDate(this.date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD format.');
    }
    if (!this.destination || this.destination.trim().length === 0) {
      throw new Error('Destination is required');
    }
    if (!this.activities || this.activities.length === 0) {
      throw new Error('At least one activity is required per day');
    }
    this.validateActivityTimes();
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private validateActivityTimes(): void {
    // Check for duplicate or out-of-order times
    const times = this.activities.map((activity) => activity.time);
    const uniqueTimes = new Set(times);

    if (times.length !== uniqueTimes.size) {
      throw new Error('Duplicate activity times found in the same day');
    }

    // Optional: Validate chronological order
    const sortedTimes = [...times].sort();
    if (JSON.stringify(times) !== JSON.stringify(sortedTimes)) {
      throw new Error('Activities are not in chronological order');
    }
  }

  equals(other: Day): boolean {
    return (
      this.dayNumber === other.dayNumber &&
      this.date === other.date &&
      this.destination === other.destination &&
      this.activities.length === other.activities.length &&
      this.activities.every((activity, index) =>
        activity.equals(other.activities[index]),
      )
    );
  }

  getTotalActivities(): number {
    return this.activities.length;
  }

  getActivityByTime(time: string): Activity | undefined {
    return this.activities.find((activity) => activity.time === time);
  }

  hasActivityType(type: string): boolean {
    return this.activities.some((activity) => activity.type === type);
  }

  toString(): string {
    return `Day ${this.dayNumber} (${this.date}) in ${this.destination} - ${this.activities.length} activities`;
  }
}
