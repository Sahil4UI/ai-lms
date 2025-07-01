'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';

const revenueShareSchema = z.object({
  revenueShare: z.coerce
    .number()
    .min(0, 'Revenue share must be at least 0%.')
    .max(100, 'Revenue share cannot exceed 100%.'),
});

export async function updateTrainerRevenueShare(userId: string, prevState: any, formData: FormData) {
  if (!firestore) return { error: 'Firebase is not configured.' };
  if (!userId) return { error: 'User ID is missing.' };

  const data = Object.fromEntries(formData.entries());
  const validated = revenueShareSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      revenueSharePercentage: validated.data.revenueShare,
    });
    revalidatePath('/admin/dashboard/users');
    return { success: true, message: 'Revenue share updated successfully!' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update revenue share.' };
  }
}
