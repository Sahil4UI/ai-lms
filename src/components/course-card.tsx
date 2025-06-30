import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/lib/data';
import { Star, User } from 'lucide-react';

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <Image
              src={course.imageUrl}
              alt={course.title}
              width={600}
              height={400}
              data-ai-hint="online course"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">{course.category}</Badge>
          <CardTitle className="text-lg leading-tight mb-1">
            {course.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {course.instructor}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
           <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{course.rating}</span>
            </div>
             <div className="flex items-center gap-1 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
           </div>
          <div className="font-bold text-lg text-primary">
            ${course.price}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
