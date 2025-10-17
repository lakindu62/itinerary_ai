import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// File path for persistent notification storage
const NOTIFICATIONS_FILE_PATH = path.join(process.cwd(), 'data', 'notifications.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(NOTIFICATIONS_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load notifications from file
async function loadNotifications(): Promise<any[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(NOTIFICATIONS_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return []
  }
}

// Save notifications to file
async function saveNotifications(notifications: any[]): Promise<void> {
  try {
    await ensureDataDirectory()
    await fs.writeFile(NOTIFICATIONS_FILE_PATH, JSON.stringify(notifications, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving notifications:', error)
    throw error
  }
}

// Send email notification (mock implementation)
async function sendEmailNotification(data: any) {
  // In a real implementation, you would integrate with an email service like:
  // - SendGrid
  // - AWS SES
  // - Nodemailer with SMTP
  
  console.log('📧 Sending email notification:', {
    to: data.customerEmail,
    subject: data.isApproved ? 'Your Review Has Been Approved!' : 'Review Status Update',
    message: data.message
  })
  
  // For now, we'll just simulate success
  return { success: true, messageId: `msg_${Date.now()}` }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerEmail, customerName, businessName, reviewTitle, isApproved, message } = body

    if (!customerEmail || !customerName || !businessName || !reviewTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create notification record
    const notification: any = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerEmail,
      customerName,
      businessName,
      reviewTitle,
      isApproved,
      message,
      sentAt: new Date().toISOString(),
      type: 'review_approval',
      status: 'pending'
    }

    // Load existing notifications
    const notifications = await loadNotifications()

    try {
      // Send email notification
      const emailResult = await sendEmailNotification(notification)
      notification.status = 'sent'
      notification.messageId = emailResult.messageId
      
      console.log('✅ Review approval notification sent successfully:', {
        customerEmail,
        businessName,
        reviewTitle,
        isApproved
      })
    } catch (emailError: any) {
      console.error('❌ Failed to send email notification:', emailError)
      notification.status = 'failed'
      notification.error = emailError?.message || 'Unknown error'
    }

    // Save notification record
    notifications.push(notification)
    await saveNotifications(notifications)

    return NextResponse.json({
      success: true,
      notification: {
        id: notification.id,
        status: notification.status,
        sentAt: notification.sentAt
      }
    })

  } catch (error) {
    console.error('Error processing review approval notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve notification history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerEmail = searchParams.get('customerEmail')
    const businessName = searchParams.get('businessName')

    const notifications = await loadNotifications()
    
    let filteredNotifications = notifications

    if (customerEmail) {
      filteredNotifications = filteredNotifications.filter(n => n.customerEmail === customerEmail)
    }

    if (businessName) {
      filteredNotifications = filteredNotifications.filter(n => n.businessName === businessName)
    }

    return NextResponse.json({
      notifications: filteredNotifications.slice(-50), // Return last 50 notifications
      total: filteredNotifications.length
    })

  } catch (error) {
    console.error('Error retrieving notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}