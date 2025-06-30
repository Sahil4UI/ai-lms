import { Input } from '@/components/ui/input';
import { CourseCard } from '@/components/course-card';
import { type Course } from '@/lib/data';
import { Search } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Explore our full catalog of expert-led courses. Find your next learning adventure in Web Development, Python, and more.',
};

export default async function CoursesPage() {
  let courses: Course[] = [];
  let error = null;

  if (firestore) {
    try {
      const coursesCol = collection(firestore, 'courses');
      const q = query(coursesCol, orderBy('createdAt', 'desc'));
      const coursesSnapshot = await getDocs(q);
      courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    } catch (e) {
      console.error("Failed to fetch courses:", e);
      error = "Could not load courses at this time.";
    }
  } else {
    error = "Firebase is not configured. Courses cannot be displayed.";
  }
  

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          Explore Our Courses
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find your next learning adventure from our curated list of expert-led
          courses.
        </p>
      </header>
      <div className="mb-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for courses..." className="pl-10" />
        </div>
      </div>
      {error ? (
        <p className="text-center text-destructive mt-12">{error}</p>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-900">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-12">No courses have been created yet. Be the first to create one!</p>
      )}
    </div>
  );
}
