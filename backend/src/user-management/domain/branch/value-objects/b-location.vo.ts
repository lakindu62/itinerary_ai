export interface Coordinates {
  lat: number;
  lng: number;
}

export class BLocation {
  constructor(
    public readonly coords: Coordinates,
    public readonly address: string,
    public readonly city: string,
    public readonly country: string,
  ) {
    if (!address || !city || !country) {
      throw new Error('Address, city, and country are required for BLocation.');
    }
    if (
      !coords ||
      typeof coords.lat !== 'number' ||
      typeof coords.lng !== 'number'
    ) {
      throw new Error('Valid coordinates are required for BLocation.');
    }
  }
}
