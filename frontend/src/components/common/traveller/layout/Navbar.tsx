"use client";

import { BellIcon, HomeIcon, UserIcon, LogOut, User, Users, MapIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "@frontend/components/ModeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import AuthModal from "../auth/AuthModal";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ObjectId } from "bson";
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


    const id = new ObjectId().toString()
    return (

        <nav className="sticky px-4 py-4 top-0   h-fit   w-full  dark:border-b  backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 bg-slate-800/10 no-underline group cursor-pointer   dark:shadow-2xl dark:shadow-zinc-900 rounded-b-full p-px text-sm font-semibold leading-6 text-white inline-block">
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-600/90 to-blue-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            <div className="max-w-7xl mx-auto ">
                <div className="flex items-center justify-between ">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold text-primary font-mono tracking-wider"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-full relative">
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <ModeToggle />

                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                            asChild
                        >
                            <Link href="/">
                                <HomeIcon className="w-4 h-4" />
                                <span className="hidden lg:inline">Home</span>
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                            asChild
                        >
                            <Link href="/notifications">
                                <BellIcon className="w-4 h-4" />
                                <span className="hidden lg:inline">Notifications</span>
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                            asChild
                        >
                            <Link href="/social">
                                <Users className="w-4 h-4" />
                                <span className="hidden lg:inline">Social</span>
                            </Link>
                        </Button>
                        <SignedIn>
                            <UserButton >
                                <UserButton.MenuItems>
                                    <UserButton.Link
                                        label="New Trip"
                                        labelIcon={<PlusIcon strokeWidth={3} className="text-gray-500 w-4 h-4" />}
                                        href={`/`}
                                    />
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