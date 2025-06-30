'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, LayoutDashboard, TestTube2, Users, TicketPercent } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/users', label: 'Users', icon: Users },
  { href: '/admin/dashboard/courses', label: 'Courses', icon: Book },
  { href: '/admin/dashboard/testimonials', label: 'Testimonials', icon: TestTube2 },
  { href: '/admin/dashboard/coupons', label: 'Coupons', icon: TicketPercent },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => (
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
    </>
  );
}
