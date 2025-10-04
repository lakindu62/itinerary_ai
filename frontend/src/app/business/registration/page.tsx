'use client'
import { SignUp } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import { UserType } from '@shared/types/user-management'
import { useUser, useClerk } from '@clerk/nextjs'

const Page = () => {
    const { isSignedIn, user } = useUser()
    const { signOut } = useClerk()

    // If user is already signed in, show option to sign out
    if (isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center mb-4">Already Signed In</h2>
                    <p className="text-gray-600 text-center mb-6">
                        You&apos;re currently signed in as <strong>{user?.emailAddresses[0]?.emailAddress}</strong>.
                        To register as a business user, you need to sign out first.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => signOut({ redirectUrl: '/business/registration' })}
                            className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded"
                        >
                            Sign Out & Register as Business
                        </button>
                        <Link
                            href="/"
                            className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded"
                        >
                            Go Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />

                {/* Background image effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                    }}
                />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Grow your business
                        <br />
                        <span className="text-green-400">with Itinerary AI</span>
                    </h1>
                    <p className="text-xl text-gray-200 max-w-md leading-relaxed">
                        Join thousands of businesses that have increased their revenue by partnering with us.
                        Reach more customers and expand your reach with our powerful platform.
                    </p>

                    {/* Feature highlights */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-200">Increase your customer base</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-200">Easy-to-use management tools</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-200">Real-time analytics and insights</span>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 right-20 w-32 h-32 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-xl"></div>
                </div>
                <div className="absolute bottom-20 right-32 w-24 h-24 opacity-15">
                    <div className="w-full h-full bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full blur-lg"></div>
                </div>
                <div className="absolute bottom-40 left-20 w-16 h-16 opacity-10">
                    <div className="w-full h-full bg-gradient-to-bl from-purple-400 to-pink-500 rounded-full blur-md"></div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center  mb-8 ">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get started</h2>

                    </div>

                    {/* Clerk SignUp Component */}
                    <div className="flex justify-center">
                        <SignUp
                            unsafeMetadata={{
                                userType: UserType.BUSINESS_USER
                            }}

                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-lg border-0 bg-white rounded-lg",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    socialButtonsBlockButton: "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700",
                                    formFieldInput: "bg-gray-100 border-gray-300 focus:bg-white focus:border-blue-500",
                                    formButtonPrimary: "bg-black hover:bg-gray-800 text-white normal-case",
                                    footerActionLink: "text-blue-600 hover:text-blue-500"
                                }
                            }}
                        />
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>
                            By signing up, you agree to our{' '}
                            <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page