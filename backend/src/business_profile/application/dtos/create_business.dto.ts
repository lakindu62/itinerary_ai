// ==================== BUSINESS PROFILE DTOs ====================

export class CreateBusinessProfileDto {
    business_name: string;
    business_type: string;
    email: string;
    phone: string;
    description?: string;
    logo_image?: string;
    cover_image?: string;
    owner_id: string;
  }
  
  export class UpdateBusinessProfileDto {
    business_name?: string;
    business_type?: string;
    email?: string;
    phone?: string;
    description?: string;
    logo_image?: string;
    cover_image?: string;
    active_status?: boolean;
  }
  
  export class UpdateBusinessRatingDto {
    average_rating: number;
    total_reviews: number;
  }
  
  // ==================== BUSINESS STAFF DTOs ====================
  
  export class CreateBusinessStaffDto {
    business_id: string;
    user_id: string;
    assigned_by: string;
    role?: string;
    permissions?: string;
  }
  
  export class UpdateBusinessStaffDto {
    role?: string;
    permissions?: string;
    is_active?: boolean;
  }
  
  // ==================== MENU CATEGORY DTOs ====================
  
  export class CreateMenuCategoryDto {
    business_id: string;
    category_name: string;
    display_order: number;
  }
  
  export class UpdateMenuCategoryDto {
    category_name?: string;
    display_order?: number;
    is_active?: boolean;
  }
  
  // ==================== BUSINESS LOCATION DTOs ====================
  
  export class CreateBusinessLocationDto {
    business_id: string;
    country: string;
    state: string;
    postal_code: string;
    phone?: string;
    operating_hours?: string;
    longitude?: number;
    latitude?: number;
  }
  
  export class UpdateBusinessLocationDto {
    country?: string;
    state?: string;
    postal_code?: string;
    phone?: string;
    operating_hours?: string;
    longitude?: number;
    latitude?: number;
    is_active?: boolean;
  }
  
  // ==================== BUSINESS REVIEW DTOs ====================
  
  export class CreateBusinessReviewDto {
    business_id: string;
    reviewer_id: string;
    rating: number;
    review_text?: string;
    travel_preferences?: string;
  }
  
  export class UpdateBusinessReviewDto {
    rating?: number;
    review_text?: string;
    travel_preferences?: string;
    is_active?: boolean;
  }