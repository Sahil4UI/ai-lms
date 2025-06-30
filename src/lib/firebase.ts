import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;
let analytics: Promise<Analytics | null>;

// Conditionally initialize Firebase only if the API key is provided
if (firebaseConfig.apiKey) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
  analytics = isSupported().then(yes => (yes ? getAnalytics(app) : null));
} else {
    // This is a fallback for when the environment variables are not set.
    // This will prevent the app from crashing, but Firebase features will not work.
    console.warn("Firebase config is missing. Firebase features will be disabled. Please set up your .env file as instructed in README.md");

    // Provide mock/dummy objects to avoid crashing the app on import
    app = {} as FirebaseApp;
    auth = {} as Auth;
    firestore = {} as Firestore;
    storage = {} as FirebaseStorage;
    analytics = Promise.resolve(null);
}


export { app, auth, firestore, storage, analytics };
