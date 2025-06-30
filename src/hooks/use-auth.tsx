'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        // No user, so we can stop loading
        setUserData(null);
        setTimeout(() => setLoading(false), 500);
      }
      // If there is a user, the snapshot listener below will handle setting data and loading state
    });

    return () => unsubscribeAuth();
  }, []);
  
  useEffect(() => {
    if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (userDoc) => {
             if (userDoc.exists()) {
                setUserData(userDoc.data() as UserData);
             } else {
                setUserData(null);
             }
             setTimeout(() => setLoading(false), 500);
        });
        return () => unsubscribeSnapshot();
    }
  }, [user]);


  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? (
        <Preloader />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
