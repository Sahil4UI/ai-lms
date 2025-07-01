
import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { type Course } from '@/lib/data';
import CourseDetailPageClient from './course-detail-page';

// This function generates dynamic metadata for each course page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  if (!firestore) {
    return {
      title: 'Course',
      description: 'View course details.'
    }
  }

  const courseRef = doc(firestore, 'courses', params.id);
  const courseSnap = await getDoc(courseRef);

  if (!courseSnap.exists()) {
    return {
      title: 'Course Not Found',
    };
  }
  const course = courseSnap.data() as Course;
  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [
        {
          url: course.imageUrl,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
     twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: course.description,
      images: [course.imageUrl],
    },
  };
}

// This is the main page component, which is a Server Component.
// It simply renders the client component which handles data fetching and interactivity.
export default function CourseDetailPage({ params }: { params: { id: string } }) {
  return <CourseDetailPageClient params={params} />;
}
