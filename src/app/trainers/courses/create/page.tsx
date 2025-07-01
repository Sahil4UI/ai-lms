
import type { Metadata } from 'next';
import CreateCourseForm from './create-course-form';

export const metadata: Metadata = {
  title: 'Create Course',
  description: 'Build and launch your new course on LearnAI.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCoursePage() {
  return <CreateCourseForm />;
}
