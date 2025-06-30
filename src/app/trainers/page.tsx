import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DollarSign, UploadCloud, Users, BarChart } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become a Trainer',
  description: 'Share your knowledge, help learners achieve their goals, and earn money. Join our community of expert instructors today.',
};

const features = [
    {
        icon: UploadCloud,
        title: 'Effortless Course Creation',
        description: 'Use our intuitive course builder to structure your curriculum, add lectures, and upload video content directly.'
    },
    {
        icon: Users,
        title: 'Reach a Global Audience',
        description: 'Tap into our growing community of learners eager to acquire new skills. We handle the marketing, you focus on teaching.'
    },
    {
        icon: DollarSign,
        title: 'Monetize Your Expertise',
        description: 'Set your own prices and start earning. Our platform is built to help you turn your knowledge into a sustainable income stream.'
    },
     {
        icon: BarChart,
        title: 'Powerful Analytics',
        description: 'Get insights into your course performance with our trainer dashboard. Track student enrollment and engagement.'
    }
]

export default function TrainerPage() {
  return (
    <div className="bg-background">
        <section className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-b from-primary/10 to-transparent">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-br from-white via-slate-300 to-primary bg-clip-text text-transparent">
                        Become a LearnAI Instructor
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Share your knowledge, help learners achieve their goals, and earn money. Join our community of expert instructors today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg">
                            <Link href="/auth/signup">
                                Get Started
                            </Link>
                        </Button>
                         <Button asChild size="lg" variant="outline">
                            <Link href="/trainers/dashboard">
                                Go to Your Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">Why Teach on LearnAI?</h2>
                <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 lg:gap-16">
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-12 duration-500 ease-in-out" style={{ animationDelay: `${index * 150}ms`}}>
                           <div className="bg-primary/10 text-primary p-3 rounded-lg">
                             <feature.icon className="h-6 w-6" />
                           </div>
                            <div>
                                <h3 className="text-lg font-bold">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
}
