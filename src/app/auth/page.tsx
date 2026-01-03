'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { SignInPage, type View } from '@/components/auth/sign-in-page';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [view, setView] = useState<View>('sign-in');

  const testimonials = [
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Marc B.",
      handle: "@marcb",
      text: "This platform has revolutionized my workflow. The AI-powered features are a game changer!",
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Sophie D.",
      handle: "@sophied",
      text: "Incredible user experience and top-notch support. I couldn't be happier with the results.",
    },
    {
      avatarSrc: "https://randomuser.me/api/portraits/men/56.jpg",
      name: "Alex T.",
      handle: "@alext",
      text: "A must-have tool for any serious developer. It saved me countless hours.",
    },
  ];

  const handleAuthAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (view === 'sign-up') {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Account created", description: "You have been signed in." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Signed In", description: "Welcome back!" });
      }
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Authentication Error", description: error.message });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Signed In", description: "Welcome!" });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Google Sign-In Error", description: error.message });
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast({ variant: 'destructive', title: "Input Error", description: "Please enter your email to reset password." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({ title: "Password Reset", description: "A password reset link has been sent to your email." });
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Reset Error", description: error.message });
    }
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    router.replace('/');
    return null;
  }

  return (
    <SignInPage
      view={view}
      onViewChange={setView}
      heroImageSrc="https://picsum.photos/seed/auth-hero/1200/900"
      testimonials={testimonials}
      onAuthAction={handleAuthAction}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
    />
  );
}
