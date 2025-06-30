import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const openPositions = [
    {
        title: 'Senior Python Instructor',
        department: 'Instruction',
        location: 'Remote',
        description: 'Design and deliver world-class course content for advanced Python topics, including data science and web development.'
    },
    {
        title: 'Lead Frontend Engineer (React/Next.js)',
        department: 'Engineering',
        location: 'Remote',
        description: 'Drive the development of our learning platform, focusing on creating a beautiful, performant, and accessible user experience.'
    },
    {
        title: 'Curriculum Developer - AI & Machine Learning',
        department: 'Instruction',
        location: 'Remote',
        description: 'Develop engaging and effective learning materials for our rapidly growing catalog of AI and Machine Learning courses.'
    }
]

export default function CareersPage() {
  return (
    <div className="bg-background">
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-3xl text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                    Join Our Mission
                    </h1>
                    <p className="text-lg text-muted-foreground">
                    We're building the future of technical education, and we need passionate, talented people to help us achieve our vision.
                    </p>
                </div>
            </div>
        </section>

        <section className="w-full pb-12 md:pb-24 lg:pb-32">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">Open Positions</h2>
                <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-8 duration-900">
                    {openPositions.map((position, index) => (
                        <Card key={index} className="hover:bg-muted/40 transition-colors">
                            <CardHeader className="grid items-start gap-4 space-y-0 md:grid-cols-3 md:space-x-4">
                                <div className="md:col-span-2 space-y-1">
                                    <CardTitle>{position.title}</CardTitle>
                                    <CardDescription>{position.description}</CardDescription>
                                </div>
                                <div className="flex items-center space-x-1 rounded-md text-secondary-foreground md:justify-end">
                                    <Button asChild variant="secondary" className="w-full md:w-auto">
                                        <Link href="#">
                                            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4 text-sm text-muted-foreground">
                                    <div>{position.department}</div>
                                    <div>&middot;</div>
                                    <div>{position.location}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
}
