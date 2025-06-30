import Link from 'next/link';
import {
  BookOpen,
  Cpu,
  Quote,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { courses } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HeroCarousel } from '@/components/hero-carousel';

const testimonials = [
    {
        quote: "This platform transformed my understanding of machine learning. The AI assistant is a game-changer for getting unstuck on complex topics.",
        name: "Alex Johnson",
        title: "Data Science Student",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "As a full-stack developer, I've seen many platforms, but none with the polish and AI integration of LearnAI. The Next.js course was top-notch.",
        name: "Samantha Lee",
        title: "Software Engineer",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "I went from zero to building my own applications. The hands-on projects and instant feedback from the AI assistant made all the difference.",
        name: "Michael Chen",
        title: "Aspiring Developer",
        avatar: "https://placehold.co/100x100.png"
    }
]

export default function Home() {
  const featuredCourses = courses.slice(0, 4);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full relative">
         <HeroCarousel />
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                Next-Gen Features
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                Smarter Learning, Powered by AI
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-in fade-in slide-in-from-bottom-12 duration-900">
                We leverage cutting-edge AI to create a learning experience that's tailored to you.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
            <div className="grid gap-1 text-center animate-in fade-in slide-in-from-bottom-12 duration-500 ease-in-out">
              <Cpu className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-lg font-bold">AI Course Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Your personal AI tutor for every course. Get unstuck, clarify doubts, and explore topics deeper, 24/7.
              </p>
            </div>
            <div className="grid gap-1 text-center animate-in fade-in slide-in-from-bottom-12 duration-700 ease-in-out">
              <Rocket className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-lg font-bold">AI-Powered Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Our AI suggests courses based on your learning history and career goals, guiding you on your optimal learning path.
              </p>
            </div>
            <div className="grid gap-1 text-center animate-in fade-in slide-in-from-bottom-12 duration-900 ease-in-out">
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

      <section id="courses" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
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
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {featuredCourses.map((course) => (
                <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <CourseCard course={course} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg">
              <Link href="/courses">View All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                    Loved by Learners Worldwide
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    See what our students have to say about their learning experience.
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                     <Card key={index} className="h-full flex flex-col bg-muted/40 border-border/60 animate-in fade-in slide-in-from-bottom-12 duration-500 ease-in-out" style={{ animationDelay: `${index * 150}ms`}}>
                        <CardContent className="p-6 flex flex-col flex-grow">
                            <Quote className="h-8 w-8 text-primary mb-4" />
                            <p className="text-muted-foreground mb-6 flex-grow">{testimonial.quote}</p>
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint="person face"/>
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 animate-in fade-in duration-500">
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
