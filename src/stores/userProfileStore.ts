/**
 * Global User Profile Store (Zustand)
 * Manages authenticated user profile data across the application
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole, UserStatus, BadgeLevel, Badge, ProfileSettings, ReferralStats, UserStats } from '@/types';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  avatar?: string;
  
  // Warrior Identity
  warriorId: string;
  role: UserRole;
  status: UserStatus;
  
  // Badge System
  currentBadgeLevel: BadgeLevel;
  badges: Badge[];
  disciplineScore: number;
  
  // Profile Settings
  profileSettings: ProfileSettings;
  
  // Referral System
  referralCode?: string;
  referralStats?: ReferralStats;
  
  // Stats
  stats: UserStats;
  
  // Timestamps
  createdAt: string;
  lastLogin?: string;
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  loadProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/**
 * User Profile Store
 * Persisted in localStorage for quick access
 */
export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      /**
       * Set full profile data
       */
      setProfile: (profile) => {
        set({ profile, error: null });
      },

      /**
       * Update specific profile fields
       */
      updateProfile: (updates) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              ...updates
            }
          });
        }
      },

      /**
       * Clear profile (logout)
       */
      clearProfile: () => {
        set({ profile: null, error: null, isLoading: false });
      },

      /**
       * Load profile from API
       */
      loadProfile: async () => {
        const token = localStorage.getItem('mpt_token');
        if (!token) {
          set({ error: 'No authentication token', isLoading: false });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            set({ profile: data.profile, isLoading: false, error: null });
          } else {
            const error = await response.json();
            set({ error: error.error || 'Failed to load profile', isLoading: false });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load profile', 
            isLoading: false 
          });
        }
      },

      /**
       * Refresh profile data
       */
      refreshProfile: async () => {
        await get().loadProfile();
      }
    }),
    {
      name: 'mpt-user-profile',
      partialize: (state) => ({ 
        profile: state.profile 
      })
    }
  )
);

/**
 * Helper hook to check user role
 */
export const useUserRole = () => {
  const profile = useUserProfileStore((state) => state.profile);
  
  return {
    role: profile?.role,
    isWarrior: profile?.role === 'WARRIOR',
    isAdmin: profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN',
    isSuperAdmin: profile?.role === 'SUPER_ADMIN',
    canAccessAdmin: profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN'
  };
};

/**
 * Helper hook to check badge level
 */
export const useBadgeLevel = () => {
  const profile = useUserProfileStore((state) => state.profile);
  
  return {
    level: profile?.currentBadgeLevel,
    isRecruit: profile?.currentBadgeLevel === 'RECRUIT',
    isWarrior: profile?.currentBadgeLevel === 'WARRIOR',
    isVeteran: profile?.currentBadgeLevel === 'VETERAN',
    canGenerateReferrals: profile?.currentBadgeLevel === 'VETERAN'
  };
};

/**
 * Helper hook to check user status
 */
export const useUserStatus = () => {
  const profile = useUserProfileStore((state) => state.profile);
  
  return {
    status: profile?.status,
    isActive: profile?.status === 'active',
    isPending: profile?.status === 'pending',
    isSuspended: profile?.status === 'suspended',
    canAccessPlatform: profile?.status === 'active'
  };
};
