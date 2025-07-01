
'use client';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { type Course } from '@/lib/data';
import {
  Clock,
  CheckCircle,
  PlayCircle,
  Star,
  Lock,
  FileText,
  Award,
  Loader2,
  BadgePercent,
  PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { applyCoupon, enrollInCourse } from './actions';
import dynamic from 'next/dynamic';

const AiAssistant = dynamic(() => import('./ai-assistant'), {
  ssr: false,
});


export default function CourseDetailPageClient({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const isEnrolled = userData?.enrolledCourses?.includes(params.id);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!firestore) {
        setLoading(false);
        toast({ title: "Error", description: "Cannot load course, Firebase not configured.", variant: "destructive"});
        return;
      }

      const courseRef = doc(firestore, 'courses', params.id);
      const courseSnap = await getDoc(courseRef);

      if (!courseSnap.exists()) {
        notFound();
      }

      const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
      setCourse(courseData);
      setFinalPrice(courseData.price);
      setLoading(false);
    };

    fetchCourse();
  }, [params.id, toast]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!course) {
      return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Course Not Found</h1>
                <p className="text-muted-foreground">This may be due to a configuration issue.</p>
            </div>
        </div>
      );
  }

  const handleApplyCoupon = async () => {
    setIsApplyingCoupon(true);
    const result = await applyCoupon(couponCode);
    if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
        setDiscount(0);
        setFinalPrice(course.price);
    } else {
        const discountAmount = (course.price * result.discount!) / 100;
        setDiscount(result.discount!);
        setFinalPrice(course.price - discountAmount);
        toast({ title: 'Coupon Applied!', description: `You received a ${result.discount}% discount.` });
    }
    setIsApplyingCoupon(false);
  };

  const handleEnroll = async () => {
      if (!user) {
          router.push('/auth/login');
          return;
      }
      setIsEnrolling(true);
      const result = await enrollInCourse(course.id, user.uid, discount > 0 ? couponCode : undefined);
      if (result.error) {
          toast({ title: 'Enrollment Failed', description: result.error, variant: 'destructive' });
      } else {
          toast({
              title: 'Congratulations!',
              description: `You have successfully enrolled in "${course.title}".`,
              duration: 5000,
          });
          // Optimistically update the UI while revalidation happens in the background
          router.refresh();
      }
      setIsEnrolling(false);
  };


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
                <Award className="w-4 h-4" />
                <span>Certificate of completion</span>
              </div>
            </div>
            
            {!isEnrolled && (
              <div className="mt-6 space-y-4 max-w-sm">
                <div className="space-y-2">
                    <Label htmlFor="coupon">Have a coupon?</Label>
                    <div className="flex space-x-2">
                        <Input id="coupon" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                        <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode}>
                            {isApplyingCoupon ? <Loader2 className="animate-spin" /> : 'Apply'}
                        </Button>
                    </div>
                </div>
                <div>
                  <p className="text-4xl font-bold">
                    ${finalPrice.toFixed(2)}
                    {discount > 0 && (
                      <span className="text-lg font-normal text-muted-foreground line-through ml-2">${course.price.toFixed(2)}</span>
                    )}
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-green-400 flex items-center gap-1"><BadgePercent className="w-4 h-4" /> {discount}% discount applied!</p>
                  )}
                </div>
                 <Button size="lg" className="w-full" onClick={handleEnroll} disabled={isEnrolling}>
                  {isEnrolling ? <Loader2 className="animate-spin" /> : 'Enroll Now'}
                </Button>
              </div>
            )}
             {isEnrolled && (
              <div className="mt-6 flex items-center gap-3 bg-primary/10 text-primary border border-primary/20 rounded-lg p-4 max-w-sm">
                  <PartyPopper className="w-8 h-8"/>
                  <div>
                      <h3 className="font-bold">You are enrolled in this course!</h3>
                      <p className="text-sm">You have full lifetime access. Start learning below.</p>
                  </div>
              </div>
            )}
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
              <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                {course.lectures?.map((lecture, index) => {
                  const isLocked = !isEnrolled && index >= 3;
                  return (
                    <AccordionItem value={`item-${index}`} key={lecture.id} disabled={isLocked}>
                      <AccordionTrigger
                        disabled={isLocked}
                        className={cn('hover:no-underline', isLocked && 'cursor-not-allowed text-muted-foreground')}
                      >
                        <div className="flex items-center gap-3 flex-1 text-left">
                          {isLocked ? <Lock className="w-5 h-5 shrink-0" /> : <PlayCircle className="w-5 h-5 shrink-0 text-primary" />}
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
                            <div className="relative aspect-video">
                               <video
                                key={lecture.videoUrl}
                                src={lecture.videoUrl}
                                controls
                                className="w-full h-full rounded-lg border bg-black"
                               >
                                Your browser does not support the video tag.
                               </video>
                               <div className="screen-recording-overlay">
                                  <p className="text-white text-lg font-semibold">Screen recording is not permitted.</p>
                               </div>
                            </div>
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
