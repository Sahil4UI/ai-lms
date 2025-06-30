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
  imageHint: string;
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
    imageHint: 'python code',
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
      { id: 'l4', title: 'Advanced Python Modules', duration: '30:00' },
      { id: 'l5', title: 'Web Scraping with Python', duration: '55:30' },
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
    imageHint: 'web development',
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
      { id: 'l4', title: 'Javascript for Beginners', duration: '02:30:00' },
      { id: 'l5', title: 'The Document Object Model (DOM)', duration: '01:25:00' },
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
    imageHint: 'excel spreadsheet',
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
      { id: 'l4', title: 'Advanced Charting', duration: '45:00' },
      { id: 'l5', title: 'Introduction to VBA', duration: '01:15:00' },
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
    imageHint: 'mobile app',
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
      { id: 'l4', title: 'Working with Device Features', duration: '01:35:00' },
      { id: 'l5', title: 'Firebase Integration', duration: '01:40:00' },
    ],
  },
  {
    id: 'mysql-database',
    title: 'The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert',
    description:
      'Master SQL, Database Management & Design. Includes Exercises, Challenges and a Certificate of Completion. A-Z Mastery!',
    instructor: 'Colt Steele',
    price: 79.99,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'database server',
    category: 'Databases',
    rating: 4.7,
    students: 543210,
    whatYoullLearn: [
      'Create, read, update, and delete data from databases.',
      'Write complex SQL queries across multiple tables.',
      'Design and manage robust database schemas.',
      'Work with string functions, aggregation, and logical operators.',
    ],
    lectures: [
      { id: 'l1', title: 'Introduction to Databases and SQL', duration: '35:00' },
      { id: 'l2', title: 'CRUD Operations', duration: '01:10:00' },
      { id: 'l3', title: 'Advanced Selections & Joins', duration: '01:45:00' },
      { id: 'l4', title: 'Database Design and Normalization', duration: '01:20:00' },
      { id: 'l5', title: 'Triggers and Views', duration: '55:00' },
    ],
  },
  {
    id: 'data-science-python',
    title: 'Python for Data Science and Machine Learning Bootcamp',
    description:
      'Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, and more!',
    instructor: 'Sahil',
    price: 89.99,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'data science chart',
    category: 'Data Science',
    rating: 4.8,
    students: 1234567,
    whatYoullLearn: [
      'Use Python for Data Science and Machine Learning.',
      'Implement Machine Learning Algorithms.',
      'Learn to use Pandas for Data Analysis.',
      'Create stunning data visualizations with Matplotlib and Seaborn.',
    ],
    lectures: [
      { id: 'l1', title: 'Introduction to Data Science', duration: '25:00' },
      { id: 'l2', title: 'NumPy Arrays', duration: '01:30:00' },
      { id: 'l3', title: 'Pandas DataFrames', duration: '02:00:00' },
      { id: 'l4', title: 'Data Visualization', duration: '01:45:00' },
      { id: 'l5', title: 'Machine Learning Overview', duration: '02:10:00' },
    ],
  }
];
