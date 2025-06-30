'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, LayoutDashboard, TestTube2, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '../actions';
import { getSession } from '../actions';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/users', label: 'Users', icon: Users },
  { href: '/admin/dashboard/courses', label: 'Courses', icon: Book },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: TestTube2 },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This check ensures the session logic runs only on the client-side
    // after initial render, preventing hydration mismatches and server-side redirects
    // which are now handled by the middleware.
    setIsClient(true); 
    const checkSession = async () => {
        const session = await getSession();
        if (!session.isLoggedIn) {
            redirect('/admin/login');
        }
    };
    checkSession();
  }, []);

  if (!isClient) {
      return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
        <div className="mb-6 flex h-14 items-center">
          <Link href="/admin/dashboard" className="text-lg font-bold text-primary">
            LearnAI Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'default' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <form action={logout}>
            <Button variant="outline" className="w-full">
              Logout
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
