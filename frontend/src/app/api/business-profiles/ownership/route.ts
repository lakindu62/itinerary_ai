import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('businessId')

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  try {
    // Try to get business from MongoDB backend first
    console.log('🔍 Looking up business ownership for ID:', businessId)
    
    // Fetch business profile from backend
    const backendResponse = await fetch(`${BACKEND_URL}/business-profiles/${businessId}`)
    
    if (backendResponse.ok) {
      const business = await backendResponse.json()
      console.log('✅ Found business in MongoDB:', business)
      
      return NextResponse.json({ 
        businessId: business.id,
        ownerId: business.ownerId,
        businessName: business.businessName 
      })
    }
    
    // If not found in MongoDB, check if it's a MongoDB format ID
    if (businessId.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId format, but not found
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }
    
    // Fallback to file-based system for backwards compatibility
    const { promises: fs } = require('fs')
    const path = require('path')
    const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'business-profiles.json')
    
    try {
      const data = await fs.readFile(DATA_FILE_PATH, 'utf8')
      const businessProfiles = JSON.parse(data)
      const business = businessProfiles.find((p: any) => p.id === businessId)
      
      if (!business) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 })
      }

      return NextResponse.json({ 
        businessId: business.id,
        ownerId: business.ownerId,
        businessName: business.businessName 
      })
    } catch (fileError) {
      console.log('File-based lookup also failed:', fileError)
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }
    
  } catch (error) {
    console.error('Error fetching business ownership:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}