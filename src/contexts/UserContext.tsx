/**
 * User Context Provider
 * Global state management for user profile data
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, BadgeLevel, Badge } from '@/types';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  avatar?: string;
  warriorId: string;
  role: UserRole;
  currentBadgeLevel: BadgeLevel;
  badges: Badge[];
  disciplineScore: number;
  stats: {
    totalTrades: number;
    wins: number;
    losses: number;
    winRate: number;
  };
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.profile);
      } else {
        // Token invalid or expired
        localStorage.removeItem('mpt_token');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    await loadUser();
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('mpt_token');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
