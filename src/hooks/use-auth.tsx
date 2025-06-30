'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User, Unsubscribe } from 'firebase/auth';
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
  const [loading, setLoading] = useState(true); // Always start loading

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      // If there is no user, we can stop loading.
      if (!authUser) {
          setUserData(null);
          setLoading(false);
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
        // This case is handled by the onAuthStateChanged listener, which will set loading to false.
        return;
    }

    if (!firestore) {
        setUserData(null);
        setLoading(false);
        return;
    }

    // When we have a user, but haven't fetched their data yet, we are loading.
    setLoading(true);
    const userDocRef = doc(firestore, 'users', user.uid);
    const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
        setUserData(doc.exists() ? (doc.data() as UserData) : null);
        setLoading(false); // Stop loading once user data is fetched
      }, (error) => {
        console.error("Error fetching user data:", error);
        setUserData(null);
        setLoading(false); // Also stop loading on error
      });

    return () => unsubscribeSnapshot();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? <Preloader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
