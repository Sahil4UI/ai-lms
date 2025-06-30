import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LearnAI Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The middleware (`src/middleware.ts`) handles the protection logic.
  // This layout is primarily for setting metadata for the admin section.
  return <>{children}</>;
}
