import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function TrainersPage() {
  const benefits = [
    'Reach a global audience of motivated CS students.',
    'Earn a competitive 30% revenue share on every course sale.',
    'Utilize our easy-to-use platform to create and manage courses.',
    'Leverage our AI tools to enhance your course materials.',
    'Become part of a community of expert instructors.',
  ];

  return (
    <div>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Become a LearnAI Trainer
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Share your expertise, empower the next generation of developers,
              and earn revenue by creating courses on our cutting-edge
              platform.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-primary-foreground bg-accent hover:bg-accent/90">
              <Link href="/trainers/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">
                Why Teach on LearnAI?
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                Inspire and Earn
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl">
                Our platform provides everything you need to create high-quality
                courses and connect with learners passionate about computer
                science.
              </p>
              <ul className="mt-6 space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full p-1 mt-0.5">
                      <Check className="h-4 w-4" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              width={600}
              height={400}
              alt="Trainer"
              data-ai-hint="teacher online"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
