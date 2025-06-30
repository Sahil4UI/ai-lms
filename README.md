
# LearnAI - AI-Powered Learning Management System

LearnAI is a feature-rich, production-ready Learning Management System (LMS) built with Next.js, Firebase, and Google's Gemini AI. It provides a seamless platform for trainers to create and sell courses and for students to learn with AI-powered assistance.

This project was built in Firebase Studio.

## Key Features

### For Students:
- **Multi-Provider Authentication**: Sign up & log in with Email/Password, Google, or Phone (OTP).
- **Course Discovery**: Browse a full catalog of courses with search functionality.
- **Rich Course Experience**: Watch video lectures, read lecture notes, and track progress.
- **AI Course Assistant**: Get instant answers to questions about the course content, available 24/7 on each course page.
- **AI-Powered Recommendations**: Receive personalized course suggestions on the dashboard based on learning history and interests.
- **Student Dashboard**: A central hub to view enrolled courses and track progress.
- **Certificate of Completion**: Receive a beautiful, printable certificate after completing a course.

### For Trainers:
- **Dedicated Trainer Role**: A separate sign-up flow for trainers.
- **Trainer Dashboard**: A CMS to manage courses, view revenue (stubbed), and student numbers.
- **Dynamic Course Creation**: An intuitive form to build a course from scratch:
    - Define title, description, category, and price.
    - List "What you'll learn" points.
    - Build a full curriculum with multiple lectures.
- **Video & Content Upload**: For each lecture, trainers can upload a video file directly to Firebase Storage and add supplementary notes in Markdown.

### For Admins:
- **Secure Admin Panel**: A separate, protected login for administrators (`/admin/login`).
- **Data Management**: View and manage all users, courses, and testimonials on the platform.
- **Testimonial CMS**: Add, edit, and delete testimonials that appear on the homepage.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) for components.
- **Backend**: [Firebase](https://firebase.google.com/)
    - **Authentication**: Firebase Authentication
    - **Database**: Firestore
    - **File Storage**: Firebase Storage (for video uploads)
- **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
    - Powers the AI Course Assistant and Recommendations.
- **Deployment**: Configured for [Vercel](https://vercel.com/) (recommended) and Firebase App Hosting.

## Local Setup & Installation

Follow these steps to run the project on your local machine.

### 1. Clone the Repository
Clone the project to your local machine.

### 2. Install Dependencies
Navigate to the project directory and install the required npm packages.
```bash
npm install
```

### 3. Configure Environment Variables
The application requires API keys for Firebase and Google AI. Create a file named `.env` in the root of your project and add the following keys.

You can get your Firebase keys from your Firebase project settings.
```env
# Firebase Public Keys (for client-side use)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123...
NEXT_PUBLIC_FIREBASE_APP_ID=1:123...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC...

# Google AI API Key (for server-side Genkit flows)
# IMPORTANT: This key must have the "Generative Language API" enabled in Google Cloud.
GOOGLE_API_KEY=AIza...
```

### 4. Run the Development Server
Start the Next.js development server.
```bash
npm run dev
```
The application should now be running on [http://localhost:9002](http://localhost:9002).

## Deployment

This project is optimized for deployment on Vercel.

### Deploying to Vercel
1. **Push to GitHub**: Push your project code to a new GitHub repository.
2. **Import to Vercel**: From your Vercel dashboard, import the GitHub repository. Vercel will automatically detect it as a Next.js project.
3. **Add Environment Variables**: In your Vercel project settings, go to **Settings > Environment Variables** and add all the keys from your `.env` file.
4. **Deploy**: Trigger a new deployment. Your site will be live!

