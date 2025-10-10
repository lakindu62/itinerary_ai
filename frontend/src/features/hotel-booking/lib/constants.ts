// Hotel booking system constants
export const HOTEL_BOOKING_CONSTANTS = {
  // Current system info
  CURRENT_USER: 'NadPerz',
  CURRENT_DATE: '2025-09-25',
  CURRENT_TIME_UTC: '08:25:13',
  SYSTEM_VERSION: '1.0.0',
  
  // API Configuration
  API_TIMEOUT: 30000,
  MAX_RETRIES: 3,
  
  // File Upload Limits
  MAX_FILE_SIZE: {
    HOTEL_IMAGE: 10 * 1024 * 1024, // 10MB
    ROOM_IMAGE: 8 * 1024 * 1024,   // 8MB
    BOOKING_DOC: 5 * 1024 * 1024,  // 5MB
    USER_AVATAR: 3 * 1024 * 1024,  // 3MB
  },
  
  // Bucket Names
  BUCKETS: {
    HOTELS: 'hotel-bucket',
    ROOMS: 'room-bucket', 
    BOOKINGS: 'booking-bucket',
    USERS: 'user-bucket'
  },
  
  // Folder Structure
  FOLDERS: {
    IMAGES: 'images',
    DOCUMENTS: 'documents',
    PROFILES: 'profiles'
  },
  
  // Business Rules
  BUSINESS_RULES: {
    MIN_ROOM_PRICE: 1,
    MAX_ROOM_PRICE: 10000,
    MIN_GUESTS: 1,
    MAX_GUESTS: 20,
    MIN_BEDS: 1,
    MAX_BEDS: 10,
    MIN_BATHROOMS: 1,
    MAX_BATHROOMS: 5,
    
    // Booking rules
    MIN_BOOKING_DAYS: 1,
    MAX_BOOKING_DAYS: 365,
    ADVANCE_BOOKING_DAYS: 365,
    
    // Hotel rules
    MIN_HOTEL_NAME_LENGTH: 3,
    MAX_HOTEL_NAME_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 1000,
  },
  
  // Status Values
  STATUS: {
    HOTEL: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      MAINTENANCE: 'maintenance'
    },
    ROOM: {
      AVAILABLE: 'available',
      OCCUPIED: 'occupied',
      MAINTENANCE: 'maintenance'
    },
    BOOKING: {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      CANCELLED: 'cancelled',
      COMPLETED: 'completed'
    }
  },
  
  // UI Configuration
  UI: {
    ITEMS_PER_PAGE: 12,
    SEARCH_DEBOUNCE: 300,
    TOAST_DURATION: 3000,
    
    // Grid configurations
    HOTEL_GRID_COLS: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 3
    },
    
    ROOM_GRID_COLS: {
      MOBILE: 1,
      TABLET: 2,
      DESKTOP: 2
    }
  },
  
  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'MMM DD, YYYY',
    API: 'YYYY-MM-DD',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ'
  },
  
  // Currency
  CURRENCY: {
    DEFAULT: 'USD',
    SYMBOL: '$',
    DECIMAL_PLACES: 2
  },
  
  // Validation Messages
  VALIDATION_MESSAGES: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_DATE: 'Please enter a valid date',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type',
    MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
    MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
    MIN_VALUE: (min: number) => `Minimum value is ${min}`,
    MAX_VALUE: (max: number) => `Maximum value is ${max}`,
  }
};

// Hotel Amenity Icons
export const HOTEL_AMENITY_ICONS = {
  gym: '🏋️',
  spa: '🧘',
  restaurant: '🍽️',
  bar: '🍺',
  laundry: '🧺',
  shopping: '🛍️',
  freeParking: '🚗',
  bikeRental: '🚲',
  freeWifi: '📶',
  movieNights: '🎬',
  swimmingPool: '🏊',
  coffeeShop: '☕'
};

// Room Amenity Icons
export const ROOM_AMENITY_ICONS = {
  tv: '📺',
  freeWifi: '📶',
  airCondition: '❄️',
  balcony: '🏞️',
  roomService: '🛎️',
  soundProofed: '🔇',
  cityView: '🏙️',
  oceanView: '🌊',
  forestView: '🌲',
  mountainView: '🏔️'
};

// Room Amenities List (MISSING EXPORT)
export const ROOM_AMENITIES = [
  { key: 'freeWifi', label: 'Free WiFi', icon: ROOM_AMENITY_ICONS.freeWifi },
  { key: 'tv', label: 'TV', icon: ROOM_AMENITY_ICONS.tv },
  { key: 'airCondition', label: 'Air Conditioning', icon: ROOM_AMENITY_ICONS.airCondition },
  { key: 'balcony', label: 'Balcony', icon: ROOM_AMENITY_ICONS.balcony },
  { key: 'roomService', label: 'Room Service', icon: ROOM_AMENITY_ICONS.roomService },
  { key: 'soundProofed', label: 'Sound Proofed', icon: ROOM_AMENITY_ICONS.soundProofed },
  { key: 'cityView', label: 'City View', icon: ROOM_AMENITY_ICONS.cityView },
  { key: 'oceanView', label: 'Ocean View', icon: ROOM_AMENITY_ICONS.oceanView },
  { key: 'forestView', label: 'Forest View', icon: ROOM_AMENITY_ICONS.forestView },
  { key: 'mountainView', label: 'Mountain View', icon: ROOM_AMENITY_ICONS.mountainView }
];

// Default values
export const DEFAULT_VALUES = {
  HOTEL: {
    freeWifi: true,
    freeParking: false,
    gym: false,
    spa: false,
    restaurant: true,
    bar: false,
    laundry: true,
    shopping: false,
    bikeRental: false,
    movieNights: false,
    swimmingPool: false,
    coffeeShop: false
  },
  
  ROOM: {
    freeWifi: true,
    tv: true,
    airCondition: true,
    balcony: false,
    roomService: false,
    soundProofed: false,
    cityView: false,
    oceanView: false,
    forestView: false,
    mountainView: false,
    guestCount: 2,
    bedCount: 1,
    bathroomCount: 1,
    kingBed: 0,
    queenBed: 1,
    breakfastPrice: 0,
    roomPrice: 100
  }
};

export default HOTEL_BOOKING_CONSTANTS;