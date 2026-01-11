/**
 * Session Persistence Manager
 * Ensures long-lived sessions in mobile app
 * Prevents logout on app refresh/restart
 */

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SessionConfig {
  tokenKey: string;
  userKey: string;
  sessionDurationDays: number;
}

const DEFAULT_CONFIG: SessionConfig = {
  tokenKey: 'mpt_auth_token',
  userKey: 'mpt_user_data',
  sessionDurationDays: 30, // 30-day session for mobile app
};

/**
 * Save auth token with expiration
 */
export function saveAuthToken(token: string, config = DEFAULT_CONFIG): void {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + config.sessionDurationDays);

  const tokenData = {
    token,
    expiresAt: expirationDate.toISOString(),
  };

  try {
    localStorage.setItem(config.tokenKey, JSON.stringify(tokenData));
    sessionStorage.setItem(config.tokenKey, token); // Also save in sessionStorage for quick access
  } catch (error) {
    console.error('[SessionPersistence] Failed to save token:', error);
  }
}

/**
 * Retrieve auth token if still valid
 */
export function getAuthToken(config = DEFAULT_CONFIG): string | null {
  try {
    // First try sessionStorage (fast)
    const sessionToken = sessionStorage.getItem(config.tokenKey);
    if (sessionToken) {
      return sessionToken;
    }

    // Then try localStorage
    const stored = localStorage.getItem(config.tokenKey);
    if (!stored) return null;

    const tokenData = JSON.parse(stored);
    const expiresAt = new Date(tokenData.expiresAt);

    // Check if token has expired
    if (new Date() > expiresAt) {
      clearAuthToken(config);
      return null;
    }

    // Token is still valid, restore to sessionStorage
    sessionStorage.setItem(config.tokenKey, tokenData.token);
    return tokenData.token;
  } catch (error) {
    console.error('[SessionPersistence] Failed to retrieve token:', error);
    return null;
  }
}

/**
 * Clear auth token
 */
export function clearAuthToken(config = DEFAULT_CONFIG): void {
  try {
    localStorage.removeItem(config.tokenKey);
    sessionStorage.removeItem(config.tokenKey);
  } catch (error) {
    console.error('[SessionPersistence] Failed to clear token:', error);
  }
}

/**
 * Save user data
 */
export function saveUserData(userData: any, config = DEFAULT_CONFIG): void {
  try {
    localStorage.setItem(config.userKey, JSON.stringify(userData));
  } catch (error) {
    console.error('[SessionPersistence] Failed to save user data:', error);
  }
}

/**
 * Get user data
 */
export function getUserData(config = DEFAULT_CONFIG): any | null {
  try {
    const stored = localStorage.getItem(config.userKey);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('[SessionPersistence] Failed to retrieve user data:', error);
    return null;
  }
}

/**
 * Hook: Auto-restore session on app startup
 */
export function useSessionPersistence() {
  const router = useRouter();

  const restoreSession = useCallback(async () => {
    try {
      const token = getAuthToken();
      const userData = getUserData();

      if (token && userData) {
        // Verify token is still valid with backend
        const response = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Token is valid, restore to context/state
          return { token, userData };
        } else {
          // Token is invalid, clear and redirect to login
          clearAuthToken();
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('[SessionPersistence] Failed to restore session:', error);
    }

    return null;
  }, [router]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return { restoreSession };
}

/**
 * Hook: Refresh token periodically
 */
export function useTokenRefresh(intervalMinutes = 15) {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const { token: newToken } = await response.json();
          saveAuthToken(newToken);
        }
      } catch (error) {
        console.error('[TokenRefresh] Failed to refresh token:', error);
      }
    }, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [intervalMinutes]);
}
