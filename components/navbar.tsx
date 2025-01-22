"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { signIn, signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Thoughts & Tales</span>
        </Link>

        {/* Navigation Links - Hidden on Mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/blog" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Blog
          </Link>
          <Link 
            href="/pricing" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Pricing
          </Link>
          <Link 
            href="/author" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Author
          </Link>
        </nav>

        {/* Auth Buttons - Hidden on Mobile */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => signIn('google')}>
              Sign In with Google
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav session={session} />
        </div>
      </div>
    </header>
  );
} 