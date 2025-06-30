
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
    // Check if Firebase was initialized correctly. The `auth` object might not have methods if keys are missing.
    if (!auth?.onAuthStateChanged) {
        console.warn("Firebase auth is not fully initialized. Skipping auth state changes.");
        setTimeout(() => setLoading(false), 500);
        return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
        // If there's no authenticated user, stop loading and clear data.
        setUserData(null);
        setTimeout(() => setLoading(false), 500); // Delay to prevent flash of content
      }
      // If there is a user, the snapshot listener below will handle setting data and loading state.
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};

    if (user) {
      // If a user is authenticated, listen for changes to their document in Firestore.
      const userDocRef = doc(firestore, 'users', user.uid);
      unsubscribeSnapshot = onSnapshot(userDocRef, (userDoc) => {
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          // This case can happen if a user exists in Auth but not in Firestore.
          setUserData(null);
        }
        setTimeout(() => setLoading(false), 500); // Stop loading after data is fetched.
      });
    }

    // Cleanup the snapshot listener when the user changes or component unmounts.
    return () => unsubscribeSnapshot();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? <Preloader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
