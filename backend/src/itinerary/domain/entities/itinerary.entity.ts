import { Day } from '../value-objects/itinerary/day.vo';

export class Itinerary {
  constructor(
    public readonly title: string,
    public readonly summary: string,
    public readonly days: Day[],
    public readonly accommodation: string,
    public readonly tips: string[],
    public readonly id?: string,
  ) {
    this.id = id;
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Itinerary title is required');
    }
    if (!this.summary || this.summary.trim().length === 0) {
      throw new Error('Itinerary summary is required');
    }
    if (!this.days || this.days.length === 0) {
      throw new Error('At least one day is required in the itinerary');
    }
    if (!this.accommodation || this.accommodation.trim().length === 0) {
      throw new Error('Accommodation recommendation is required');
    }
    if (!this.tips || this.tips.length === 0) {
      throw new Error('At least one tip is required');
    }
  }

  // private validateDayNumbers(): void {
  //   const dayNumbers = this.days.map((day) => day.dayNumber);
  //   const expectedDayNumbers = Array.from(
  //     { length: this.days.length },
  //     (_, i) => i + 1,
  //   );

  //   if (JSON.stringify(dayNumbers) !== JSON.stringify(expectedDayNumbers)) {
  //     throw new Error('Day numbers must be consecutive starting from 1');
  //   }
  // }

  getTotalDays(): number {
    return this.days.length;
  }

  getTotalActivities(): number {
    return this.days.reduce(
      (total, day) => total + day.getTotalActivities(),
      0,
    );
  }

  getDayByNumber(dayNumber: number): Day | undefined {
    return this.days.find((day) => day.dayNumber === dayNumber);
  }

  hasDestination(destination: string): boolean {
    return this.days.some(
      (day) => day.destination.toLowerCase() === destination.toLowerCase(),
    );
  }

  updateAccommodation(newAccommodation: string): Itinerary {
    return new Itinerary(
      this.title,
      this.summary,
      this.days,
      newAccommodation,
      this.tips,
    );
  }

  addTip(newTip: string): Itinerary {
    return new Itinerary(
      this.title,
      this.summary,
      this.days,
      this.accommodation,
      [...this.tips, newTip],
    );
  }

  equals(other: Itinerary): boolean {
    return this.id === other.id;
  }

  toString(): string {
    return `Itinerary: ${this.title} (${this.getTotalDays()} days, ${this.getTotalActivities()} activities)`;
  }
}
