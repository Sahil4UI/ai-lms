import { Input } from '@/components/ui/input';
import { CourseCard } from '@/components/course-card';
import { courses } from '@/lib/data';
import { Search } from 'lucide-react';

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Explore Our Courses
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find your next learning adventure from our curated list of expert-led
          courses.
        </p>
      </header>
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for courses..." className="pl-10" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
