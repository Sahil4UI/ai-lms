'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { Preloader } from '@/components/preloader';
import { auth, firestore } from '@/lib/firebase';

interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'trainer';
  enrolledCourses?: string[];
  // any other fields from your user document
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on mount to set up all auth and data listeners.
    if (!auth || !firestore) {
      console.warn("Firebase not configured. AuthProvider cannot function.");
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);

      if (authUser) {
        // User is logged in, set up a listener for their data in Firestore.
        const userDocRef = doc(firestore, 'users', authUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          setUserData(doc.exists() ? (doc.data() as UserData) : null);
          setLoading(false); // Stop loading only after we have auth AND user data.
        }, (error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
          setLoading(false);
        });

        // Return a cleanup function for the Firestore listener.
        return () => unsubscribeSnapshot();
      } else {
        // User is not logged in.
        setUserData(null);
        setLoading(false); // Stop loading.
      }
    });

    // Return the cleanup function for the auth listener.
    return () => unsubscribeAuth();
  }, []); // Empty dependency array means this runs only once on mount.


  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? <Preloader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
