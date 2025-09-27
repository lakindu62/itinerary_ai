import { NextRequest, NextResponse } from 'next/server'

// Mock data storage (in a real app, this would be a database)
let businessProfiles: any[] = [
  {
    id: 'default-profile',
    businessName: 'Demo Restaurant',
    ownerId: 'user_123',
    sliderImages: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
        title: 'Restaurant Interior',
        description: 'Beautiful dining area',
        order: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    menuItems: [
      {
        id: '1',
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with herbs',
        price: 24.99,
        category: 'Main Courses',
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        isAvailable: true,
        preparationTime: 20,
        ingredients: ['Salmon', 'Herbs', 'Lemon'],
        allergens: ['Fish'],
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        calories: 350,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    posts: [
      {
        id: '1',
        title: 'Welcome to Our Restaurant',
        content: 'We are excited to serve you delicious food with fresh ingredients and amazing flavors! Our team of experienced chefs creates memorable dining experiences.',
        excerpt: 'Welcome to our amazing restaurant where taste meets quality.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        imageUrls: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
        category: 'News & Updates',
        tags: ['welcome', 'restaurant', 'food'],
        status: 'published',
        author: 'Restaurant Manager',
        views: 150,
        likes: 25,
        comments: 8,
        shares: 5,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'New Summer Menu Available',
        content: 'Check out our exciting new summer menu featuring fresh seasonal ingredients and creative dishes that will tantalize your taste buds.',
        excerpt: 'Discover our exciting new summer menu with seasonal specialties.',
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
        imageUrls: [
          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
          'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800'
        ],
        category: 'Menu Items',
        tags: ['summer', 'menu', 'seasonal'],
        status: 'published',
        author: 'Head Chef',
        views: 320,
        likes: 45,
        comments: 12,
        shares: 15,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    reels: [
      {
        id: '1',
        title: 'Fresh Pasta Making',
        description: 'Watch our chef prepare fresh pasta from scratch using traditional techniques!',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
        duration: 45,
        category: 'Food Preparation',
        hashtags: ['#pasta', '#fresh', '#cooking', '#chef'],
        isPublished: true,
        views: 890,
        likes: 67,
        comments: 23,
        shares: 31,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Behind the Kitchen',
        description: 'A glimpse into our busy kitchen during dinner service!',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        duration: 60,
        category: 'Behind the Scenes',
        hashtags: ['#kitchen', '#team', '#service'],
        isPublished: true,
        views: 445,
        likes: 34,
        comments: 11,
        shares: 8,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    reviews: [
      {
        id: '1',
        customerName: 'John Smith',
        rating: 5,
        title: 'Excellent food and service!',
        comment: 'Had an amazing dinner here. The salmon was perfectly cooked and the staff was very attentive.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isApproved: true,
        isPublic: true,
        businessReply: 'Thank you for your wonderful review!',
        repliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        helpful: 12,
        category: 'overall'
      }
    ]
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
    reviews: profile.reviews || []
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
        reviews: []
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
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}