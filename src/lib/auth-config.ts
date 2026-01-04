/**
 * Azure AD B2C Authentication Configuration
 * For MPT Warrior membership system
 */

import { Configuration, PopupRequest } from "@azure/msal-browser";

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

// Admin email (hardcoded untuk security)
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@mpt-warrior.com";

// Check if user is admin
export function isAdmin(email: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Get user role based on email and status
export function getUserRole(email: string, status?: string): 'ADMIN' | 'WARRIOR' | 'PENDING' {
  if (isAdmin(email)) return 'ADMIN';
  if (status === 'active') return 'WARRIOR';
  return 'PENDING';
}
