'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { ParticlesBackground } from './particles-background';

const heroSlides = [
  {
    headline: 'Unlock Your Potential with In-Demand IT Skills.',
    description:
      'Master Python, Web Development, Excel, and more with our expert-led, AI-supercharged courses. Your tech career starts here.',
    image: 'https://placehold.co/1200x800.png',
    imageHint: 'futuristic technology abstract',
    buttonLabel: 'Explore Courses',
    buttonLink: '/courses',
  },
  {
    headline: 'From Beginner to Pro, We Have a Course for You.',
    description:
      "Whether you're starting out or leveling up, find the perfect course to achieve your goals. Dive into hands-on projects and real-world scenarios.",
    image: 'https://placehold.co/1200x800.png',
    imageHint: 'code on screen',
    buttonLabel: 'Find Your Course',
    buttonLink: '/courses',
  },
  {
    headline: 'Share Your Expertise. Shape the Future.',
    description:
      'Are you an expert in your field? Create courses, inspire students, and earn revenue on our cutting-edge platform.',
    image: 'https://placehold.co/1200x800.png',
    imageHint: 'teacher online classroom',
    buttonLabel: 'Explore Careers',
    buttonLink: '/careers',
  },
];

export function HeroCarousel() {
  return (
    <div className="relative w-full">
      <ParticlesBackground />
      <Carousel
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent className="ml-0">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative">
              <Image
                src={slide.image}
                width={1200}
                height={800}
                alt={slide.headline}
                data-ai-hint={slide.imageHint}
                className="w-full h-[60vh] lg:h-[80vh] object-cover opacity-20"
                priority={index === 0}
              />
              <div className="container absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white space-y-6 px-4 md:px-6 bg-gradient-to-t from-background/50 via-background/20 to-transparent pt-48 pb-20">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-in fade-in-0 slide-in-from-bottom-12 duration-700 bg-gradient-to-br from-white via-slate-300 to-primary bg-clip-text text-transparent">
                  {slide.headline}
                </h1>
                <p className="max-w-[700px] text-lg text-slate-300 md:text-xl animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
                  {slide.description}
                </p>
                <Button asChild size="lg" className="group mt-4 animate-in fade-in-0 slide-in-from-bottom-8 duration-1200">
                  <Link href={slide.buttonLink}>
                    {slide.buttonLabel}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 z-30 hidden md:flex" />
        <CarouselNext className="absolute right-4 z-30 hidden md:flex" />
      </Carousel>
    </div>
  );
}
