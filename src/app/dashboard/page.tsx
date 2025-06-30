import { CourseCard } from '@/components/course-card';
import { type Course } from '@/lib/data';
import Recommendations from './recommendations';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export default async function DashboardPage() {
  // Placeholder: Fetches a few recent courses.
  // A real implementation would fetch courses the user is actually enrolled in.
  const coursesCol = collection(firestore, 'courses');
  const q = query(coursesCol, orderBy('createdAt', 'desc'), limit(2));
  const coursesSnapshot = await getDocs(q);
  const myCourses: Course[] = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));

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

      <section className="mt-12">
        <Recommendations />
      </section>
    </div>
  );
}
