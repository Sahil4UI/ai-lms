import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Book, Users, PlusCircle } from 'lucide-react';
import { courses } from '@/lib/data';

export default function TrainerDashboardPage() {
  const trainerCourses = courses.slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Trainer Dashboard
        </h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Course
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234.56</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,453</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainerCourses.length}</div>
            <p className="text-xs text-muted-foreground">Your published courses</p>
          </CardContent>
        </Card>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-900">
        <Card>
            <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>
                Manage your courses and view their performance.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {trainerCourses.map((course) => (
                    <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                        <Badge>Published</Badge>
                    </TableCell>
                    <TableCell>${course.price}</TableCell>
                    <TableCell className="text-right">
                        {course.students.toLocaleString()}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
