/**
 * Azure AD B2C Authentication Configuration
 * For MPT Warrior membership system with role-based access control
 */

import { Configuration, PopupRequest } from "@azure/msal-browser";
import { UserRole } from "@/types";

// MSAL Configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "",
    authority: process.env.NEXT_PUBLIC_AZURE_AD_AUTHORITY || "",
    knownAuthorities: [process.env.NEXT_PUBLIC_AZURE_AD_KNOWN_AUTHORITY || ""],
    redirectUri: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for accessing API
export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", "email"],
};

// Protected resource map
export const protectedResources = {
  apiEndpoint: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
};

// ============================================
// ROLE-BASED ACCESS CONTROL
// ============================================

// Super Admin (Founder) - Full system control
export const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || "admin@mpt-warrior.com";

// Admin emails (can manage users, content, signals)
export const ADMIN_EMAILS = [
  SUPER_ADMIN_EMAIL,
  // Add more admin emails here as needed
  // "commander1@mpt-warrior.com",
  // "commander2@mpt-warrior.com",
];

// Admin email (hardcoded untuk security) - Deprecated, use SUPER_ADMIN_EMAIL
export const ADMIN_EMAIL = SUPER_ADMIN_EMAIL;

/**
 * Check if user is Super Admin (Founder)
 */
export function isSuperAdmin(email: string): boolean {
  return email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Check if user is Admin (includes Super Admin)
 */
export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.some(adminEmail => 
    adminEmail.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Get user role based on email and database role
 */
export function getUserRole(email: string, dbRole?: UserRole, status?: string): UserRole {
  // Super Admin override
  if (isSuperAdmin(email)) return 'SUPER_ADMIN';
  
  // Admin check
  if (isAdmin(email)) return 'ADMIN';
  
  // Use database role if available
  if (dbRole) return dbRole;
  
  // Legacy status check
  if (status === 'active') return 'WARRIOR';
  
  // Default to pending for new users
  return 'PENDING';
}

/**
 * Check if role has admin access
 */
export function hasAdminAccess(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

/**
 * Check if role has super admin access
 */
export function hasSuperAdminAccess(role: UserRole): boolean {
  return role === 'SUPER_ADMIN';
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  // Public routes
  if (path === '/' || path === '/login' || path === '/register') {
    return true;
  }
  
  // Pending users can only access pending-approval page
  if (role === 'PENDING') {
    return path === '/pending-approval' || path === '/access-denied';
  }
  
  // Super Admin routes
  if (path.startsWith('/admin-hq/settings') || path.startsWith('/admin-hq/system')) {
    return hasSuperAdminAccess(role);
  }
  
  // Admin routes
  if (path.startsWith('/admin-hq')) {
    return hasAdminAccess(role);
  }
  
  // Warrior routes (all authenticated users)
  return role === 'WARRIOR' || hasAdminAccess(role);
}

/**
 * Get redirect path based on user role
 */
export function getDefaultRedirect(role: UserRole): string {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return '/admin-hq';
    case 'PENDING':
      return '/pending-approval';
    case 'WARRIOR':
    default:
      return '/dashboard';
  }
}
