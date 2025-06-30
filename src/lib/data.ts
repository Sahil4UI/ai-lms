import { Timestamp } from "firebase/firestore";

export type Lecture = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  videoFileName: string;
  notes?: string;
};

export type Course = {
  id: string; // Document ID from Firestore
  title: string;
  description: string;
  instructorId: string; // UID of the trainer
  instructor: string; // Display name of the trainer
  price: number;
  imageUrl: string;
  imageHint: string;
  category: string;
  rating: number; // This would be calculated dynamically later
  students: number; // This would be incremented
  whatYoullLearn: string[];
  lectures: Lecture[];
  createdAt: Timestamp;
};
