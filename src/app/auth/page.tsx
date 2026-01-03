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
      heroImageSrc="https://cdn.dribbble.com/userupload/45105322/file/45444425e7999da2b7789c065730c4f6.jpg?resize=1504x1128&vertical=center"
      testimonials={[]}
      onGoogleSignIn={handleGoogleSignIn}
    />
  );
}
