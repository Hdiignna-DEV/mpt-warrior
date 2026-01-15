'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface MaintenanceModeGuardProps {
  children: ReactNode;
  allowedRoles?: ('ADMIN' | 'SUPER_ADMIN')[];
}

/**
 * HOC untuk melindungi routes dari maintenance mode
 * Non-admin users akan redirect ke halaman maintenance
 */
export function MaintenanceModeGuard({ 
  children, 
  allowedRoles = ['ADMIN', 'SUPER_ADMIN'] 
}: MaintenanceModeGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth(false); // Don't require auth to check

  useEffect(() => {
    if (!loading && user) {
      // Check if user role is allowed
      if (!allowedRoles.includes(user.role as 'ADMIN' | 'SUPER_ADMIN')) {
        // Redirect to maintenance page
        router.push('/maintenance-migration');
      }
    }
  }, [user, loading, router, allowedRoles]);

  // Show nothing while checking
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-slate-400">Loading...</div>
    </div>;
  }

  // If user doesn't have admin access, don't render
  if (user && !allowedRoles.includes(user.role as 'ADMIN' | 'SUPER_ADMIN')) {
    return null;
  }

  return <>{children}</>;
}
