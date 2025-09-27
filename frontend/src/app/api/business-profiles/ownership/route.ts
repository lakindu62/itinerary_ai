import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'business-profiles.json')

async function loadBusinessProfiles(): Promise<any[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get('businessId')

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
  }

  try {
    const businessProfiles = await loadBusinessProfiles()
    const business = businessProfiles.find(p => p.id === businessId)
    
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      businessId: business.id,
      ownerId: business.ownerId,
      businessName: business.businessName 
    })
  } catch (error) {
    console.error('Error fetching business ownership:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}