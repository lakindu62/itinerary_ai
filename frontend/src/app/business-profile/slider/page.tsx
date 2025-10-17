'use client'

import dynamic from 'next/dynamic'

// Dynamically import the complete business profile page
const BusinessProfileSliderPage = dynamic(() => import('./page-complete'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">
    <div className="text-lg">Loading Business Profile Management...</div>
  </div>
})

export default function SliderPage() {
  return <BusinessProfileSliderPage />
}