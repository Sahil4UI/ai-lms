import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type Course } from '@/lib/data';
import {
  Clock,
  BarChart,
  CheckCircle,
  PlayCircle,
  Star,
  Lock,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AiAssistant from './ai-assistant';
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const courseRef = doc(firestore, 'courses', params.id);
  const courseSnap = await getDoc(courseRef);

  if (!courseSnap.exists()) {
    notFound();
  }

  const course = { id: courseSnap.id, ...courseSnap.data() } as Course;

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 animate-in fade-in slide-in-from-left-8 duration-700">
            <Badge className="mb-2">{course.category}</Badge>
            <h1 className="font-headline text-3xl md:text-4xl font-bold">
              {course.title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>
                  {course.rating} ({course.students.toLocaleString()} ratings)
                </span>
              </div>
              <span className="text-muted-foreground">
                Taught by {course.instructor}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.lectures.length} lectures</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                <span>Certificate of completion</span>
              </div>
            </div>
            <div className="mt-6">
                 <Button size="lg">
                  Enroll Now for ${course.price}
                </Button>
            </div>
          </div>
          <div className="hidden md:block animate-in fade-in slide-in-from-right-8 duration-700">
              <Image
                src={course.imageUrl}
                alt={course.title}
                width={600}
                height={400}
                data-ai-hint={course.imageHint}
                className="w-full object-cover rounded-lg border"
              />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 animate-in fade-in slide-in-from-bottom-8 duration-900">
            <div className="border rounded-lg p-6 bg-muted/30">
              <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.whatYoullLearn?.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <Accordion type="single" collapsible className="w-full">
                {course.lectures?.map((lecture, index) => {
                  const isLocked = index >= 3;
                  return (
                    <AccordionItem value={`item-${index}`} key={lecture.id} disabled={isLocked}>
                      <AccordionTrigger
                        disabled={isLocked}
                        className={cn('hover:no-underline', isLocked && 'cursor-not-allowed text-muted-foreground')}
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          {isLocked ? <Lock className="w-5 h-5 shrink-0" /> : <PlayCircle className="w-5 h-5 shrink-0" />}
                          <div className="flex flex-col">
                            <span className="font-medium">{lecture.title}</span>
                             <span className="text-xs text-muted-foreground">{lecture.duration}</span>
                          </div>
                        </div>
                         {isLocked && <Badge variant="secondary" className="ml-auto mr-4">Locked</Badge>}
                      </AccordionTrigger>
                      <AccordionContent className="pl-4 pr-2">
                        {!isLocked ? (
                          <div className="space-y-4">
                            <video
                              key={lecture.videoUrl}
                              src={lecture.videoUrl}
                              controls
                              className="w-full rounded-lg border bg-black"
                            >
                              Your browser does not support the video tag.
                            </video>
                             {lecture.notes && (
                                <div className="prose prose-sm dark:prose-invert max-w-none border-t pt-4">
                                  <h3 className="flex items-center gap-2 text-base font-semibold"><FileText className="w-4 h-4" />Lecture Notes</h3>
                                  <ReactMarkdown>{lecture.notes}</ReactMarkdown>
                                </div>
                              )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground pl-9">
                            Enroll in the course to unlock this lecture and get lifetime access.
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>

          <div className="md:sticky top-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <AiAssistant course={course} />
          </div>
        </div>
      </div>
    </div>
  );
}
