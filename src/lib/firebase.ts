import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBhxdRKa3TcRbkGaXDngRh_yb-feyZL4O0",
  authDomain: "ai-lms-2100f.firebaseapp.com",
  projectId: "ai-lms-2100f",
  storageBucket: "ai-lms-2100f.appspot.com",
  messagingSenderId: "1003259421811",
  appId: "1:1003259421811:web:2806bc962544e6c75f7606",
  measurementId: "G-LWH15KNW6N"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = isSupported().then(yes => (yes ? getAnalytics(app) : null));


export { app, auth, firestore, storage, analytics };
