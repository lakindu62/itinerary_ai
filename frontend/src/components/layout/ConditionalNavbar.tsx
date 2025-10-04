"use client";

import { usePathname } from "next/navigation";
import Navbar from "@frontend/components/common/traveller/layout/Navbar";

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Hide navbar on authentication pages
    const authPaths = ["/sign-up", "/sign-in", "/business/registration"];
    const hideNavbar = authPaths.includes(pathname) || pathname.startsWith("/sign-in/") || pathname.startsWith("/business/");

    if (hideNavbar) {
        return null;
    }

    return <Navbar />;
}
