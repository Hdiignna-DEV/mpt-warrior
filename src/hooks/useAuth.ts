'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'WARRIOR';
  status: string;
}

export function useAuth(requireAuth: boolean = true, requireAdmin: boolean = false) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('mpt_token');
      const userData = localStorage.getItem('mpt_user');

      // If auth is required but token/user is missing
      if (requireAuth && (!token || !userData)) {
        window.location.href = '/login';
        return;
      }

      // Parse user data
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // If admin is required but user is not admin
          if (requireAdmin && parsedUser.role !== 'ADMIN') {
            window.location.href = '/dashboard';
            return;
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          if (requireAuth) {
            localStorage.removeItem('mpt_user');
            localStorage.removeItem('mpt_token');
            window.location.href = '/login';
            return;
          }
        }
      }

      setLoading(false);
    };

    checkAuth();

    // Re-check auth on storage change (multi-tab support)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mpt_token' || e.key === 'mpt_user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [requireAuth, requireAdmin, router]);

  return { user, loading };
}
