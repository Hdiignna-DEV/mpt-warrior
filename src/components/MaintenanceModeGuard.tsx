'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface MaintenanceModeGuardProps {
  children: ReactNode;
}

/**
 * Wrapper untuk halaman yang perlu admin access
 * - Cek MAINTENANCE_MODE environment variable
 * - Redirect non-admin ke maintenance page
 * - Set role cookie untuk middleware validation
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

      // Set user role cookie untuk middleware validation
      if (user?.role) {
        document.cookie = `mpt_user_role=${user.role}; path=/; max-age=86400`;
      }

      // Check maintenance mode status
      const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

      if (maintenanceMode && !isAdmin) {
        // Maintenance mode ON dan user bukan admin
        router.replace('/maintenance-migration');
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    } catch (error) {
      console.error('[MaintenanceModeGuard] Error:', error);
      // Silently fail dan allow
      setIsAllowed(true);
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) return null;
  if (!isAllowed) return null;

  return <>{children}</>;
}
