'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Client-side wrapper untuk check token di localStorage
 * Redirect ke login kalau token tidak ada atau invalid
 */
export default function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('mpt_token');
    const user = localStorage.getItem('mpt_user');

    if (!token || !user) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      
      // Check if user is active
      if (userData.status !== 'active') {
        router.push('/pending-approval');
        return;
      }

      // Check if suspended
      if (userData.status === 'suspended') {
        router.push('/access-denied');
        return;
      }
    } catch (error) {
      // Invalid user data
      localStorage.clear();
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
