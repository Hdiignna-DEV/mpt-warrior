'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface MaintenanceModeGuardProps {
  children: ReactNode;
}

/**
 * Simple wrapper untuk halaman yang perlu admin access
 * Akan redirect non-admin ke maintenance page
 */
export function MaintenanceModeGuard({ children }: MaintenanceModeGuardProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsChecking(false);
      return;
    }

    try {
      const userData = localStorage.getItem('mpt_user');
      const token = localStorage.getItem('mpt_token');

      if (!userData || !token) {
        // Not logged in - show login page (handled by useAuth)
        setIsAllowed(true);
        setIsChecking(false);
        return;
      }

      const user = JSON.parse(userData);
      const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

      if (!isAdmin) {
        // Non-admin, redirect to maintenance
        router.replace('/maintenance-migration');
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    } catch (error) {
      // Silently fail and allow
      setIsAllowed(true);
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) return null;
  if (!isAllowed) return null;

  return <>{children}</>;
}
