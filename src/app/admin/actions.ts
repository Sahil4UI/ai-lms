'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// For simplicity, we'll use a simple cookie-based session.
// In a real production app, consider using a more robust solution like iron-session or NextAuth.js.
const SESSION_COOKIE_NAME = 'learnai-admin-session';

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // IMPORTANT: Hardcoded credentials are for demonstration purposes only.
  // In a real application, use a secure way to store and verify admin credentials.
  if (username === 'admin' && password === 'admin') {
    const sessionData = JSON.stringify({ isLoggedIn: true, user: 'admin' });
    
    cookies().set(SESSION_COOKIE_NAME, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    redirect('/admin/dashboard');
  }

  return { error: 'Invalid username or password.' };
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}

export async function getSession() {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return { isLoggedIn: false };
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return { isLoggedIn: false };
  }
}
