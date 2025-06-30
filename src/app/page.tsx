import Link from 'next/link';
import {
  BookOpen,
  Cpu,
  Quote,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import type { Course, Testimonial } from '@/lib/data';
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
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { unstable_noStore as noStore } from 'next/cache';
import { seedTestimonials } from './admin/dashboard/testimonials/actions';


const placeholderTestimonials: Omit<Testimonial, 'id'>[] = [
    {
        quote: "The Web Development Bootcamp was incredible. I landed a new job before I even finished the course. The AI assistant helped me grasp complex concepts so much faster.",
        name: "Jessica Miller",
        title: "Full-Stack Developer",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "I never thought I could learn Excel to this level. The course was practical and the instructor was amazing. It's already saved me hours of work each week.",
        name: "David Rodriguez",
        title: "Financial Analyst",
        avatar: "https://placehold.co/100x100.png"
    },
    {
        quote: "The Python course took me from a complete beginner to writing my own scripts and applications. The platform is polished and the learning experience is top-notch.",
        name: "Sarah Chen",
        title: "Data Science Enthusiast",
        avatar: "https://placehold.co/100x100.png"
    }
];

async function getHomePageData() {
  noStore(); // Ensures data is fetched on every request

  // If firestore is not initialized, return empty/placeholder data to prevent crash
  if (!firestore) {
    console.warn("Firestore is not initialized. Skipping data fetching for homepage.");
    return { featuredCourses: [], testimonials: placeholderTestimonials };
  }

  try {
    // Fetch Courses
    const coursesCol = collection(firestore, 'courses');
    const coursesQuery = query(coursesCol, orderBy('createdAt', 'desc'), limit(6));
    const coursesSnapshot = await getDocs(coursesQuery);
    const featuredCourses: Course[] = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

    // Fetch Testimonials
    await seedTestimonials(placeholderTestimonials);
    const testimonialsCol = collection(firestore, 'testimonials');
    const testimonialsSnapshot = await getDocs(query(testimonialsCol));
    const testimonials: Testimonial[] = testimonialsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));

    return { featuredCourses, testimonials };
  } catch (error) {
    console.error("Homepage data fetching error:", error);
    // In case of error (e.g., permissions), return placeholder data
    return { featuredCourses: [], testimonials: placeholderTestimonials };
  }
}


export default async function Home() {
  const { featuredCourses, testimonials } = await getHomePageData();

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
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 bg-gradient-to-br from-slate-200 to-slate-500 bg-clip-text text-transparent">
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

      <section id="courses" className="w-full py-12 md:py-24 lg:py-32 bg-black/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-br from-slate-200 to-slate-500 bg-clip-text text-transparent">
                Featured Courses
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started with our most popular courses, designed by industry
                experts.
              </p>
            </div>
          </div>
          {featuredCourses.length > 0 ? (
            <Carousel
                opts={{
                align: 'start',
                loop: featuredCourses.length > 3,
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
          ) : (
            <p className="text-center text-muted-foreground">No courses available yet. Check back soon!</p>
          )}
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
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-br from-slate-200 to-slate-500 bg-clip-text text-transparent">
                    Loved by Learners Worldwide
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    See what our students have to say about their learning experience.
                </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                     <Card key={testimonial.id} className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-500 ease-in-out" style={{ animationDelay: `${index * 150}ms`}}>
                        <CardContent className="p-6 flex flex-col flex-grow">
                            <Quote className="h-8 w-8 text-primary mb-4" />
                            <p className="text-muted-foreground mb-6 flex-grow">{testimonial.quote}</p>
                            <div className="flex items-center gap-4 mt-auto">
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
            <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-br from-slate-200 to-slate-500 bg-clip-text text-transparent">
              Join Our Mission
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Are you an expert in your field? Join our platform as an instructor or engineer,
              and help us shape the next generation of tech talent.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/careers">Explore Careers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
