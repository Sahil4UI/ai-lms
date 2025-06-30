'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Facebook, Twitter, Linkedin, Github, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await addDoc(collection(firestore, 'newsletterSignups'), {
        email,
        subscribedAt: serverTimestamp(),
      });
      toast({
        title: 'Subscribed!',
        description: "Thanks for joining our newsletter. Look out for updates!",
      });
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
                 <Link href="/" className="flex items-center space-x-2">
                    <Icons.logo className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold font-headline">LearnAI</span>
                </Link>
                <p className="text-muted-foreground text-sm">
                    The future of computer science education, powered by AI.
                </p>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Twitter className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Facebook className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Linkedin className="h-4 w-4" /></Link>
                    </Button>
                     <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Github className="h-4 w-4" /></Link>
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h4 className="font-semibold">Platform</h4>
                <Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">Courses</Link>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link>
                <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-primary">Testimonials</Link>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">My Dashboard</Link>
            </div>

            <div className="flex flex-col gap-3">
                <h4 className="font-semibold">Company</h4>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</Link>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link>
                 <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</Link>
            </div>

            <div className="flex flex-col gap-4">
                <h4 className="font-semibold">Stay Updated</h4>
                <p className="text-sm text-muted-foreground">Subscribe to our newsletter to get the latest updates.</p>
                <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-sm items-center space-x-2">
                    <Input 
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
                    </Button>
                </form>
            </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-2">
           <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LearnAI, Inc. All rights reserved.
            </p>
             <p className="text-sm text-muted-foreground">
              Powered by{' '}
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
      </div>
    </footer>
  );
}
