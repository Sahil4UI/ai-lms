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
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User,
} from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['student', 'trainer'], {
    required_error: 'Please select a role.',
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;
type Role = 'student' | 'trainer';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'selection' | 'email' | 'phone'>('selection');

  // Phone state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phoneIsLoading, setPhoneIsLoading] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'student',
    },
  });

  useEffect(() => {
    if (view === 'phone' && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {},
      });
      recaptchaVerifierRef.current.render();
    }
  }, [view]);

  const handleUserCreationInDb = async (
    user: User,
    additionalData: { fullName?: string; role?: Role }
  ) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        const dataToSet: any = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || additionalData.fullName,
            photoURL: user.photoURL,
            phoneNumber: user.phoneNumber,
            createdAt: serverTimestamp(),
        };
        // Only add the role if it's provided (i.e., for email signup)
        if (additionalData.role) {
            dataToSet.role = additionalData.role;
        }
        await setDoc(userRef, dataToSet);
    }
  };

  const onEmailSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, { displayName: data.fullName });
      await handleUserCreationInDb(userCredential.user, {
        fullName: data.fullName,
        role: data.role,
      });
      // The useAuth hook will handle redirection based on role
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description:
          error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Pass no role, forcing role selection
      await handleUserCreationInDb(result.user, {}); 
      // The useAuth hook will handle redirection to role selection
    } catch (error: any) {
      toast({
        title: 'Google Signup Failed',
        description:
          error.message || 'Could not sign up with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!fullName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your full name.',
        variant: 'destructive',
      });
      return;
    }
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
      await updateProfile(result.user, { displayName: fullName });
      // Pass no role, forcing role selection
      await handleUserCreationInDb(result.user, { fullName });
      // The useAuth hook will handle redirection to role selection
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
        <CardTitle className="text-2xl font-bold font-headline">
          Create an Account
        </CardTitle>
        <CardDescription>
          Choose your preferred method to sign up
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button onClick={() => setView('email')} className="w-full">
          Continue with Email
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Sign up with Google
        </Button>
        <Button onClick={() => setView('phone')} variant="outline" className="w-full">
          Continue with Phone
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmailSignup = () => (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="relative flex-row items-center justify-center pt-8">
        <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => setView('selection')}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl font-bold font-headline">
          Sign up with Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ada Lovelace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>I am joining as a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4 pt-1"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel className="font-normal">Student</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="trainer" />
                        </FormControl>
                        <FormLabel className="font-normal">Trainer</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  const renderPhoneSignup = () => (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="relative flex-row items-center justify-center pt-8">
        <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => {
            setView('selection');
            setIsOtpSent(false);
        }}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle className="text-2xl font-bold font-headline text-center">Sign up with Phone</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="recaptcha-container"></div>
        {!isOtpSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="fullNamePhone">Full Name</Label>
                  <Input id="fullNamePhone" placeholder="Ada Lovelace" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={phoneIsLoading} />
              </div>
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
              <Button onClick={handleSendOtp} className="w-full" disabled={phoneIsLoading || !phone || !fullName}>
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
                  Verify OTP & Create Account
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
      {view === 'email' && renderEmailSignup()}
      {view === 'phone' && renderPhoneSignup()}
    </div>
  );
}
