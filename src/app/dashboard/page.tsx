import { CourseCard } from '@/components/course-card';
import { type Course } from '@/lib/data';
import Recommendations from './recommendations';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default async function DashboardPage() {
  // Placeholder: Fetches a few recent courses.
  // A real implementation would fetch courses the user is actually enrolled in.
  const coursesCol = collection(firestore, 'courses');
  const q = query(coursesCol, orderBy('createdAt', 'desc'), limit(2));
  const coursesSnapshot = await getDocs(q);
  const myCourses: Course[] = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

  // Placeholder for a completed course
  const completedCourse = myCourses.length > 0 ? myCourses[0] : null;

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
          <p className="text-muted-foreground mt-4">
            You are not enrolled in any courses yet. Explore our courses to get started!
          </p>
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
