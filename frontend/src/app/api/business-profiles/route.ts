import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// File path for persistent storage
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'business-profiles.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load data from file
async function loadBusinessProfiles(): Promise<any[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return []
  }
}

// Save data to file
async function saveBusinessProfiles(profiles: any[]): Promise<void> {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(profiles, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving business profiles:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ownerId = searchParams.get('ownerId')
  const getAllBusinesses = searchParams.get('getAllBusinesses')

  const businessProfiles = await loadBusinessProfiles()

  // If requesting all businesses for slider display
  if (getAllBusinesses === 'true') {
    // Only return businesses that have actual content (not empty profiles)
    const activeBusinesses = businessProfiles.filter(profile => 
      profile.businessName && 
      (profile.sliderImages?.length > 0 || profile.posts?.length > 0 || profile.reels?.length > 0)
    )
    
    return NextResponse.json({
      businesses: activeBusinesses.map(profile => {
        // Calculate rating from approved reviews only
        const approvedReviews = profile.ratings?.filter((r: any) => r.isApproved) || []
        return {
          id: profile.id,
          businessName: profile.businessName,
          description: profile.description || 'No description available',
          category: profile.category || 'Business',
          location: profile.location || 'Location not specified',
          coverImage: profile.coverImage || '/placeholder-business.jpg',
          rating: approvedReviews.length > 0 
            ? approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / approvedReviews.length 
            : 0,
          totalReviews: approvedReviews.length,
          sliderImages: profile.sliderImages?.filter((img: any) => img.isActive) || [],
          posts: profile.posts || [],
          reels: profile.reels || [],
          menuItems: profile.menuItems || [],
          reviews: approvedReviews || []
        }
      })
    })
  }

  if (!ownerId) {
    return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 })
  }

  // Find the specific owner's profile
  const profile = businessProfiles.find(p => p.ownerId === ownerId)
  
  if (!profile) {
    return NextResponse.json({ 
      profile: null,
      sliderImages: [],
      menuItems: [],
      posts: [],
      reels: [],
      reviews: [],
      ratings: []
    })
  }

  // Check if requesting pending reviews for approval
  const getPendingReviews = searchParams.get('getPendingReviews')
  if (getPendingReviews === 'true') {
    const pendingRatings = profile.ratings?.filter((r: any) => !r.isApproved) || []
    return NextResponse.json({
      pendingReviews: pendingRatings
    })
  }

  return NextResponse.json({
    profile,
    sliderImages: profile.sliderImages || [],
    menuItems: profile.menuItems || [],
    posts: profile.posts || [],
    reels: profile.reels || [],
    reviews: profile.reviews || [],
    ratings: profile.ratings || []
  })
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const businessProfiles = await loadBusinessProfiles()

    // Find or create profile (only for the specific owner)
    let profile = businessProfiles.find(p => p.ownerId === ownerId)
    if (!profile) {
      profile = {
        id: `business-${Date.now()}`,
        businessName: body.businessName || `Business ${businessProfiles.length + 1}`,
        ownerId,
        description: body.description || '',
        category: body.category || 'Business',
        location: body.location || '',
        coverImage: body.coverImage || '',
        sliderImages: [],
        menuItems: [],
        posts: [],
        reels: [],
        reviews: [],
        ratings: []
      }
      businessProfiles.push(profile)
    }

    // Create new item with timestamp
    const newItem = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add item to appropriate array based on type
    if (body.type === 'sliderImage') {
      profile.sliderImages.push(newItem)
    } else if (body.type === 'menuItem') {
      profile.menuItems.push(newItem)
    } else if (body.type === 'post') {
      profile.posts.push(newItem)
    } else if (body.type === 'reel') {
      profile.reels.push(newItem)
    } else if (body.type === 'rating') {
      // Only allow rating submissions from customers (not business owners)
      const submitterOwnerId = searchParams.get('submitterId')
      if (submitterOwnerId === profile.ownerId) {
        return NextResponse.json({ error: 'Business owners cannot rate their own business' }, { status: 403 })
      }
      // All customer reviews start as unapproved
      newItem.isApproved = false
      profile.ratings.push(newItem)
    } else if (body.type === 'approve-rating') {
      // Only business owner can approve ratings
      const ratingIndex = profile.ratings.findIndex((r: any) => r.id === body.ratingId)
      if (ratingIndex !== -1) {
        profile.ratings[ratingIndex].isApproved = true
        if (body.businessReply) {
          profile.ratings[ratingIndex].businessReply = body.businessReply
          profile.ratings[ratingIndex].repliedAt = new Date().toISOString()
        }
      }
    } else if (body.action === 'likeMenuItem') {
      // Handle menu item likes
      const menuItemIndex = profile.menuItems.findIndex((item: any) => item.id === body.menuItemId)
      if (menuItemIndex !== -1) {
        const menuItem = profile.menuItems[menuItemIndex]
        const likes = menuItem.likes || []
        const isLiked = likes.includes(body.userId)
        
        if (isLiked) {
          // Remove like
          menuItem.likes = likes.filter((id: string) => id !== body.userId)
          menuItem.likeCount = (menuItem.likeCount || 0) - 1
        } else {
          // Add like
          menuItem.likes = [...likes, body.userId]
          menuItem.likeCount = (menuItem.likeCount || 0) + 1
        }
        
        profile.menuItems[menuItemIndex] = menuItem
      }
    } else {
      // Update profile info
      Object.assign(profile, body)
    }

    // Save updated data to file
    await saveBusinessProfiles(businessProfiles)

    return NextResponse.json({ success: true, profile, newItem })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const businessProfiles = await loadBusinessProfiles()
    const profile = businessProfiles.find(p => p.ownerId === ownerId)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Handle rating approval updates
    if (body.action === 'approve-rating') {
      const ratingIndex = profile.ratings.findIndex((r: any) => r.id === body.ratingId)
      if (ratingIndex !== -1) {
        profile.ratings[ratingIndex].isApproved = true
        if (body.businessReply) {
          profile.ratings[ratingIndex].businessReply = body.businessReply
          profile.ratings[ratingIndex].repliedAt = new Date().toISOString()
        }
        
        // Save updated data to file
        await saveBusinessProfiles(businessProfiles)
        
        return NextResponse.json({ success: true, rating: profile.ratings[ratingIndex] })
      }
      return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }

    // Update item based on ID and type
    const updateArray = (array: any[]) => {
      const index = array.findIndex(item => item.id === body.id)
      if (index !== -1) {
        array[index] = { ...array[index], ...body, updatedAt: new Date().toISOString() }
        return array[index]
      }
      return null
    }

    let updatedItem = null
    if (body.type === 'sliderImage') {
      updatedItem = updateArray(profile.sliderImages)
    } else if (body.type === 'menuItem') {
      updatedItem = updateArray(profile.menuItems)
    } else if (body.type === 'post') {
      updatedItem = updateArray(profile.posts)
    } else if (body.type === 'reel') {
      updatedItem = updateArray(profile.reels)
    } else if (body.type === 'rating') {
      updatedItem = updateArray(profile.ratings)
    } else {
      // Update profile info
      Object.assign(profile, body)
      updatedItem = profile
    }

    if (!updatedItem && body.type) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Save updated data to file
    await saveBusinessProfiles(businessProfiles)

    return NextResponse.json({ success: true, profile, updatedItem })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const itemId = searchParams.get('itemId')
    const itemType = searchParams.get('itemType')
    
    if (!ownerId || !itemId || !itemType) {
      return NextResponse.json({ error: 'Owner ID, item ID, and item type are required' }, { status: 400 })
    }

    const businessProfiles = await loadBusinessProfiles()
    const profile = businessProfiles.find(p => p.ownerId === ownerId)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Delete item from appropriate array
    const deleteFromArray = (array: any[]) => {
      const index = array.findIndex(item => item.id === itemId)
      if (index !== -1) {
        return array.splice(index, 1)[0]
      }
      return null
    }

    let deletedItem = null
    if (itemType === 'sliderImage') {
      deletedItem = deleteFromArray(profile.sliderImages)
    } else if (itemType === 'menuItem') {
      deletedItem = deleteFromArray(profile.menuItems)
    } else if (itemType === 'post') {
      deletedItem = deleteFromArray(profile.posts)
    } else if (itemType === 'reel') {
      deletedItem = deleteFromArray(profile.reels)
    } else if (itemType === 'rating') {
      deletedItem = deleteFromArray(profile.ratings)
    }

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Save updated data to file
    await saveBusinessProfiles(businessProfiles)

    return NextResponse.json({ success: true, deletedItem })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}