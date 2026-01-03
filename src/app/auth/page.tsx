'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Connecté", description: "Bienvenue !" });
      // The useEffect will handle the redirect
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Erreur de connexion Google", description: error.message });
    }
  };

  if (isUserLoading || user) {
    return <div>Chargement...</div>;
  }

  return (
    <SignInPage
      heroImageSrc="https://cdn.dribbble.com/userupload/37447614/file/original-a912c65352e920fdabbe8b86ac5996c1.png?resize=1504x1131&vertical=center"
      testimonials={[]}
      onGoogleSignIn={handleGoogleSignIn}
    />
  );
}
