'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, LayoutDashboard, TestTube2, Users, TicketPercent } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logout } from '../actions';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/users', label: 'Users', icon: Users },
  { href: '/admin/dashboard/courses', label: 'Courses', icon: Book },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: TestTube2 },
  { href: '/admin/dashboard/coupons', label: 'Coupons', icon: TicketPercent },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect ensures we are on the client-side before rendering the full component.
    // This avoids potential hydration mismatches with hooks like usePathname.
    // The actual session protection is handled by the middleware.
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Render nothing or a loading spinner on the server and initial client render
    // to prevent hydration mismatch.
    return null;
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
                variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}
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
