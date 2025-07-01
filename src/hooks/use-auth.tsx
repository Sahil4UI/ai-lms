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
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setInitialLoad(false);
      return;
    }
    
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
          // If there is no user, we can stop loading.
          setUserData(null);
          setLoading(false);
          if (initialLoad) setInitialLoad(false);
      }
    });
    
    return () => unsubscribeAuth();
  }, [initialLoad]);

  useEffect(() => {
    if (!user) {
        // This case is handled by the onAuthStateChanged listener.
        return;
    }

    if (!firestore) {
        setUserData(null);
        setLoading(false);
        if (initialLoad) setInitialLoad(false);
        return;
    }

    setLoading(true);
    const userDocRef = doc(firestore, 'users', user.uid);
    const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
        setUserData(doc.exists() ? (doc.data() as UserData) : null);
        setLoading(false);
        if (initialLoad) setInitialLoad(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setUserData(null);
        setLoading(false);
        if (initialLoad) setInitialLoad(false);
      });

    return () => unsubscribeSnapshot();
  }, [user, initialLoad]);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {initialLoad ? <Preloader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
