
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/admin/event/allevents', label: 'All Events' },
    { href: '/admin/event/venues', label: 'Venues' },
    { href: '/admin/event/organizers', label: 'Organizers' },
    { href: '/admin/event/categories', label: 'Categories' },
    { href: '/admin/event/hashtags', label: 'Hashtags' },
    { href: '/admin/event/create', label: 'Create Event' },
    { href: '/admin/event/rsvps', label: 'RSVPs' },
  ];

  return (
    <nav className="bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="font-bold text-xl">Event Manager</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}>

                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
