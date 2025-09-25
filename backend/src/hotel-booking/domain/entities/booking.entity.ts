export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly roomId: string,
    public readonly hotelId: string,
    public readonly hotelOwnerId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly breakfastIncluded: boolean,
    public readonly currency: string,
    public readonly totalPrice: number,
    public readonly paymentStatus: boolean = false,
    public readonly paymentIntentId?: string,
    public readonly bookedAt: Date = new Date()
  ) {}

  static create(data: {
    userId: string;
    roomId: string;
    hotelId: string;
    hotelOwnerId: string;
    startDate: Date;
    endDate: Date;
    breakfastIncluded: boolean;
    currency: string;
    totalPrice: number;
    paymentStatus?: boolean;
    paymentIntentId?: string;
  }): Booking {
    return new Booking(
      this.generateId(),
      data.userId,
      data.roomId,
      data.hotelId,
      data.hotelOwnerId,
      data.startDate,
      data.endDate,
      data.breakfastIncluded,
      data.currency,
      data.totalPrice,
      data.paymentStatus || false,
      data.paymentIntentId
    );
  }

  private static generateId(): string {
    return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updatePaymentStatus(paymentStatus: boolean, paymentIntentId?: string): Booking {
    return new Booking(
      this.id,
      this.userId,
      this.roomId,
      this.hotelId,
      this.hotelOwnerId,
      this.startDate,
      this.endDate,
      this.breakfastIncluded,
      this.currency,
      this.totalPrice,
      paymentStatus,
      paymentIntentId,
      this.bookedAt
    );
  }

  getDurationInDays(): number {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}