'use client';

import { useEffect, useState } from 'react';

/**
 * Komponen untuk inject user role ke cookie
 * Digunakan oleh middleware untuk maintenance mode check
 * 
 * Lightweight version tanpa dependency ke useAuth
 */
export function MaintenanceModeProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    setMounted(true);
    
    if (typeof window === 'undefined') return;

    try {
      const userData = localStorage.getItem('mpt_user');
      const token = localStorage.getItem('mpt_token');
      
      if (userData && token) {
        try {
          const user = JSON.parse(userData);
          if (user?.role) {
            // Set cookie dengan user role untuk middleware
            document.cookie = `x-user-role=${user.role}; path=/; max-age=86400`;
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    } catch (e) {
      console.error('Error in MaintenanceModeProvider:', e);
    }
  }, []);

  // Don't render anything, just set cookies
  return null;
}
