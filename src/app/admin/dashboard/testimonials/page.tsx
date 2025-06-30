'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Testimonial } from '@/lib/data';
import { Loader2, Trash2, Edit, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addTestimonial, updateTestimonial, deleteTestimonial } from './actions';

function TestimonialForm({
  testimonial,
  onSuccess,
}: {
  testimonial?: Testimonial;
  onSuccess: () => void;
}) {
  const action = testimonial ? updateTestimonial.bind(null, testimonial.id) : addTestimonial;
  const [state, formAction] = useFormState(action, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({ title: `Testimonial ${testimonial ? 'updated' : 'added'} successfully!` });
      onSuccess();
    }
    if (state?.error) {
      const errorMessage = typeof state.error === 'string' ? state.error : 'An error occurred.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  }, [state, toast, onSuccess, testimonial]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={testimonial?.name} required />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={testimonial?.title} required />
      </div>
      <div>
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" name="quote" defaultValue={testimonial?.quote} required />
      </div>
      <div>
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input id="avatar" name="avatar" defaultValue={testimonial?.avatar} type="url" required placeholder="https://placehold.co/100x100.png" />
      </div>
      <Button type="submit">{testimonial ? 'Update' : 'Add'} Testimonial</Button>
    </form>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(firestore, 'testimonials'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const testimonialsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(testimonialsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this testimonial?')) {
      const result = await deleteTestimonial(id);
      if (result.success) {
        toast({ title: 'Testimonial deleted successfully!' });
      } else {
        toast({ title: 'Error', description: 'Failed to delete testimonial.', variant: 'destructive' });
      }
    }
  };

  const handleEditClick = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingTestimonial(undefined);
    setIsFormOpen(true);
  };
  
  const closeDialog = () => {
    setIsFormOpen(false);
    setEditingTestimonial(undefined);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Testimonials</h1>
          <p className="text-muted-foreground">Add, edit, or delete testimonials shown on the homepage.</p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent onInteractOutside={closeDialog} onEscapeKeyDown={closeDialog}>
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? 'Edit' : 'Add New'} Testimonial</DialogTitle>
          </DialogHeader>
          <TestimonialForm testimonial={editingTestimonial} onSuccess={closeDialog} />
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map(testimonial => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <img src={testimonial.avatar} alt={testimonial.name} className="h-10 w-10 rounded-full object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{testimonial.quote}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(testimonial)}>
                          <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
