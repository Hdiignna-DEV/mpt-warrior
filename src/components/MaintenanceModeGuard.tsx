'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface MaintenanceModeGuardProps {
  children: ReactNode;
  allowedRoles?: ('ADMIN' | 'SUPER_ADMIN')[];
}

/**
 * Client-side guard untuk melindungi routes dari maintenance mode
 * Non-admin users akan redirect ke halaman maintenance
 */
export function MaintenanceModeGuard({ 
  children, 
  allowedRoles = ['ADMIN', 'SUPER_ADMIN'] 
}: MaintenanceModeGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsChecking(false);
      return;
    }

    try {
      const userData = localStorage.getItem('mpt_user');
      
      if (!userData) {
        // Not logged in, don't block
        setIsAllowed(true);
        setIsChecking(false);
        return;
      }

      const user = JSON.parse(userData);
      const hasAccess = allowedRoles.includes(user.role);

      if (!hasAccess) {
        // Non-admin user, redirect to maintenance
        router.push('/maintenance-migration');
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    } catch (error) {
      console.error('Error checking maintenance access:', error);
      setIsAllowed(true); // Allow on error
    } finally {
      setIsChecking(false);
    }
  }, [router, allowedRoles]);

  // While checking, show nothing or loading state
  if (isChecking) {
    return null;
  }

  // If not allowed, don't render children
  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
