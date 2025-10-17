import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// File path for persistent storage
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'business-profiles.json')

// Load data from file
async function loadBusinessProfiles(): Promise<any[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Save data to file
async function saveBusinessProfiles(profiles: any[]): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(profiles, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving business profiles:', error)
    throw error
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, updates } = body

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
    }

    const businessProfiles = await loadBusinessProfiles()
    
    // Find the business to update
    const businessIndex = businessProfiles.findIndex((business: any) => business.id === businessId)
    
    if (businessIndex === -1) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Update business with new data while preserving important fields
    businessProfiles[businessIndex] = {
      ...businessProfiles[businessIndex],
      ...updates,
      // Preserve these important fields
      id: businessProfiles[businessIndex].id,
      ownerId: businessProfiles[businessIndex].ownerId,
      updatedAt: new Date().toISOString()
    }

    // Save updated data to file
    await saveBusinessProfiles(businessProfiles)

    return NextResponse.json({ 
      success: true, 
      business: businessProfiles[businessIndex] 
    })
  } catch (error) {
    console.error('Business update error:', error)
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 })
  }
}