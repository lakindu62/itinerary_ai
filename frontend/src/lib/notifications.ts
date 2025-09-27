// Notification utility for review approvals
export interface NotificationData {
  userId?: string
  customerEmail: string
  customerName: string
  businessName: string
  reviewTitle: string
  isApproved: boolean
  message: string
}

export const sendReviewApprovalNotification = async (data: NotificationData) => {
  try {
    const response = await fetch('/api/notifications/review-approval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to send notification')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending review approval notification:', error)
    throw error
  }
}

export const getApprovalMessage = (isApproved: boolean, businessName: string, reviewTitle: string) => {
  if (isApproved) {
    return {
      title: '🎉 Your Review Has Been Approved!',
      message: `Great news! Your review "${reviewTitle}" for ${businessName} has been approved and is now live on our platform. Thank you for sharing your experience!`,
      type: 'success' as const
    }
  } else {
    return {
      title: '📝 Review Update',
      message: `Your review "${reviewTitle}" for ${businessName} is currently under review. Our team will get back to you soon.`,
      type: 'info' as const
    }
  }
}