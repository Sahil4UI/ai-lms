'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, GraduationCap, Mic } from 'lucide-react';
import { updateUserRole } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

export default function SelectRolePage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // If the user somehow lands here but already has a role, redirect them.
    if (!loading && userData?.role) {
      if (userData.role === 'trainer') {
        router.push('/trainers/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, userData, loading, router]);

  const handleRoleSelection = async (role: 'student' | 'trainer') => {
    if (!user) {
        toast({ title: 'Error', description: 'You must be logged in to select a role.', variant: 'destructive'});
        return;
    }
    setIsSubmitting(true);
    const result = await updateUserRole(user.uid, role);
    if (result?.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive'});
        setIsSubmitting(false);
    }
    // On success, the action handles the redirect.
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
           <Icons.logo className="mx-auto h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-bold">One Last Step!</CardTitle>
          <CardDescription>
            Help us personalize your experience. Are you here to learn or to teach?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3 text-center"
            onClick={() => handleRoleSelection('student')}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
                <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
                <>
                 <GraduationCap className="h-8 w-8 text-primary" />
                 <div className="text-base font-semibold">I'm a Student</div>
                 <p className="text-xs text-muted-foreground">Browse courses and start your learning journey.</p>
                </>
            )}
          </Button>
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3 text-center"
            onClick={() => handleRoleSelection('trainer')}
            disabled={isSubmitting}
          >
             {isSubmitting ? (
                <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
                <>
                    <Mic className="h-8 w-8 text-primary" />
                    <div className="text-base font-semibold">I'm a Trainer</div>
                    <p className="text-xs text-muted-foreground">Share your expertise and create engaging courses.</p>
                </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
