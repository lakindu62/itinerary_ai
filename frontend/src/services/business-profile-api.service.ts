const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api"

export interface BackendBusinessProfile {
  _id: string
  id?: string  // Backend might return id instead of _id
  businessName: string
  description: string
  ownerId: string
  location?: string
  phone?: string
  email?: string
  website?: string
  categories: string[]
  sliderImages: any[]
  videos: any[]
  posts: any[]
  reels: any[]
  menuItems: any[]
  reviews: any[]
  isActive: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export class BusinessProfileApiService {
  private static validateId(id: string, paramName: string): string {
    if (!id || id === "undefined" || id === "null") {
      console.error(`Validation failed for ${paramName}:`, id)
      console.error('Make sure the business profile API response contains the correct _id field')
      throw new Error(`Invalid ${paramName}: ${id}. Make sure the business profile is loaded properly.`)
    }
    return id
  }

  private static async fetchWithAuth<T>(
    url: string,
    options: RequestInit = {},
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<T>> {
    let authHeaders = {}
    if (getToken) {
      const token = await getToken()
      if (token) {
        authHeaders = { "Authorization": "Bearer " + token }
      }
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
      credentials: "include",
      ...options,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { error: errorText || "HTTP " + response.status }
    }

    // Handle empty responses (like 204 No Content)
    const contentLength = response.headers.get('content-length')
    if (contentLength === '0' || response.status === 204) {
      return { data: null as T }
    }

    try {
      const data = await response.json()
      return { data }
    } catch (error) {
      // Handle cases where response is not valid JSON
      console.warn('Failed to parse JSON response:', error)
      return { data: null as T }
    }
  }

  static async getAllBusinessProfiles(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{profiles: BackendBusinessProfile[], total: number}>> {
    return this.fetchWithAuth<{profiles: BackendBusinessProfile[], total: number}>(
      BACKEND_URL + "/business-profiles?page=" + page + "&limit=" + limit,
      {}
    )
  }

  static async getBusinessProfileByOwnerId(
    getTokenOrOwnerId?: (() => Promise<string | null>) | string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile[]>> {
    let ownerId: string | undefined
    let tokenFunction: (() => Promise<string | null>) | undefined
    
    if (typeof getTokenOrOwnerId === "function") {
      tokenFunction = getTokenOrOwnerId
      ownerId = undefined
    } else {
      ownerId = getTokenOrOwnerId
      tokenFunction = getToken
    }
    
    const endpoint = (ownerId && ownerId !== "undefined") 
      ? BACKEND_URL + "/business-profiles/owner/" + ownerId
      : BACKEND_URL + "/business-profiles/my-profiles"
    
    return this.fetchWithAuth<BackendBusinessProfile[]>(endpoint, {}, tokenFunction)
  }

  static async addPost(
    profileId: string,
    postData: { 
      caption: string; 
      imageUrl?: string; 
      imageUrls?: string[];
      title?: string;
      content?: string;
      category?: string;
      tags?: string[];
      isPromoted?: boolean;
    },
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/posts",
      {
        method: "POST",
        body: JSON.stringify(postData),
      },
      getToken
    )
  }

  static async deletePost(
    profileId: string,
    postId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/posts/" + postId,
      { method: "DELETE" },
      getToken
    )
  }

  static async addReel(
    profileId: string,
    reelData: { title: string; description: string; videoUrl: string; tags?: string[] },
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/reels",
      {
        method: "POST",
        body: JSON.stringify(reelData),
      },
      getToken
    )
  }

  static async deleteReel(
    profileId: string,
    reelId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/reels/" + reelId,
      { method: "DELETE" },
      getToken
    )
  }

  static async migrateReelIds(
    profileId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/migrate-reel-ids",
      { 
        method: "POST",
        body: JSON.stringify({})
      },
      getToken
    )
  }

  static async addMenuItem(
    profileId: string,
    menuData: { 
      name: string; 
      description: string; 
      price: number; 
      category: string;
      imageUrl?: string;
      isAvailable?: boolean;
      preparationTime?: number;
      ingredients?: string;
      allergens?: string[];
      isVegetarian?: boolean;
      isVegan?: boolean;
      isGlutenFree?: boolean;
      calories?: number;
    },
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/menu-items",
      {
        method: "POST",
        body: JSON.stringify(menuData),
      },
      getToken
    )
  }

  static async deleteMenuItem(
    profileId: string,
    menuItemId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/menu-items/" + menuItemId,
      { method: "DELETE" },
      getToken
    )
  }

  // Alias methods for backward compatibility
  static async removePost(
    profileId: string,
    postId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    return this.deletePost(profileId, postId, getToken)
  }

  static async removeReel(
    profileId: string,
    reelId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    return this.deleteReel(profileId, reelId, getToken)
  }

  static async removeMenuItem(
    profileId: string,
    menuItemId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    return this.deleteMenuItem(profileId, menuItemId, getToken)
  }

  static async updateMenuItem(
    profileId: string,
    menuItemId: string,
    updateData: Partial<{
      name: string;
      description: string;
      price: number;
      category: string;
      imageUrl: string;
      isAvailable: boolean;
      preparationTime: number;
      ingredients: string;
      allergens: string[];
      isVegetarian: boolean;
      isVegan: boolean;
      isGlutenFree: boolean;
      calories: number;
    }>,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    console.log('🔍 API Service: Raw input IDs:', { 
      profileId: profileId, 
      menuItemId: menuItemId,
      profileIdType: typeof profileId,
      menuItemIdType: typeof menuItemId,
      updateDataSize: JSON.stringify(updateData).length
    })
    
    const validatedProfileId = this.validateId(profileId, "profileId")
    const validatedMenuItemId = this.validateId(menuItemId, "menuItemId")
    
    console.log('🔍 API Service: Validated IDs:', { 
      profileId: validatedProfileId, 
      menuItemId: validatedMenuItemId 
    })
    
    const url = BACKEND_URL + "/business-profiles/" + validatedProfileId + "/menu-items/" + validatedMenuItemId
    console.log('🔍 API Service: Full URL:', url)
    
    return this.fetchWithAuth<BackendBusinessProfile>(
      url,
      {
        method: "PATCH",
        body: JSON.stringify(updateData),
      },
      getToken
    )
  }

  // Posts management
  static async updatePost(
    profileId: string,
    postId: string,
    updateData: any,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    const validatedPostId = this.validateId(postId, "postId")
    
    console.log('🔄 API Service: Updating post', validatedPostId, 'in profile', validatedProfileId)
    console.log('📝 API Service: Update data:', JSON.stringify(updateData, null, 2))
    
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/posts/" + validatedPostId,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
      getToken
    )
  }

  // Reels management
  static async updateReel(
    profileId: string,
    reelId: string,
    updateData: any,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    const validatedReelId = this.validateId(reelId, "reelId")
    
    console.log('🔄 API Service: Updating reel', validatedReelId, 'in profile', validatedProfileId)
    console.log('📝 API Service: Update data:', JSON.stringify(updateData, null, 2))
    
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/reels/" + validatedReelId,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
      getToken
    )
  }

  // Slider Image Management Methods
  static async addSliderImage(
    profileId: string,
    sliderImageData: {
      type: 'image'
      url: string
      filename: string
      order?: number
      title?: string
      description?: string
    },
    getToken: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, 'profileId')
    
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/slider-images",
      {
        method: "POST",
        body: JSON.stringify(sliderImageData),
      },
      getToken
    )
  }

  static async removeSliderImage(
    profileId: string,
    mediaId: string,
    getToken: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, 'profileId')
    const validatedMediaId = this.validateId(mediaId, 'mediaId')
    
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/slider-images/" + validatedMediaId,
      {
        method: "DELETE",
      },
      getToken
    )
  }

  static async getSliderImages(
    profileId: string,
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<any[]>> {
    const validatedProfileId = this.validateId(profileId, 'profileId')
    
    return this.fetchWithAuth<any[]>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId + "/slider-images",
      {
        method: "GET",
      },
      getToken
    )
  }

  // Business Profile management
  static async updateBusinessProfile(
    profileId: string,
    updateData: {
      businessName?: string;
      description?: string;
      categories?: string[];
      location?: string;
      sliderImages?: any[];
    },
    getToken?: () => Promise<string | null>
  ): Promise<ApiResponse<BackendBusinessProfile>> {
    const validatedProfileId = this.validateId(profileId, "profileId")
    
    console.log('🔄 API Service: Updating business profile', validatedProfileId)
    console.log('📝 API Service: Update data:', JSON.stringify(updateData, null, 2))
    
    return this.fetchWithAuth<BackendBusinessProfile>(
      BACKEND_URL + "/business-profiles/" + validatedProfileId,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
      getToken
    )
  }
}
