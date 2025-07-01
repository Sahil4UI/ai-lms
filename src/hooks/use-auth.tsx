'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Preloader } from '@/components/preloader';
import { auth, firestore } from '@/lib/firebase';

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role?: 'student' | 'trainer';
  enrolledCourses?: string[];
  revenueSharePercentage?: number;
  createdAt: Timestamp;
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

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth || !firestore) {
      console.warn("Firebase not configured. AuthProvider cannot function.");
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);

      if (authUser) {
        const userDocRef = doc(firestore, 'users', authUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          const fetchedUserData = doc.exists() ? (doc.data() as UserData) : null;
          setUserData(fetchedUserData);
          
          if (fetchedUserData && !fetchedUserData.role) {
            // This is a new user (from Google/Phone) who needs to select a role.
            if (pathname !== '/auth/select-role') {
              router.push('/auth/select-role');
            }
          } else if (fetchedUserData && fetchedUserData.role) {
            // User has a role, handle redirects away from auth pages
            if (pathname.startsWith('/auth')) {
                if (fetchedUserData.role === 'trainer') {
                    router.push('/trainers/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [pathname, router]);


  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {loading ? <Preloader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
