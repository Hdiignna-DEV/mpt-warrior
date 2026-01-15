'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Simple hook untuk check maintenance mode
 * Gunakan di page-level components yang memerlukan protection
 */
export function useMaintenanceCheck() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const userData = localStorage.getItem('mpt_user');
      const token = localStorage.getItem('mpt_token');

      // Only check if user is logged in
      if (userData && token) {
        try {
          const user = JSON.parse(userData);
          
          // If user is not admin and not super admin, redirect
          if (user?.role && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            router.push('/maintenance-migration');
          }
        } catch (e) {
          // Silently fail
        }
      }
    } catch (e) {
      // Silently fail
    }
  }, [router]);
}
