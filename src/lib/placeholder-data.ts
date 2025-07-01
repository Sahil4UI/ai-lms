import { type Course } from './data';

// Note: Using a public domain video for all placeholders.
// In a real app, each lecture would have its own unique video URL from Firebase Storage.
const placeholderVideoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const placeholderCourses: Course[] = [
  {
    id: 'course-1-web-dev',
    title: 'The Complete 2024 Web Development Bootcamp',
    description: 'Become a Full-Stack Web Developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps.',
    instructorId: 'placeholder-trainer-1',
    instructor: 'Dr. Angela Yu',
    price: 84.99,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'code on screen',
    category: 'Web Development',
    rating: 4.7,
    students: 125643,
    whatYoullLearn: [
      'Build 16 web development projects for your portfolio, ready to apply for junior developer jobs.',
      'Learn the latest technologies, including Javascript, React, Node and even Web3 development.',
      'Master frontend development with React',
      'Master backend development with Node.js & Express',
    ],
    lectures: [
      { id: 'l1', title: 'Introduction to Web Development', duration: '12:45', videoUrl: placeholderVideoUrl, videoFileName: 'intro.mp4', notes: 'This lecture covers the basics of how the web works.' },
      { id: 'l2', title: 'HTML 5 In-Depth', duration: '45:10', videoUrl: placeholderVideoUrl, videoFileName: 'html.mp4', notes: 'An in-depth look at semantic HTML and modern best practices.' },
      { id: 'l3', title: 'CSS - Styling for the Modern Web', duration: '1:12:30', videoUrl: placeholderVideoUrl, videoFileName: 'css.mp4', notes: 'Learn about Flexbox, Grid, and responsive design.' },
      { id: 'l4', title: 'JavaScript Fundamentals', duration: '2:30:00', videoUrl: placeholderVideoUrl, videoFileName: 'js.mp4', notes: 'Variables, data types, functions, and the DOM.' },
    ],
    createdAt: new Date('2024-01-15T10:00:00Z') as any,
  },
  {
    id: 'course-2-python',
    title: '100 Days of Code: The Complete Python Pro Bootcamp',
    description: 'Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!',
    instructorId: 'placeholder-trainer-1',
    instructor: 'Dr. Angela Yu',
    price: 79.99,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'python code',
    category: 'Python',
    rating: 4.8,
    students: 210987,
    whatYoullLearn: [
      'Be able to program in Python professionally',
      'Master the Python programming language by building 100 projects over 100 days',
      'Create a portfolio of 100 Python projects to apply for developer jobs',
      'Build GUIs and Desktop applications with Python',
    ],
    lectures: [
      { id: 'l1', title: 'Welcome to 100 Days of Code', duration: '10:15', videoUrl: placeholderVideoUrl, videoFileName: 'welcome.mp4', notes: 'Course overview and setup.' },
      { id: 'l2', title: 'Day 1 - Variables & Printing', duration: '25:50', videoUrl: placeholderVideoUrl, videoFileName: 'day1.mp4', notes: 'Your first steps into Python programming.' },
      { id: 'l3', title: 'Day 2 - Data Types and String Manipulation', duration: '35:20', videoUrl: placeholderVideoUrl, videoFileName: 'day2.mp4', notes: 'Working with numbers, strings, and f-strings.' },
    ],
    createdAt: new Date('2024-02-20T10:00:00Z') as any,
  },
  {
    id: 'course-3-excel',
    title: 'Microsoft Excel - Excel from Beginner to Advanced',
    description: 'Excel with this A-Z Microsoft Excel Course. Microsoft Excel 2010, 2013, 2016, Excel 2019 and Microsoft/Office 365/2024.',
    instructorId: 'placeholder-trainer-2',
    instructor: 'Kyle Pew',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'data spreadsheet',
    category: 'Business',
    rating: 4.6,
    students: 98543,
    whatYoullLearn: [
      'Master Microsoft Excel from Beginner to Advanced',
      'Build a solid understanding of the basics of Microsoft Excel',
      'Learn the most common Excel functions used in the Office',
      'Harness the full power of Microsoft Excel by automating your daily tasks through Macros and VBA',
    ],
    lectures: [
      { id: 'l1', title: 'Getting Started with Excel', duration: '15:00', videoUrl: placeholderVideoUrl, videoFileName: 'excel-intro.mp4', notes: 'A tour of the Excel interface.' },
      { id: 'l2', title: 'Essential Formulas & Functions', duration: '55:30', videoUrl: placeholderVideoUrl, videoFileName: 'excel-formulas.mp4', notes: 'SUM, AVERAGE, IF, and VLOOKUP.' },
    ],
    createdAt: new Date('2024-03-10T10:00:00Z') as any,
  },
  {
    id: 'course-4-flutter',
    title: 'The Complete Flutter Development Bootcamp with Dart',
    description: 'Officially created in collaboration with the Google Flutter team. Learn Flutter and Dart from the ground up, step-by-step.',
    instructorId: 'placeholder-trainer-1',
    instructor: 'Dr. Angela Yu',
    price: 89.99,
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'mobile app development',
    category: 'Mobile Development',
    rating: 4.7,
    students: 76543,
    whatYoullLearn: [
      'Build beautiful, fast and native-quality apps with Flutter',
      'Become a fully-fledged Flutter developer',
      'Build iOS and Android apps with just one codebase',
      'Understand all the fundamental concepts of Flutter development',
    ],
    lectures: [
        { id: 'l1', title: 'Introduction to Flutter and Dart', duration: '20:00', videoUrl: placeholderVideoUrl, videoFileName: 'flutter-intro.mp4', notes: 'Setting up your environment and running your first app.' },
    ],
    createdAt: new Date('2024-04-05T10:00:00Z') as any,
  }
];
