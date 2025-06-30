'use client';

import { CourseCard } from '@/components/course-card';
import { type Course } from '@/lib/data';
import Recommendations from './recommendations';
import { collection, getDocs, limit, query, where, documentId } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { userData, loading: authLoading } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (userData?.enrolledCourses && userData.enrolledCourses.length > 0) {
        const coursesRef = collection(firestore, 'courses');
        const q = query(coursesRef, where(documentId(), 'in', userData.enrolledCourses));
        const coursesSnapshot = await getDocs(q);
        const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setMyCourses(coursesData);
      }
      setLoading(false);
    };

    if (!authLoading) {
        fetchEnrolledCourses();
    }
  }, [userData, authLoading]);
  
  // Placeholder for a completed course
  // In a real app, you'd track completion status per user per course
  const completedCourse = myCourses.length > 0 ? myCourses[0] : null;

  if (authLoading || loading) {
      return (
          <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        My Dashboard
      </h1>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Continue Learning
        </h2>
        {myCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Card className="mt-4 text-center">
             <CardHeader>
                <CardTitle>Start Your Learning Journey!</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">
                    You are not enrolled in any courses yet. Explore our course catalog to get started.
                </p>
             </CardContent>
             <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/courses">Explore Courses</Link>
                </Button>
             </CardFooter>
          </Card>
        )}
      </section>

      {completedCourse && (
        <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight">
                Completed Courses
            </h2>
            <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>{completedCourse.title}</CardTitle>
                        <CardDescription>by {completedCourse.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Congratulations on completing this course! You can now view and share your certificate.</p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild className="w-full">
                            <Link href={`/dashboard/certificate?course=${encodeURIComponent(completedCourse.title)}`}>
                                <Award className="mr-2 h-4 w-4" />
                                View Certificate
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
      )}


      <section className="mt-12">
        <Recommendations />
      </section>
    </div>
  );
}
