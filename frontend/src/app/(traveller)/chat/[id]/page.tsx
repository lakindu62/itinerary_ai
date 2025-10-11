import TravelChatbot from '@frontend/features/itinerary/components/TravelChatbot'
import React from 'react'

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string }>
}) {


    const { id } = await params
    const { q } = await searchParams
    console.log("🚀 ~ Page ~ q:", q)


    return (
        <TravelChatbot id={id} initialQuery={q} />

    )
}

