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
    id: 'python-bootcamp',
    title: 'The Complete Python Bootcamp: From Zero to Hero',
    description:
      'Learn Python like a professional. Start from the basics and go all the way to creating your own applications and games.',
    instructor: 'Jose Portilla',
    price: 84.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Programming',
    rating: 4.7,
    students: 1750231,
    whatYoullLearn: [
      'Learn to use Python professionally, learning both Python 2 and Python 3!',
      'Create games with Python, like Tic Tac Toe and Blackjack!',
      'Learn advanced Python features, like the collections module and how to work with timestamps!',
      'Understand complex topics, like decorators.',
    ],
    lectures: [
      { id: 'l1', title: 'Course Introduction', duration: '12:45' },
      { id: 'l2', title: 'Python Setup', duration: '20:00' },
      { id: 'l3', title: 'Python Object and Data Structure Basics', duration: '45:15' },
    ],
  },
  {
    id: 'web-dev-bootcamp',
    title: 'The Complete 2024 Web Development Bootcamp',
    description:
      'Become a Full-Stack Web Developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps.',
    instructor: 'Dr. Angela Yu',
    price: 84.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Web Development',
    rating: 4.8,
    students: 987123,
    whatYoullLearn: [
      'Build 16 web development projects for your portfolio.',
      'Master frontend development with React.',
      'Master backend development with Node.js & Express.',
      'Learn professional developer best practices.',
    ],
    lectures: [
      { id: 'l1', title: 'Front-End Web Development', duration: '01:15:00' },
      { id: 'l2', title: 'Introduction to HTML', duration: '01:05:30' },
      { id: 'l3', title: 'Intermediate CSS', duration: '01:45:00' },
    ],
  },
  {
    id: 'excel-advanced',
    title: 'Microsoft Excel - From Beginner to Advanced',
    description:
      'Master Microsoft Excel from Beginner to Advanced. Build a solid understanding of the basics of Microsoft Excel.',
    instructor: 'Kyle Pew',
    price: 84.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Business & Office',
    rating: 4.7,
    students: 1004567,
    whatYoullLearn: [
      'Master Microsoft Excel from Beginner to Advanced.',
      'Build a solid understanding of the basics of Microsoft Excel.',
      'Learn the most common Excel functions used in the Office.',
      'Harness the full power of Microsoft Excel by automating your day to day tasks through Macros and VBA.',
    ],
    lectures: [
      { id: 'l1', title: 'Introduction to Excel', duration: '30:10' },
      { id: 'l2', title: 'Formulas and Functions', duration: '01:10:20' },
      { id: 'l3', title: 'Pivot Tables', duration: '50:00' },
    ],
  },
  {
    id: 'flutter-complete-guide',
    title: 'Flutter & Dart - The Complete Guide [2024 Edition]',
    description:
      'A complete guide to the Flutter framework for building beautiful, natively compiled, multi-platform applications from a single codebase.',
    instructor: 'Maximilian Schwarzmüller',
    price: 84.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Mobile Development',
    rating: 4.6,
    students: 754321,
    whatYoullLearn: [
      'Learn Flutter and Dart from the ground up, step-by-step.',
      'Build engaging native mobile apps for both Android and iOS.',
      'Use features like Google Maps, the camera, authentication and much more!',
      'Learn how to upload images and how to send manual and automated push notifications.',
    ],
    lectures: [
      { id: 'l1', title: 'Getting Started with Flutter', duration: '45:00' },
      { id: 'l2', title: 'Widgets, Styling & Layout', duration: '02:15:30' },
      { id: 'l3', title: 'State Management', duration: '01:50:00' },
    ],
  },
];
