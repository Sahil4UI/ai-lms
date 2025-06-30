import { CourseCard } from '@/components/course-card';
import { courses } from '@/lib/data';
import Recommendations from './recommendations';

export default function DashboardPage() {
  const myCourses = courses.slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        My Dashboard
      </h1>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Continue Learning
        </h2>
        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        {myCourses.length === 0 && (
          <p className="text-muted-foreground mt-4">
            You are not enrolled in any courses yet.
          </p>
        )}
      </section>

      <section className="mt-12">
        <Recommendations />
      </section>
    </div>
  );
}
