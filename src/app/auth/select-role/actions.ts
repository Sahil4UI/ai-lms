'use server';

import { firestore, auth } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateUserRole(userId: string, role: 'student' | 'trainer') {
    if (!firestore) return { error: 'Firebase not configured.' };
    if (!userId) return { error: 'User not found.' };
    if (!['student', 'trainer'].includes(role)) return { error: 'Invalid role specified.' };

    try {
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, { role: role });

        revalidatePath('/dashboard');
        revalidatePath('/trainers/dashboard');

    } catch (error) {
        console.error("Error updating user role:", error);
        return { error: 'Could not update role. Please try again.' };
    }

    // Redirect based on the chosen role
    if (role === 'trainer') {
        redirect('/trainers/dashboard');
    } else {
        redirect('/dashboard');
    }
}
