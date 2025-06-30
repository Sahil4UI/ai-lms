export type Lecture = {
  id: string;
  title: string;
  duration: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  students: number;
  lectures: Lecture[];
  whatYoullLearn: string[];
};

export const courses: Course[] = [
  {
    id: 'cs101',
    title: 'Introduction to Python Programming',
    description:
      'A comprehensive introduction to the Python programming language for beginners. Learn about variables, data types, control structures, functions, and more.',
    instructor: 'Dr. Ada Lovelace',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Programming',
    rating: 4.8,
    students: 12543,
    whatYoullLearn: [
      'Fundamentals of Python 3',
      'Data structures like lists, dictionaries, and tuples',
      'Object-Oriented Programming concepts',
      'How to build simple applications',
    ],
    lectures: [
      { id: 'l1', title: 'Welcome & Setup', duration: '10:32' },
      { id: 'l2', title: 'Variables and Data Types', duration: '25:15' },
      { id: 'l3', title: 'Control Flow', duration: '35:45' },
    ],
  },
  {
    id: 'ds201',
    title: 'Data Structures & Algorithms in Java',
    description:
      'Master the most important data structures and algorithms. A critical course for interviews and a strong CS foundation.',
    instructor: 'Dr. Alan Turing',
    price: 79.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Algorithms',
    rating: 4.9,
    students: 9876,
    whatYoullLearn: [
      'Analysis of algorithm complexity (Big O)',
      'Arrays, Linked Lists, Stacks, Queues',
      'Trees, Graphs, and Hash Tables',
      'Sorting and searching algorithms',
    ],
    lectures: [
      { id: 'l1', title: 'Introduction to Big O', duration: '22:00' },
      { id: 'l2', title: 'Arrays & Linked Lists', duration: '45:10' },
      { id: 'l3', title: 'Trees and Traversal', duration: '55:30' },
    ],
  },
  {
    id: 'web301',
    title: 'Full-Stack Web Development with Next.js',
    description:
      'Learn to build modern, fast, and scalable web applications using React, Next.js, and Node.js. Covers front-end and back-end development.',
    instructor: 'Dr. Grace Hopper',
    price: 99.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Web Development',
    rating: 4.7,
    students: 15234,
    whatYoullLearn: [
      'Building UI with React and Tailwind CSS',
      'Server-side rendering with Next.js',
      'Creating RESTful APIs with Node.js/Express',
      'Database integration with Prisma',
    ],
    lectures: [
      { id: 'l1', title: 'React Fundamentals', duration: '01:10:05' },
      { id: 'l2', title: 'Diving into Next.js', duration: '01:30:45' },
      { id: 'l3', title: 'Building the API', duration: '01:25:00' },
    ],
  },
  {
    id: 'ml401',
    title: 'Machine Learning A-Z',
    description:
      'Become a machine learning engineer. This course covers everything from linear regression to deep learning with TensorFlow.',
    instructor: 'Dr. Yann LeCun',
    price: 129.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'AI & ML',
    rating: 4.8,
    students: 8452,
    whatYoullLearn: [
      'Data preprocessing and visualization',
      'Regression, Classification, and Clustering models',
      'Building Artificial Neural Networks (ANNs)',
      'Natural Language Processing (NLP) basics',
    ],
    lectures: [
      { id: 'l1', title: 'The ML Landscape', duration: '15:20' },
      { id: 'l2', title: 'Linear Regression', duration: '40:50' },
      { id: 'l3', title: 'Deep Learning with TensorFlow', duration: '01:45:10' },
    ],
  },
];
