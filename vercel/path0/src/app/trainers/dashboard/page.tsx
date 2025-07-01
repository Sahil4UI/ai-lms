
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  Loader2,
  Book,
  DollarSign,
  PlusCircle,
  Users,
  MoreHorizontal,
  Banknote,
  Percent,
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, getDoc } from 'firebase/firestore';
import { type Course } from '@/lib/data';

export default function TrainerDashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0 });
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'trainer')) {
      router.push('/auth/login');
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (user && userData?.role === 'trainer') {
      const fetchCoursesAndStats = async () => {
        setIsFetching(true);
        if (!firestore) return;
        const coursesCol = collection(firestore, 'courses');
        // Removed orderBy to prevent query failures if index is not created
        const q = query(
          coursesCol,
          where('instructorId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedCourses = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Course)
        );
        
        // Sort manually on the client-side
        fetchedCourses.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        
        const totalStudents = fetchedCourses.reduce((sum, course) => sum + course.students, 0);
        const totalRevenue = fetchedCourses.reduce((sum, course) => sum + (course.students * course.price), 0);

        setCourses(fetchedCourses);
        setStats({ totalStudents, totalRevenue });
        setIsFetching(false);
      };

      fetchCoursesAndStats();
    }
  }, [user, userData]);

  if (loading || isFetching || !userData || userData.role !== 'trainer') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const revenueShare = userData.revenueSharePercentage !== undefined ? userData.revenueSharePercentage : 70; // Default to 70%
  const yourEarnings = stats.totalRevenue * (revenueShare / 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="space-y-1">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
            Trainer Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome back, {userData.displayName}!</p>
        </div>
        <div className="flex items-center gap-2">
            <Button asChild>
            <Link href="/trainers/courses/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Course
            </Link>
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total sales from all your courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Revenue Share</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueShare}%</div>
            <p className="text-xs text-muted-foreground">
              Est. earnings: ${yourEarnings.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all your courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Your published courses
            </p>
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
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <Badge>Published</Badge>
                      </TableCell>
                      <TableCell>${course.price.toFixed(2)}</TableCell>
                      <TableCell>
                        {course.students.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Course actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem disabled>Edit Course</DropdownMenuItem>
                            <DropdownMenuItem disabled>Manage Content</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      You haven't created any courses yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
