'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import auth from '@/lib/api/supabase-auth';

export default function DkkdPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await auth.isAuthenticated();
        if (isAuthenticated) {
          router.push('/dkkd/dashboard');
        } else {
          router.push('/dkkd/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/dkkd/login');
      }
    };

    checkAuth();
  }, [router]);

  // Return a loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you</p>
      </div>
    </div>
  );
}