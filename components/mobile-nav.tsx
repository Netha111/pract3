"use client"

import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

interface MobileNavProps {
  session: Session | null;
}

export function MobileNav({ session }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-4 mt-4">
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
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user?.email}
              </span>
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              className="text-sm font-medium"
              onClick={() => signIn('google')}
            >
              Sign In with Google
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 