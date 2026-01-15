'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Komponen untuk inject user role ke header request
 * Digunakan oleh middleware untuk maintenance mode check
 * 
 * IMPORTANT: Letakkan ini di root layout sehingga berjalan untuk semua routes
 */
export function MaintenanceModeProvider() {
  const { user } = useAuth(false);

  useEffect(() => {
    if (user) {
      // Set user role di localStorage sehingga bisa dibaca oleh middleware
      localStorage.setItem('user_role', user.role);
      
      // Juga set sebagai header untuk next requests (jika menggunakan fetch interceptor)
      // Tapi karena middleware tidak bisa membaca localStorage, kita gunakan cookie
      const token = localStorage.getItem('mpt_token');
      if (token) {
        // Set cookie dengan user role untuk middleware
        document.cookie = `x-user-role=${user.role}; path=/; max-age=86400`;
      }
    }
  }, [user]);

  return null; // This component doesn't render anything
}
