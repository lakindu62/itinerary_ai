export class Hotel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly image: string,
    public readonly country: string,
    public readonly state: string,
    public readonly city: string,
    public readonly locationDescription: string,
    public readonly gym: boolean = false,
    public readonly spa: boolean = false,
    public readonly bar: boolean = false,
    public readonly laundry: boolean = false,
    public readonly restaurant: boolean = false,
    public readonly shopping: boolean = false,
    public readonly freeParking: boolean = false,
    public readonly bikeRental: boolean = false,
    public readonly freeWifi: boolean = false,
    public readonly movieNights: boolean = false,
    public readonly swimmingPool: boolean = false,
    public readonly coffeeShop: boolean = false,
    public readonly addedAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(data: {
    userId: string;
    title: string;
    description: string;
    image: string;
    country: string;
    state: string;
    city: string;
    locationDescription: string;
    gym?: boolean;
    spa?: boolean;
    bar?: boolean;
    laundry?: boolean;
    restaurant?: boolean;
    shopping?: boolean;
    freeParking?: boolean;
    bikeRental?: boolean;
    freeWifi?: boolean;
    movieNights?: boolean;
    swimmingPool?: boolean;
    coffeeShop?: boolean;
  }): Hotel {
    return new Hotel(
      this.generateId(),
      data.userId,
      data.title,
      data.description,
      data.image,
      data.country,
      data.state,
      data.city,
      data.locationDescription,
      data.gym ?? false,
      data.spa ?? false,
      data.bar ?? false,
      data.laundry ?? false,
      data.restaurant ?? false,
      data.shopping ?? false,
      data.freeParking ?? false,
      data.bikeRental ?? false,
      data.freeWifi ?? false,
      data.movieNights ?? false,
      data.swimmingPool ?? false,
      data.coffeeShop ?? false
    );
  }

  private static generateId(): string {
    return `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateDetails(updates: {
    title?: string;
    description?: string;
    image?: string;
    country?: string;
    state?: string;
    city?: string;
    locationDescription?: string;
    gym?: boolean;
    spa?: boolean;
    bar?: boolean;
    laundry?: boolean;
    restaurant?: boolean;
    shopping?: boolean;
    freeParking?: boolean;
    bikeRental?: boolean;
    freeWifi?: boolean;
    movieNights?: boolean;
    swimmingPool?: boolean;
    coffeeShop?: boolean;
  }): Hotel {
    return new Hotel(
      this.id,
      this.userId,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.image ?? this.image,
      updates.country ?? this.country,
      updates.state ?? this.state,
      updates.city ?? this.city,
      updates.locationDescription ?? this.locationDescription,
      updates.gym ?? this.gym,
      updates.spa ?? this.spa,
      updates.bar ?? this.bar,
      updates.laundry ?? this.laundry,
      updates.restaurant ?? this.restaurant,
      updates.shopping ?? this.shopping,
      updates.freeParking ?? this.freeParking,
      updates.bikeRental ?? this.bikeRental,
      updates.freeWifi ?? this.freeWifi,
      updates.movieNights ?? this.movieNights,
      updates.swimmingPool ?? this.swimmingPool,
      updates.coffeeShop ?? this.coffeeShop,
      this.addedAt,
      new Date()
    );
  }
}