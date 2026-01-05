/**
 * Invitation Code Service
 * Manage invitation codes for registration
 */

import { getCodesContainer, getAuditLogsContainer } from "./cosmos-client";
import { InvitationCode, AuditLog } from "@/types";

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
 * Use invitation code (increment usage count)
 */
export async function useInvitationCode(code: string, usedBy: string): Promise<void> {
  const container = getCodesContainer();
  
  const { resource } = await container.item(code, code).read<InvitationCode>();

  if (!resource) {
    throw new Error("Code not found");
  }

  const updatedCode: InvitationCode = {
    ...resource,
    used_count: resource.used_count + 1,
  };

  await container.item(code, code).replace(updatedCode);
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
 */
export async function deactivateInvitationCode(code: string, deactivatedBy: string): Promise<void> {
  const container = getCodesContainer();
  
  const { resource } = await container.item(code, code).read<InvitationCode>();

  if (!resource) {
    throw new Error("Code not found");
  }

  const updatedCode: InvitationCode = {
    ...resource,
    is_active: false,
  };

  await container.item(code, code).replace(updatedCode);
  
  // Log audit
  const logsContainer = getAuditLogsContainer();
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    action: 'code_deactivated',
    performed_by: deactivatedBy,
    timestamp: new Date(),
    metadata: { code },
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
