'use client';

import { useEffect, useState } from 'react';

/**
 * Lightweight provider untuk set user role di cookie untuk middleware
 * Hanya run di browser, tidak ada dependency kompleks
 */
export function MaintenanceModeProvider() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set user role in cookie for middleware
    if (typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('mpt_user');
        const token = localStorage.getItem('mpt_token');
        
        if (userData && token) {
          try {
            const user = JSON.parse(userData);
            if (user?.role) {
              document.cookie = `x-user-role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
            }
          } catch (e) {
            // Silently fail
          }
        }
      } catch (e) {
        // Silently fail
      }
    }
  }, []);

  // Only render after client-side hydration
  if (!isClient) return null;
  
  return null;
}
