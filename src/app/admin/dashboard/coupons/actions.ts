'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters.').max(20).trim().toUpperCase(),
  discountPercentage: z.coerce.number().min(1, 'Discount must be at least 1%.').max(100, 'Discount cannot exceed 100%.'),
  isActive: z.preprocess((val) => val === 'on', z.boolean()).default(true)
});

export async function addCoupon(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validated = couponSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await addDoc(collection(firestore, 'coupons'), {
      ...validated.data,
      usageCount: 0,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/admin/dashboard/coupons');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Coupon added successfully!' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to add coupon. The code may already exist.' };
  }
}

export async function updateCoupon(id: string, prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validated = couponSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }
  
  try {
    const docRef = doc(firestore, 'coupons', id);
    await updateDoc(docRef, validated.data);
    revalidatePath('/admin/dashboard/coupons');
    return { success: true, message: 'Coupon updated successfully!' };
  } catch (error) {
    return { error: 'Failed to update coupon.' };
  }
}

export async function deleteCoupon(id: string) {
  try {
    const docRef = doc(firestore, 'coupons', id);
    await deleteDoc(docRef);
    revalidatePath('/admin/dashboard/coupons');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete coupon.' };
  }
}
