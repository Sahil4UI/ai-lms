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
    headline: 'The Future of Learning, Powered by AI.',
    description:
      'Supercharge your CS journey with an AI co-pilot for every course. Personalized, interactive, and always available.',
    image: 'https://placehold.co/1200x800.png',
    imageHint: 'futuristic education abstract',
    buttonLabel: 'Explore Courses',
    buttonLink: '/courses',
  },
  {
    headline: 'Master In-Demand Skills with Expert-Led Courses.',
    description:
      'From Python to Full-Stack Web Development, our curriculum is designed to make you a job-ready engineer.',
    image: 'https://placehold.co/1200x800.png',
    imageHint: 'code on screen',
    buttonLabel: 'Find Your Course',
    buttonLink: '/courses',
  },
  {
    headline: 'Become a Trainer. Share Your Knowledge.',
    description:
      'Join our platform as a trainer, create world-class courses, and earn revenue while shaping the next generation of tech talent.',
    image: 'https://placehold.co/1200x800.png',
    imageHint: 'teacher online classroom',
    buttonLabel: 'Get Started',
    buttonLink: '/trainers',
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
              <div className="absolute inset-0 bg-black/60 z-10" />
              <Image
                src={slide.image}
                width={1200}
                height={800}
                alt={slide.headline}
                data-ai-hint={slide.imageHint}
                className="w-full h-[60vh] lg:h-[80vh] object-cover"
                priority={index === 0}
              />
              <div key={index} className="container absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white space-y-4 px-4 md:px-6">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-in fade-in-0 slide-in-from-bottom-12 duration-700">
                  {slide.headline}
                </h1>
                <p className="max-w-[700px] text-lg md:text-xl animate-in fade-in-0 slide-in-from-bottom-10 duration-1000">
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
