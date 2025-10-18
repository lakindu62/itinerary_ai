'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GradientButton } from '@/components/ui/gradient-button'
import { Paperclip, Send, UserIcon, LogOut, MapIcon, User } from 'lucide-react'
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import AuthModal from "../auth/AuthModal"
import { useRouter } from 'next/navigation'
import { ObjectId } from 'bson'

const HomePage = () => {
    const user = useUser()
    const [inputValue, setInputValue] = useState('I want to travel to kandy for a 2 day trip on  startDate "2025-10-16" endDate "2025-10-19" with 2 people for adventure')
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');

    const handleSignInClick = () => {
        setAuthMode('sign-in');
        setIsAuthDialogOpen(true);
        setIsPopoverOpen(false); // Close the popover
    };

    // "Plan Trip" handler: navigates to /chat/[id] with the initial prompt in the route state/query


    const router = useRouter();

    const handlePlanTrip = () => {
        // For demo: create a random id, pass initial prompt as query string
        const conversationId = new ObjectId().toString()
        // url-encode the prompt for safety
        const q = encodeURIComponent(inputValue || '');
        router.push(`/chat/${conversationId}?q=${q}`);
    };

    return (
        <div className="relative  min-h-screen overflow-hidden">
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/home/homepage-bg-video.mp4" type="video/mp4" />
            </video>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <header className="flex justify-between items-center p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full relative">
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-primary">Itinerary.ai</span>
                    </div>
                    <div className="flex flex-wrap absolute top-10 left-1/2 -translate-x-1/2 gap-4 mb-8">
                        <GradientButton href="/browse/itineraries">
                            Browse Itineraries
                        </GradientButton>
                        <GradientButton href="/events">
                            View Events
                        </GradientButton>
                        <GradientButton href="/hotels">
                            Hotels
                        </GradientButton>
                        <GradientButton href="/social">
                            My Socials
                        </GradientButton>
                        <GradientButton href="/business-profile">
                            Businesses
                        </GradientButton>
                    </div>
                    {/* Top Right Controls - Clerk Auth */}
                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <UserButton >
                                <UserButton.MenuItems>

                                    <UserButton.Link
                                        label="My Trips"
                                        labelIcon={<MapIcon strokeWidth={3} className="text-gray-500 w-4 h-4" />}
                                        href="/my-trips"
                                    />
                                </UserButton.MenuItems>
                                <UserButton.UserProfilePage
                                    label="Profile"
                                    url="/profile"
                                    labelIcon={<User className="w-4 h-4" />}
                                >
                                    <div>Custom profile content</div>
                                </UserButton.UserProfilePage>
                            </UserButton>
                        </SignedIn>
                        <SignedOut>
                            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-2 text-white rounded-full p-2"
                                        size="sm"
                                    >
                                        <UserIcon className="w-5 h-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-48 py-2 bg-white/95 backdrop-blur-sm border border-white/20 z-50"
                                    align="end"
                                >
                                    <div className="flex flex-col gap-2">
                                        <Button

                                            className="w-full  bg-transparent hover:bg-white  justify-start px-4 h-auto font-normal text-gray-700 "
                                            onClick={handleSignInClick}
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign In
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </SignedOut>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex flex-col mx-auto  max-w-4xl justify-center text-center px-6 ">
                    {/* Welcome Text */}
                    <div className="mb-12">
                        <h1 className="text-2xl md:text-6xl font-medium text-white mb-4">
                            Hey {`${user.user?.firstName ? user.user?.firstName : 'there'}`}, where are we going today?
                        </h1>
                        <p className="text-xl text-white/90  ">
                            Tell me your style and budget, and I&apos;ll design a trip for you.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="w-full max-w-4xl mb-8">
                        <div className="relative">
                            <div className="flex items-center gap-3 bg-white rounded-[30px]  p-6 shadow-2xl">
                                {/* Paperclip Icon */}
                                <Paperclip className="w-6 h-6 absolute left-6 bottom-6 text-gray-400" />

                                {/* Input Field */}
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1 pb-20 border-none bg-transparent text-lg text-black   focus:outline-none"
                                    placeholder="Tell me where you want to go..."
                                />

                                {/* Send Button */}
                                <Button
                                    onClick={handlePlanTrip}
                                    className="bg-background absolute right-6 bottom-6 hover:bg-background/90 text-white px-6 py-2 rounded-xl flex items-center gap-2"
                                    size="lg"
                                >
                                    <Send className="w-5 h-5" />
                                    Plan my trip
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}


                    {/* Help Text */}
                    <p className="text-white/70 text-md text-center mx-auto flex items-center gap-2">
                        See how I can help you
                        <svg className="w-5 h-3 mt-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </p>
                </main>
            </div>

            {/* Auth Dialog - rendered outside popover */}
            <AuthModal
                isOpen={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
                mode={authMode}
                onSwitchMode={setAuthMode}
            />
        </div>
    )
}

export default HomePage