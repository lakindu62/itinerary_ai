export class Room {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly bedCount: number = 0,
    public readonly guestCount: number = 0,
    public readonly bathroomCount: number = 0,
    public readonly kingBed: number = 0,
    public readonly queenBed: number = 0,
    public readonly image: string,
    public readonly breakfastPrice: number,
    public readonly roomPrice: number,
    public readonly roomService: boolean = false,
    public readonly tv: boolean = false,
    public readonly balcony: boolean = false,
    public readonly freeWifi: boolean = false,
    public readonly cityView: boolean = false,
    public readonly oceanView: boolean = false,
    public readonly forestView: boolean = false,
    public readonly mountainView: boolean = false,
    public readonly airCondition: boolean = false,
    public readonly soundProofed: boolean = false,
    public readonly hotelId: string
  ) {}

  static create(data: {
    title: string;
    description: string;
    bedCount?: number;
    guestCount?: number;
    bathroomCount?: number;
    kingBed?: number;
    queenBed?: number;
    image: string;
    breakfastPrice: number;
    roomPrice: number;
    roomService?: boolean;
    tv?: boolean;
    balcony?: boolean;
    freeWifi?: boolean;
    cityView?: boolean;
    oceanView?: boolean;
    forestView?: boolean;
    mountainView?: boolean;
    airCondition?: boolean;
    soundProofed?: boolean;
    hotelId: string;
  }): Room {
    return new Room(
      this.generateId(),
      data.title,
      data.description,
      data.bedCount ?? 0,
      data.guestCount ?? 0,
      data.bathroomCount ?? 0,
      data.kingBed ?? 0,
      data.queenBed ?? 0,
      data.image,
      data.breakfastPrice,
      data.roomPrice,
      data.roomService ?? false,
      data.tv ?? false,
      data.balcony ?? false,
      data.freeWifi ?? false,
      data.cityView ?? false,
      data.oceanView ?? false,
      data.forestView ?? false,
      data.mountainView ?? false,
      data.airCondition ?? false,
      data.soundProofed ?? false,
      data.hotelId
    );
  }

  private static generateId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateDetails(updates: {
    title?: string;
    description?: string;
    bedCount?: number;
    guestCount?: number;
    bathroomCount?: number;
    kingBed?: number;
    queenBed?: number;
    image?: string;
    breakfastPrice?: number;
    roomPrice?: number;
    roomService?: boolean;
    tv?: boolean;
    balcony?: boolean;
    freeWifi?: boolean;
    cityView?: boolean;
    oceanView?: boolean;
    forestView?: boolean;
    mountainView?: boolean;
    airCondition?: boolean;
    soundProofed?: boolean;
  }): Room {
    return new Room(
      this.id,
      updates.title ?? this.title,
      updates.description ?? this.description,
      updates.bedCount ?? this.bedCount,
      updates.guestCount ?? this.guestCount,
      updates.bathroomCount ?? this.bathroomCount,
      updates.kingBed ?? this.kingBed,
      updates.queenBed ?? this.queenBed,
      updates.image ?? this.image,
      updates.breakfastPrice ?? this.breakfastPrice,
      updates.roomPrice ?? this.roomPrice,
      updates.roomService ?? this.roomService,
      updates.tv ?? this.tv,
      updates.balcony ?? this.balcony,
      updates.freeWifi ?? this.freeWifi,
      updates.cityView ?? this.cityView,
      updates.oceanView ?? this.oceanView,
      updates.forestView ?? this.forestView,
      updates.mountainView ?? this.mountainView,
      updates.airCondition ?? this.airCondition,
      updates.soundProofed ?? this.soundProofed,
      this.hotelId
    );
  }

  getTotalPrice(): number {
    return this.roomPrice + this.breakfastPrice;
  }
}