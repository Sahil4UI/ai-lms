'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'selection' | 'email' | 'phone'>('selection');

  // Phone state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneIsLoading, setPhoneIsLoading] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // This effect sets up the invisible reCAPTCHA verifier for phone auth.
    if (view === 'phone' && auth && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {},
      });
      // It's important to render the reCAPTCHA container
      recaptchaVerifierRef.current.render();
    }
  }, [view]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // The useAuth hook will handle redirection based on role
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // When a user signs in with a social provider or phone for the first time,
  // we create their user document in Firestore but OMIT the 'role'.
  // The useAuth hook will then detect the missing role and redirect them to the role selection page.
  const handleUserCreationInDb = async (user: User) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        createdAt: serverTimestamp(),
        // role is intentionally omitted to trigger the role selection page
      });
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleUserCreationInDb(result.user);
      // The useAuth hook will handle redirection to dashboard or role selection
    } catch (error: any) {
      toast({
        title: 'Google Login Failed',
        description: error.message || 'Could not log in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!auth) return;
    if (!phone.startsWith('+')) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please include your country code (e.g., +1 for USA).',
        variant: 'destructive',
      });
      return;
    }
    setPhoneIsLoading(true);
    try {
      const verifier = recaptchaVerifierRef.current!;
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'Please check your phone for the OTP.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Failed to send OTP',
        description: error.message || 'Something went wrong. Please check the phone number and try again.',
        variant: 'destructive',
      });
    } finally {
      setPhoneIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult || !otp) return;
    setPhoneIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      await handleUserCreationInDb(result.user);
      // The useAuth hook will handle redirection to dashboard or role selection
    } catch (error: any) {
      toast({
        title: 'OTP Verification Failed',
        description: error.message || 'The OTP is incorrect. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPhoneIsLoading(false);
    }
  };

  const renderSelection = () => (
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <Icons.logo className="mx-auto h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-bold font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Choose a method to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <Button onClick={() => setView('email')} className="w-full">
                Continue with Email
            </Button>
            <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Icons.google className="mr-2 h-4 w-4" />
                )}
                Login with Google
            </Button>
             <Button onClick={() => setView('phone')} variant="outline" className="w-full">
                Continue with Phone
            </Button>
             <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="underline">
                Sign up
                </Link>
            </div>
        </CardContent>
      </Card>
  );

  const renderEmailLogin = () => (
      <Card className="mx-auto max-w-sm">
        <CardHeader className="relative flex-row items-center justify-center pt-8">
           <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setView('selection')}>
              <ArrowLeft className="h-4 w-4" />
           </Button>
          <CardTitle className="text-2xl font-bold font-headline text-center">Login with Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" {...register('password')} disabled={isLoading} />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
  );

  const renderPhoneLogin = () => (
     <Card className="mx-auto max-w-sm">
        <CardHeader className="relative flex-row items-center justify-center pt-8">
          <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => {
              setView('selection');
              setIsOtpSent(false);
          }}>
              <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold font-headline text-center">Login with Phone</CardTitle>
        </CardHeader>
        <CardContent>
            <div id="recaptcha-container"></div>
            {!isOtpSent ? (
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 123 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={phoneIsLoading}
                    />
                </div>
                <Button onClick={handleSendOtp} className="w-full" disabled={phoneIsLoading || !phone}>
                    {phoneIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Send OTP
                </Button>
                </div>
            ) : (
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={phoneIsLoading}
                    maxLength={6}
                    />
                </div>
                <Button onClick={handleVerifyOtp} className="w-full" disabled={phoneIsLoading || otp.length < 6}>
                    {phoneIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Verify OTP & Login
                </Button>
                 <Button variant="link" size="sm" onClick={() => setIsOtpSent(false)} disabled={phoneIsLoading} className="p-0 h-auto w-full text-xs">
                    Entered the wrong number?
                </Button>
                </div>
            )}
        </CardContent>
     </Card>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      {view === 'selection' && renderSelection()}
      {view === 'email' && renderEmailLogin()}
      {view === 'phone' && renderPhoneLogin()}
    </div>
  );
}
