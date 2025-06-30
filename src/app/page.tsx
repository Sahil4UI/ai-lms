import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { courses } from '@/lib/data';

export default function Home() {
  const featuredCourses = courses.slice(0, 3);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  The Future of Learning is Here.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Supercharge your CS journey with an AI co-pilot for every course. Personalized, interactive, and always available.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="group">
                  <Link href="/courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/trainers">Become a Trainer</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x600.png"
              width="600"
              height="600"
              alt="Hero"
              data-ai-hint="futuristic education"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Next-Gen Features
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                Smarter Learning, Powered by AI
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We leverage cutting-edge AI to create a learning experience that's tailored to you.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
            <div className="grid gap-1 text-center">
              <Cpu className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-lg font-bold">AI Course Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Your personal AI tutor for every course. Get unstuck, clarify doubts, and explore topics deeper, 24/7.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <Rocket className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-lg font-bold">AI-Powered Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Our AI suggests courses based on your learning history and career goals, guiding you on your optimal learning path.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <BookOpen className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-lg font-bold">Lifetime Course Access</h3>
              <p className="text-sm text-muted-foreground">
                Purchase a course once and have unlimited access to it forever,
                including all future updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                Featured Courses
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started with our most popular courses, designed by industry
                experts.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Share Your Knowledge
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Are you an expert in your field? Join our platform as a trainer,
              create courses, and earn revenue while shaping the next generation
              of tech talent.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/trainers">Become a Trainer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
