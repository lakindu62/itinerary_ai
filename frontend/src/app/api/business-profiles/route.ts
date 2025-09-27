import { NextRequest, NextResponse } from 'next/server'

// Mock data storage (in a real app, this would be a database)
let businessProfiles: any[] = [
  {
    id: 'default-profile',
    businessName: 'Demo Restaurant',
    ownerId: 'user_123',
    sliderImages: [],
    menuItems: [],
    posts: [],
    reels: [],
    reviews: [],
    ratings: [] // New rating system
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ownerId = searchParams.get('ownerId')
  
  if (!ownerId) {
    return NextResponse.json({ error: 'Owner ID required' }, { status: 400 })
  }
  
  const profile = businessProfiles.find(p => p.ownerId === ownerId) || businessProfiles[0]
  
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
      return NextResponse.json({ error: 'Owner ID required' }, { status: 400 })
    }
    
    const body = await request.json()
    
    // Find or create profile
    let profile = businessProfiles.find(p => p.ownerId === ownerId)
    if (!profile) {
      profile = {
        id: Date.now().toString(),
        businessName: body.businessName || 'New Business',
        ownerId,
        sliderImages: [],
        menuItems: [],
        posts: [],
        reels: [],
        reviews: [],
        ratings: []
      }
      businessProfiles.push(profile)
    }
    
    // Add new item based on type
    const newItem = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (body.type === 'image') {
      profile.sliderImages.push(newItem)
    } else if (body.type === 'menu') {
      profile.menuItems.push(newItem)
    } else if (body.type === 'post') {
      profile.posts.push(newItem)
    } else if (body.type === 'reel') {
      profile.reels.push(newItem)
    } else if (body.type === 'rating') {
      profile.ratings.push(newItem)
    }
    
    return NextResponse.json({ success: true, item: newItem })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID required' }, { status: 400 })
    }
    
    const body = await request.json()
    const profile = businessProfiles.find(p => p.ownerId === ownerId)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
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
    if (body.type === 'image') {
      updatedItem = updateArray(profile.sliderImages)
    } else if (body.type === 'menu') {
      updatedItem = updateArray(profile.menuItems)
    } else if (body.type === 'post') {
      updatedItem = updateArray(profile.posts)
    } else if (body.type === 'reel') {
      updatedItem = updateArray(profile.reels)
    } else if (body.type === 'rating') {
      updatedItem = updateArray(profile.ratings)
    }
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    const body = await request.json()
    const { id: itemId, type } = body
    
    if (!ownerId || !itemId || !type) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }
    
    const profile = businessProfiles.find(p => p.ownerId === ownerId)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    // Delete from appropriate array
    if (type === 'image') {
      profile.sliderImages = profile.sliderImages.filter((item: any) => item.id !== itemId)
    } else if (type === 'menu') {
      profile.menuItems = profile.menuItems.filter((item: any) => item.id !== itemId)
    } else if (type === 'post') {
      profile.posts = profile.posts.filter((item: any) => item.id !== itemId)
    } else if (type === 'reel') {
      profile.reels = profile.reels.filter((item: any) => item.id !== itemId)
    } else if (type === 'rating') {
      profile.ratings = profile.ratings.filter((item: any) => item.id !== itemId)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}