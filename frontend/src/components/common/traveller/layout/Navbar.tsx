"use client";

import { BellIcon, HomeIcon, UserIcon, LogOut, User, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "@frontend/components/ModeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// import { currentUser } from "@clerk/nextjs/server";

function Navbar() {

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');

    const handleSignInClick = () => {
        setAuthMode('sign-in');
        setIsAuthDialogOpen(true);
        setIsPopoverOpen(false); // Close the popover
    };


    return (

        <nav className="absolute px-7 py-3  rounded-full h-fit top-3  w-[calc(100%-12px)] xl:w-8/12 left-1/2 -translate-x-1/2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="max-w-7xl mx-auto ">
                <div className="flex items-center justify-between ">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold text-primary font-mono tracking-wider"
                        >
                            Itinerary.ai
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <ModeToggle />

                        <Button variant="ghost" className="flex items-center gap-2" asChild>
                            <Link href="/">
                                <HomeIcon className="w-4 h-4" />
                                <span className="hidden lg:inline">Home</span>
                            </Link>
                        </Button>

                        {/* Business Dashboard Button - Only show when signed in */}
                        <SignedIn>
                            <Button variant="outline" className="flex items-center gap-2" asChild>
                                <Link href="/business-dashboard">
                                    <Users className="w-4 h-4" />
                                    <span className="hidden lg:inline">Seller Dashboard</span>
                                </Link>
                            </Button>
                        </SignedIn>



                        <Button variant="ghost" className="flex items-center gap-2" asChild>
                            <Link href="/notifications">
                                <BellIcon className="w-4 h-4" />
                                <span className="hidden lg:inline">Notifications</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" className="flex items-center gap-2" asChild>
                            <Link href="/social">
                                <Users className="w-4 h-4" />
                                <span className="hidden lg:inline">Social</span>
                            </Link>
                        </Button>
                        <SignedIn>
                            <UserButton >
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
                                    <Button variant="ghost" className="flex items-center gap-2" >

                                        <UserIcon className="w-4 h-4" />
                                        {/* <span className="hidden lg:inline">Profile</span> */}

                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64  py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 z-50" align="end">






                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start px-4 h-auto font-normal "
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
                    {/* <MobileNavbar /> */}
                </div>
            </div>

            {/* Auth Dialog - rendered outside popover */}
            <AuthModal
                isOpen={isAuthDialogOpen}
                onOpenChange={setIsAuthDialogOpen}
                mode={authMode}
                onSwitchMode={setAuthMode}
            />

        </nav>

    );
}
export default Navbar;