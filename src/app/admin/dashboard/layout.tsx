import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logout } from '../actions';
import { AdminNav } from './_components/admin-nav';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
        <div className="mb-6 flex h-14 items-center">
          <Link href="/admin/dashboard" className="text-lg font-bold text-primary">
            LearnAI Admin
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          <AdminNav />
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
