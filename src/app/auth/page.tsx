'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { SignInPage, type SignInFormValues } from '@/components/auth/sign-in-page';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  const handleEmailSignIn = async (values: SignInFormValues) => {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({ title: "Connecté", description: "Bienvenue !" });
      // The useEffect will handle the redirect
    } catch (error: any) {
      let description = "Une erreur est survenue. Veuillez réessayer.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = "L'adresse e-mail ou le mot de passe est incorrect.";
      }
      toast({ variant: 'destructive', title: "Erreur de connexion", description });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || user) {
    return <div>Chargement...</div>;
  }

  return (
    <SignInPage
      heroImageSrc="https://cdn.dribbble.com/userupload/31301517/file/original-e0100a71afe33d5d96ee9f0a16dc599c.png?resize=1504x1131&vertical=center"
      testimonials={[]}
      onEmailSignIn={handleEmailSignIn}
      isSubmitting={isSubmitting}
    />
  );
}
