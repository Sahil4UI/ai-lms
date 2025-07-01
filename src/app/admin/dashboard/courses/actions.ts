'use server';

import { revalidatePath } from 'next/cache';
import { firestore, storage } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { Course } from '@/lib/data';

// Helper function to recursively delete a folder in Firebase Storage
async function deleteFolder(path: string) {
    const listRef = ref(storage, path);
    const res = await listAll(listRef);

    const deletePromises = res.items.map((itemRef) => deleteObject(itemRef));
    await Promise.all(deletePromises);

    for (const prefix of res.prefixes) {
        await deleteFolder(prefix.fullPath);
    }
}


export async function deleteCourse(course: Course) {
  if (!firestore || !storage) return { error: 'Firebase is not configured.' };
  
  try {
    const courseId = course.id;
    // 1. Delete Firestore document
    const docRef = doc(firestore, 'courses', courseId);
    await deleteDoc(docRef);

    // 2. Delete associated videos from Firebase Storage
    // This is a best-effort deletion. In a production app with many files,
    // this might be better handled by a scheduled Cloud Function to avoid timeouts.
    const courseFolderRef = `courses/${courseId}`;
    await deleteFolder(courseFolderRef);
    
    revalidatePath('/admin/dashboard/courses');
    revalidatePath('/admin/dashboard');

    return { success: true, message: 'Course and all associated videos deleted.' };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete course.' };
  }
}
