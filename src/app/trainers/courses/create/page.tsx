'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

const lectureSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  duration: z.string().min(1, 'Duration is required'),
});

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  whatYoullLearn: z.array(z.object({ value: z.string().min(1, 'This field cannot be empty') })).min(2, 'Provide at least 2 learning points'),
  lectures: z.array(lectureSchema).min(1, 'Provide at least 1 lecture'),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: 0,
      whatYoullLearn: [{ value: '' }, { value: '' }],
      lectures: [{ id: `l${Date.now()}`, title: '', duration: '' }],
    },
  });

  const { fields: learnFields, append: appendLearn, remove: removeLearn } = useFieldArray({
    control: form.control,
    name: 'whatYoullLearn',
  });

  const { fields: lectureFields, append: appendLecture, remove: removeLecture } = useFieldArray({
    control: form.control,
    name: 'lectures',
  });

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'trainer')) {
      toast({ title: "Unauthorized", description: "You must be a trainer to create a course.", variant: "destructive" });
      router.push('/dashboard');
    }
  }, [user, userData, authLoading, router, toast]);

  const onSubmit = async (data: CourseFormValues) => {
    if (!user || !userData) {
        toast({ title: 'Authentication Error', description: 'Could not verify user.', variant: 'destructive' });
        return;
    }

    try {
      await addDoc(collection(firestore, 'courses'), {
        ...data,
        whatYoullLearn: data.whatYoullLearn.map(item => item.value),
        instructorId: user.uid,
        instructor: userData.displayName,
        imageUrl: 'https://placehold.co/600x400.png', // Placeholder
        imageHint: data.category.toLowerCase(),
        rating: 0, // Initial value
        students: 0, // Initial value
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Course Created!', description: 'Your new course has been saved.' });
      router.push('/trainers/dashboard');
    } catch (error) {
      console.error("Error creating course: ", error);
      toast({ title: 'Error', description: 'Could not create course. Please try again.', variant: 'destructive' });
    }
  };

  if (authLoading || !user || !userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Course</CardTitle>
          <CardDescription>Fill out the details below to launch your new course.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl><Input placeholder="e.g., The Complete JavaScript Masterclass" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe your course in detail..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl><Input placeholder="e.g., Web Development" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 84.99" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-base font-semibold">What You'll Learn</Label>
                <div className="space-y-4 mt-2">
                  {learnFields.map((field, index) => (
                     <FormField
                        key={field.id}
                        control={form.control}
                        name={`whatYoullLearn.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl><Input placeholder={`Learning point ${index + 1}`} {...field} /></FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeLearn(index)} disabled={learnFields.length <= 1}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendLearn({ value: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Learning Point
                  </Button>
                </div>
              </div>

               <div>
                <Label className="text-base font-semibold">Lectures</Label>
                <div className="space-y-4 mt-2">
                  {lectureFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="grid gap-4 flex-1">
                             <FormField
                                control={form.control}
                                name={`lectures.${index}.title`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lecture Title</FormLabel>
                                    <FormControl><Input placeholder={`Lecture ${index + 1} Title`} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`lectures.${index}.duration`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <FormControl><Input placeholder="e.g., 15:30" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeLecture(index)} disabled={lectureFields.length <= 1} className="mt-8">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendLecture({ id: `l${Date.now()}`, title: '', duration: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Lecture
                  </Button>
                </div>
              </div>
              
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Course
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
