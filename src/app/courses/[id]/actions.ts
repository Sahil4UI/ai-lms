'use server';

import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function applyCoupon(code: string) {
  if (!code) {
    return { error: 'Please enter a coupon code.' };
  }

  const normalizedCode = code.toUpperCase().trim();

  const couponsRef = collection(firestore, 'coupons');
  const q = query(
    couponsRef,
    where('code', '==', normalizedCode),
    where('isActive', '==', true)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { error: 'Invalid or expired coupon code.' };
  }

  const couponDoc = querySnapshot.docs[0];
  const coupon = couponDoc.data();

  return { success: true, discount: coupon.discountPercentage };
}


export async function enrollInCourse(courseId: string, userId: string, couponCode?: string) {
    if (!userId) {
        return { error: 'You must be logged in to enroll.' };
    }

    const userRef = doc(firestore, 'users', userId);
    const courseRef = doc(firestore, 'courses', courseId);
    
    try {
        const batch = writeBatch(firestore);

        // Add course to user's enrolled list
        batch.update(userRef, {
            enrolledCourses: arrayUnion(courseId)
        });

        // Increment student count on course
        batch.update(courseRef, {
            students: increment(1)
        });

        // If a coupon was used, increment its usage count
        if (couponCode) {
            const normalizedCode = couponCode.toUpperCase().trim();
            const couponsRef = collection(firestore, 'coupons');
            const q = query(couponsRef, where('code', '==', normalizedCode));
            const couponSnapshot = await getDocs(q);
            if (!couponSnapshot.empty) {
                const couponDocRef = couponSnapshot.docs[0].ref;
                batch.update(couponDocRef, {
                    usageCount: increment(1)
                });
            }
        }
        
        await batch.commit();

        revalidatePath(`/courses/${courseId}`);
        revalidatePath('/dashboard');

        return { success: true };

    } catch (error) {
        console.error("Enrollment error:", error);
        return { error: 'There was an error processing your enrollment. Please try again.' };
    }
}
