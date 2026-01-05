/**
 * Admin API: Delete Invitation Code
 * Only SUPER_ADMIN can delete codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSuperAdmin } from '@/lib/middleware/auth';
import { getCodesContainer, getAuditLogsContainer } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Validate SUPER_ADMIN access (only SUPER_ADMIN can delete codes)
    const { decoded, error } = validateSuperAdmin(request);
    if (error) return error;

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const container = getCodesContainer();

    // Find code first (might have UUID as id)
    const query = {
      query: 'SELECT * FROM c WHERE UPPER(c.code) = UPPER(@code)',
      parameters: [{ name: '@code', value: code }],
    };
    
    const { resources } = await container.items.query(query).fetchAll();
    
    if (resources.length === 0) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    const codeDoc = resources[0];

    // Delete the invitation code
    await container.item(codeDoc.id, codeDoc.code).delete();

    // Log audit
    const auditContainer = getAuditLogsContainer();
    await auditContainer.items.create({
      action: 'code_deleted',
      performed_by: decoded!.email,
      target_code: code,
      timestamp: new Date(),
      metadata: {
        code_id: codeDoc.id,
        was_active: codeDoc.is_active,
        usage: `${codeDoc.used_count}/${codeDoc.max_uses}`
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Code deleted successfully' 
    });

  } catch (error: any) {
    console.error('Delete code error:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete code' },
      { status: 500 }
    );
  }
}
