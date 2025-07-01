'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { z } from 'zod';
import type { Testimonial } from '@/lib/data';

const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required.'),
  name: z.string().min(1, 'Name is required.'),
  title: z.string().min(1, 'Title is required.'),
  avatar: z.string().url('Avatar must be a valid URL.'),
});

export async function addTestimonial(prevState: any, formData: FormData) {
  if (!firestore) return { error: 'Firebase is not configured.' };

  const data = Object.fromEntries(formData.entries());
  
  const validated = testimonialSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await addDoc(collection(firestore, 'testimonials'), validated.data);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to add testimonial.' };
  }
}

export async function updateTestimonial(id: string, prevState: any, formData: FormData) {
  if (!firestore) return { error: 'Firebase is not configured.' };

  const data = Object.fromEntries(formData.entries());

  const validated = testimonialSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }
  
  try {
    const docRef = doc(firestore, 'testimonials', id);
    await updateDoc(docRef, validated.data);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update testimonial.' };
  }
}

export async function deleteTestimonial(id: string) {
  if (!firestore) return { error: 'Firebase is not configured.' };

  try {
    const docRef = doc(firestore, 'testimonials', id);
    await deleteDoc(docRef);
    revalidatePath('/');
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete testimonial.' };
  }
}
