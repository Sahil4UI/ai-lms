
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { LogIn, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { user, userData } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-lg">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">LearnAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.photoURL || undefined}
                        alt={user.displayName || 'User'}
                      />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {userData?.role === 'trainer' && (
                    <DropdownMenuItem asChild>
                      <Link href="/trainers/dashboard">Trainer Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/auth/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[340px] p-4">
                 <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                        <Icons.logo className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline">LearnAI</span>
                      </Link>
                    </div>
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeSheet}
                          className="text-lg font-medium transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto flex flex-col gap-2">
                      <DropdownMenuSeparator />
                       {user ? (
                          <div className="flex flex-col space-y-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={user.photoURL || undefined}
                                    alt={user.displayName || 'User'}
                                  />
                                  <AvatarFallback>
                                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="font-normal text-left">
                                  <p className="text-sm font-medium leading-none">
                                    {user.displayName}
                                  </p>
                                  <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Link href="/dashboard" onClick={closeSheet}><Button className="w-full">Dashboard</Button></Link>
                              {userData?.role === 'trainer' && (
                                <Link href="/trainers/dashboard" onClick={closeSheet}><Button className="w-full" variant="outline">Trainer Dashboard</Button></Link>
                              )}
                              <Button onClick={() => { handleLogout(); closeSheet(); }} variant="outline" className="w-full">Log out</Button>
                          </div>
                       ) : (
                         <>
                           <Button asChild variant="outline"><Link href="/auth/login" onClick={closeSheet}>Login</Link></Button>
                           <Button asChild><Link href="/auth/signup" onClick={closeSheet}>Sign Up</Link></Button>
                         </>
                       )}
                    </div>
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
