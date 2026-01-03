'use client';

import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { SignInPage } from '@/components/auth/sign-in-page';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

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

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    router.replace('/');
    return null;
  }

  return (
    <SignInPage
      heroImageSrc="https://picsum.photos/seed/auth-hero/1200/900"
      testimonials={testimonials}
      onGoogleSignIn={handleGoogleSignIn}
    />
  );
}
