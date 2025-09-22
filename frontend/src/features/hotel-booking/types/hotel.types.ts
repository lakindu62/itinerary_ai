export interface Hotel {
  id: string;
  title: string;
  description: string;
  image: string;
  country: string;
  state: string;
  city: string;
  locationDescription: string;
  userId: string;
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelRequest {
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  locationDescription: string;
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeeShop: boolean;
}