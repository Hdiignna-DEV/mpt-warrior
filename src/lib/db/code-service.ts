/**
 * Invitation Code Service
 * Manage invitation codes for registration
 */

import { getCodesContainer, getAuditLogsContainer } from "./cosmos-client";
import { InvitationCode, AuditLog } from "@/types";

// Import user service for war points rewards
let getUserById: any;
let updateUser: any;

// Lazy import to avoid circular dependencies
async function ensureUserServiceLoaded() {
  if (!getUserById) {
    const userService = await import("./user-service");
    getUserById = userService.getUserById;
    updateUser = userService.updateUser;
  }
}

/**
 * Validate invitation code
 * Note: Bulk-generated codes use UUID as id, so we must use query instead of direct read
 */
export async function validateInvitationCode(code: string): Promise<{ valid: boolean; reason?: string; code?: InvitationCode }> {
  try {
    const normalizedCode = code.trim();
    
    console.log('[CODE VALIDATION] Validating code:', normalizedCode);
    
    const container = getCodesContainer();
    
    // Use query for case-insensitive exact match
    // This works for both UUID-based ids (bulk generated) and code-based ids (manual)
    const query = {
      query: 'SELECT * FROM c WHERE UPPER(c.code) = UPPER(@code)',
      parameters: [{ name: '@code', value: normalizedCode }],
    };
    
    const { resources } = await container.items.query<InvitationCode>(query, {
      maxItemCount: 1,
    }).fetchAll();
    
    console.log('[CODE VALIDATION] Found:', resources.length, 'code(s)');
    
    if (resources.length === 0) {
      return { valid: false, reason: "Code tidak ditemukan" };
    }
    
    return validateCodeResource(resources[0]);
  } catch (error: any) {
    console.error('[CODE VALIDATION] Error:', error);
    return { valid: false, reason: "Terjadi kesalahan sistem: " + error.message };
  }
}

function validateCodeResource(resource: InvitationCode): { valid: boolean; reason?: string; code?: InvitationCode } {
  if (!resource.is_active) {
    return { valid: false, reason: "Code sudah tidak aktif" };
  }

  if (resource.used_count >= resource.max_uses) {
    return { valid: false, reason: "Code sudah mencapai limit penggunaan" };
  }

  if (new Date(resource.expires_at) < new Date()) {
    return { valid: false, reason: "Code sudah expired" };
  }

  return { valid: true, code: resource };
}

/**
 * Use invitation code (increment usage count) + apply war points reward if VET-USER code
 * Note: Uses query approach to support both UUID-based ids (bulk) and code-based ids (manual)
 */
export async function useInvitationCode(code: string, usedBy: string): Promise<{ codeUsed: InvitationCode; warPointsAwarded?: number }> {
  const container = getCodesContainer();
  const normalizedCode = code.trim();
  
  console.log('[USE CODE] Incrementing usage for code:', normalizedCode);
  
  // Find code using query (supports both UUID and code-based ids)
  const query = {
    query: 'SELECT * FROM c WHERE UPPER(c.code) = UPPER(@code)',
    parameters: [{ name: '@code', value: normalizedCode }],
  };
  
  const { resources } = await container.items.query<InvitationCode>(query, {
    maxItemCount: 1,
  }).fetchAll();
  
  if (resources.length === 0) {
    console.error('[USE CODE] Code not found:', normalizedCode);
    throw new Error("Code tidak ditemukan");
  }
  
  const resource = resources[0];
  
  // Double-check validity before incrementing
  if (!resource.is_active) {
    throw new Error("Code sudah tidak aktif");
  }
  
  if (resource.used_count >= resource.max_uses) {
    throw new Error("Code sudah mencapai limit penggunaan");
  }

  const updatedCode: any = {
    id: resource.id,
    code: resource.code,
    codeType: resource.codeType,
    created_by: resource.created_by,
    max_uses: resource.max_uses,
    used_count: resource.used_count + 1,
    expires_at: resource.expires_at,
    is_active: resource.is_active,
    role: resource.role,
    created_at: resource.created_at,
    description: resource.description,
    benefits: resource.benefits,
    referrerId: resource.referrerId,
  };
  
  console.log('[USE CODE] Updating code:', {
    id: resource.id,
    code: resource.code,
    oldCount: resource.used_count,
    newCount: updatedCode.used_count,
  });
  
  // Use upsert instead of replace to avoid partition key issues
  // Upsert works with just the document, no need for exact id/partition key match
  await container.items.upsert(updatedCode);
  
  console.log('[USE CODE] Success! New count:', updatedCode.used_count);

  // Handle war points reward for VET-USER referral codes
  let warPointsAwarded = 0;
  if (resource.codeType === 'VET-USER' && resource.referrerId && resource.benefits?.warPointsOnUse) {
    try {
      await ensureUserServiceLoaded();
      const referrer = await getUserById(resource.referrerId);
      
      if (referrer) {
        // Award war points to referrer
        warPointsAwarded = resource.benefits.warPointsOnUse;
        const updatedReferrer = {
          ...referrer,
          disciplineScore: (referrer.disciplineScore || 0) + warPointsAwarded,
          updatedAt: new Date(),
        };
        await updateUser(updatedReferrer);
        
        console.log('[WAR POINTS] Awarded', warPointsAwarded, 'points to referrer:', resource.referrerId);
      }
    } catch (error: any) {
      console.error('[WAR POINTS] Failed to award war points:', error);
      // Don't throw, just log - code usage shouldn't fail because of war points
    }
  }

  return { codeUsed: updatedCode, warPointsAwarded };
}

/**
 * Create new invitation code (admin only)
 */
export async function createInvitationCode(codeData: Omit<InvitationCode, 'id' | 'used_count' | 'created_at'>): Promise<InvitationCode> {
  const container = getCodesContainer();
  
  const newCode: InvitationCode = {
    ...codeData,
    id: codeData.code, // Use code as ID for easy lookup
    used_count: 0,
    created_at: new Date(),
  };

  const { resource } = await container.items.create(newCode);
  
  // Log audit
  const logsContainer = getAuditLogsContainer();
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    action: 'code_created',
    performed_by: codeData.created_by || 'system',
    timestamp: new Date(),
    metadata: { code: codeData.code, max_uses: codeData.max_uses },
  };
  await logsContainer.items.create(log);

  return resource as InvitationCode;
}

/**
 * Deactivate invitation code
 * Note: Uses query approach to support both UUID-based ids (bulk) and code-based ids (manual)
 */
export async function deactivateInvitationCode(code: string, deactivatedBy: string): Promise<void> {
  const container = getCodesContainer();
  const normalizedCode = code.trim();
  
  // Find code using query (supports both UUID and code-based ids)
  const query = {
    query: 'SELECT * FROM c WHERE UPPER(c.code) = UPPER(@code)',
    parameters: [{ name: '@code', value: normalizedCode }],
  };
  
  const { resources } = await container.items.query<InvitationCode>(query, {
    maxItemCount: 1,
  }).fetchAll();
  
  if (resources.length === 0) {
    throw new Error("Code tidak ditemukan");
  }
  
  const resource = resources[0];

  const updatedCode = {
    id: resource.id,
    code: resource.code,
    created_by: resource.created_by,
    max_uses: resource.max_uses,
    used_count: resource.used_count,
    expires_at: resource.expires_at,
    is_active: false,
    role: resource.role,
    created_at: resource.created_at,
    description: resource.description,
  };

  // Use upsert instead of replace to avoid partition key issues
  await container.items.upsert(updatedCode);
  
  // Log audit
  const logsContainer = getAuditLogsContainer();
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    action: 'code_deactivated',
    performed_by: deactivatedBy,
    timestamp: new Date(),
    metadata: { code: normalizedCode },
  };
  await logsContainer.items.create(log);
}

/**
 * Get all invitation codes (admin only)
 */
export async function getAllInvitationCodes(): Promise<InvitationCode[]> {
  const container = getCodesContainer();
  
  const query = {
    query: "SELECT * FROM c ORDER BY c.created_at DESC",
  };

  const { resources } = await container.items.query<InvitationCode>(query).fetchAll();
  return resources;
}

/**
 * Get active invitation codes
 */
export async function getActiveInvitationCodes(): Promise<InvitationCode[]> {
  const container = getCodesContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.is_active = true AND c.expires_at > @now ORDER BY c.created_at DESC",
    parameters: [{ name: "@now", value: new Date().toISOString() }],
  };

  const { resources } = await container.items.query<InvitationCode>(query).fetchAll();
  return resources;
}

/**
 * Generate random invitation code
 */
export function generateInvitationCode(): string {
  const prefix = "MPT";
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const year = new Date().getFullYear();
  return `${prefix}-${randomPart}-${year}`;
}

/**
 * Generate LEGACY invitation code (for founders/legacy members)
 * Benefits: Direct Warrior level + Founder badge + No discount (gratis)
 * Format: LEGACY-XXXXXX
 */
export async function generateLegacyCode(adminId: string, expiresAfterDays: number = 365): Promise<InvitationCode> {
  const code = `LEGACY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresAfterDays);

  const legacyCode: InvitationCode = {
    id: code,
    code,
    codeType: 'LEGACY',
    created_by: adminId,
    max_uses: 1,
    used_count: 0,
    expires_at: expiresAt,
    is_active: true,
    role: 'WARRIOR',
    created_at: new Date(),
    description: 'Legacy founder code - grants Warrior level + Founder badge',
    benefits: {
      startBadgeLevel: 'WARRIOR',
      badgesToAdd: ['LEGACY_BUILDER'],
      discountPercent: 0, // Gratis, no discount needed
    },
  };

  return createInvitationCode(legacyCode);
}

/**
 * Generate VET-USER referral code (for Veteran members to refer)
 * Benefits: Referrer gets War Points, new user gets 20% discount
 * Format: VET-USER-XXXXXX
 */
export async function generateReferralCode(
  referrerId: string,
  adminId: string,
  discountPercent: number = 20,
  expiresAfterDays: number = 90
): Promise<InvitationCode> {
  const code = `VET-USER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresAfterDays);

  const referralCode: InvitationCode = {
    id: code,
    code,
    codeType: 'VET-USER',
    created_by: adminId,
    referrerId, // Track who created this code
    max_uses: 5, // Each referral code can be used max 5 times
    used_count: 0,
    expires_at: expiresAt,
    is_active: true,
    role: 'WARRIOR',
    created_at: new Date(),
    description: `Veteran referral code from ${referrerId} - grants ${discountPercent}% discount`,
    benefits: {
      discountPercent,
      startBadgeLevel: 'RECRUIT', // New users start as RECRUIT
      warPointsOnUse: 500, // Referrer gets 500 war points per use
    },
  };

  return createInvitationCode(referralCode);
}

/**
 * Get codes by type
 */
export async function getCodesByType(codeType: 'LEGACY' | 'VET-USER'): Promise<InvitationCode[]> {
  const container = getCodesContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.codeType = @type ORDER BY c.created_at DESC",
    parameters: [{ name: "@type", value: codeType }],
  };

  const { resources } = await container.items.query<InvitationCode>(query).fetchAll();
  return resources;
}

/**
 * Get referral codes by referrer ID
 */
export async function getReferralCodesByReferrer(referrerId: string): Promise<InvitationCode[]> {
  const container = getCodesContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.referrerId = @referrerId AND c.codeType = 'VET-USER' ORDER BY c.created_at DESC",
    parameters: [{ name: "@referrerId", value: referrerId }],
  };

  const { resources } = await container.items.query<InvitationCode>(query).fetchAll();
  return resources;
}
