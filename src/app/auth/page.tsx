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
      heroImageSrc="https://cdn.dribbble.com/userupload/45105322/file/45444425e7999da2b7789c065730c4f6.jpg?resize=1504x1128&vertical=center"
      testimonials={[]}
      onGoogleSignIn={handleGoogleSignIn}
    />
  );
}
