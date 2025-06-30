# LearnAI - AI-Powered Learning Management System

LearnAI is a feature-rich, production-ready Learning Management System (LMS) built with Next.js, Firebase, and Google's Gemini AI. It provides a seamless platform for trainers to create and sell courses and for students to learn with AI-powered assistance.

This project was built in Firebase Studio.

## Key Features

### For Students:
- **Multi-Provider Authentication**: Sign up & log in with Email/Password, Google, or Phone (OTP).
- **Course Discovery**: Browse a full catalog of courses with search functionality.
- **Rich Course Experience**: Watch video lectures, read lecture notes, and track progress.
- **AI Course Assistant**: Get instant answers to questions about the course content, available 24/7 on each course page. It features conversational memory to understand follow-up questions.
- **AI-Powered Recommendations**: Receive personalized course suggestions on the dashboard based on learning history and interests.
- **Student Dashboard**: A central hub to view enrolled courses and track progress.
- **Certificate of Completion**: Receive a beautiful, printable certificate after completing a course.
- **Coupon System**: Apply admin-created coupon codes at checkout for discounts.

### For Trainers:
- **Dedicated Trainer Role**: A separate sign-up flow for trainers.
- **Trainer Dashboard**: A CMS to manage courses, view student numbers, and see mock revenue data.
- **Dynamic Course Creation**: An intuitive form to build a course from scratch:
    - Define title, description, category, and price.
    - List "What you'll learn" points.
    - Build a full curriculum with multiple lectures.
- **Video & Content Upload**: For each lecture, trainers can upload a video file directly to Firebase Storage and add supplementary notes in Markdown.

### For Admins:
- **Secure Admin Panel**: A separate, protected login for administrators (`/admin/login`).
- **Data Management**: View and manage all users, courses, and testimonials.
- **Testimonial CMS**: Add, edit, and delete testimonials that appear on the homepage.
- **Coupon Management**: Create, edit, delete, and track usage of discount coupons for the platform.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [ShadCN UI](https://ui.shadcn.com/) for components.
- **Backend**: [Firebase](https://firebase.google.com/)
    - **Authentication**: Firebase Authentication
    - **Database**: Firestore
    - **File Storage**: Firebase Storage (for video uploads)
- **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: Configured for [Vercel](https://vercel.com/) (recommended) and Firebase App Hosting.

---

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
The application requires API keys for Firebase and Google AI. Create a file named `.env` in the root of your project and add the following keys. You can get your Firebase keys from your Firebase project settings.

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

---

## Security Best Practices

To run this in production, ensure you configure Firebase Security Rules.

### Firestore Rules
Go to your **Firebase Console -> Firestore Database -> Rules**. These rules are a good starting point. They allow anyone to read public data (like courses) but restrict writing to authenticated users for their own data.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for courses and testimonials
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'trainer';
    }
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
    match /coupons/{couponId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.token.role == 'admin';
    }

    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Lock down other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Storage Rules
Go to **Firebase Console -> Storage -> Rules**. This prevents unauthorized video uploads.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read for all course materials
    match /courses/{courseId}/{allPaths=**} {
      allow read: if true;
    }
    // Only allow authenticated trainers to upload to their course folders
    match /courses/{courseId}/{lectureId}/{fileName} {
       allow write: if request.auth != null && request.auth.token.role == 'trainer';
    }
  }
}
```

---

## Commercialization Roadmap (Next Steps)

This platform is a powerful foundation. To turn it into a commercial business that processes payments and pays trainers, you'll need to implement the following.

### 1. Payment Gateway Integration (Stripe)
- **Goal:** To accept payments from students for courses.
- **How:**
    1.  Create a [Stripe](https://stripe.com) account.
    2.  Install the Stripe Node.js library (`npm install stripe`).
    3.  Create a **Firebase Cloud Function** that acts as your secure backend. This function will create a Stripe "Checkout Session".
    4.  When a student clicks "Enroll", your frontend will call this Cloud Function.
    5.  The function returns a Stripe Checkout URL, and you redirect the student to Stripe's secure payment page.
    6.  Use Stripe Webhooks to listen for successful payment events. When a payment succeeds, another Cloud Function will trigger to update your Firestore database, officially enrolling the student in the course.

### 2. Trainer Payouts (Stripe Connect)
- **Goal:** To automatically split revenue and pay your trainers.
- **How:**
    1.  Use **Stripe Connect**, which is designed for marketplaces.
    2.  **Onboarding:** Create a UI in the Trainer Dashboard where trainers can connect their Stripe account or create a new one. Stripe handles all the bank account and identity verification securely.
    3.  **Payment Splitting:** When creating the Stripe Checkout Session (in your Cloud Function), you will specify the `application_fee_amount`. This tells Stripe how much of the payment to keep for your platform (the admin's cut) and how much to send to the trainer's connected account.
    4.  Stripe handles the rest, including payouts to the trainer's bank account.

### 3. Backend Logic (Firebase Cloud Functions)
- **Goal:** To handle all sensitive logic securely.
- **Why:** You should never trust the client-side application with sensitive operations like payment processing or database writes that affect multiple users. Firebase Functions provide a secure, serverless backend environment to run this code.
- **Use Cases:**
    - Creating Stripe payment sessions.
    - Listening to Stripe webhooks for successful payments.
    - Sending "New Course" email notifications to students.

---

## Deployment

This project is optimized for deployment on Vercel.

1.  **Push to GitHub**: Push your project code to a new GitHub repository.
2.  **Import to Vercel**: From your Vercel dashboard, import the GitHub repository. Vercel will automatically detect it as a Next.js project.
3.  **Add Environment Variables**: In your Vercel project settings, go to **Settings > Environment Variables** and add all the keys from your `.env` file.
4.  **Deploy**: Trigger a new deployment. Your site will be live!
