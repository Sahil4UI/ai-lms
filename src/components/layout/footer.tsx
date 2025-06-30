import Link from 'next/link';
import { Icons } from '@/components/icons';

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{' '}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                AI
              </a>
              . Powered by{' '}
              <a
                href="https://firebase.google.com/docs/studio"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Firebase Studio
              </a>
              .
            </p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/#features" className="hover:text-primary">
              Features
            </Link>
            <Link href="/courses" className="hover:text-primary">
              Courses
            </Link>
            <Link href="/trainers" className="hover:text-primary">
              Trainers
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
