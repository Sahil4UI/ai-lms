'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Book, TestTube2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({ users: 0, courses: 0, testimonials: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const usersPromise = getDocs(collection(firestore, 'users'));
                const coursesPromise = getDocs(collection(firestore, 'courses'));
                const testimonialsPromise = getDocs(collection(firestore, 'testimonials'));

                const [usersSnapshot, coursesSnapshot, testimonialsSnapshot] = await Promise.all([usersPromise, coursesPromise, testimonialsPromise]);
                
                setStats({
                    users: usersSnapshot.size,
                    courses: coursesSnapshot.size,
                    testimonials: testimonialsSnapshot.size,
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.courses}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.testimonials}</div>
          </CardContent>
        </Card>
      </div>
       <p className="text-muted-foreground">Welcome to the admin dashboard. Here you can manage your platform's content and users.</p>
    </div>
  );
}
