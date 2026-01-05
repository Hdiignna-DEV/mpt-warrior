/**
 * Admin API: Generate Bulk Invitation Codes
 * Generate multiple codes at once with sequential naming
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '@/lib/middleware/auth';
import { getCodesContainer } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { quantity, prefix, role, description, maxUsesPerCode } = body;

    // Permission-based limits: SUPER_ADMIN = unlimited, ADMIN = max 50
    const maxAllowed = decoded!.role === 'SUPER_ADMIN' ? 100 : 50;

    // Validation
    if (!quantity || quantity < 1 || quantity > maxAllowed) {
      return NextResponse.json(
        { error: `Quantity must be between 1 and ${maxAllowed}${decoded!.role === 'ADMIN' ? ' (ADMIN limit)' : ''}` },
        { status: 400 }
      );
    }

    if (!prefix || prefix.length < 3) {
      return NextResponse.json(
        { error: 'Prefix must be at least 3 characters' },
        { status: 400 }
      );
    }

    const finalRole = role || 'WARRIOR';
    const finalMaxUses = maxUsesPerCode || 1;
    const container = getCodesContainer();

    const generatedCodes: any[] = [];
    const timestamp = Date.now();

    // Generate codes in batch
    for (let i = 1; i <= quantity; i++) {
      const paddedNumber = String(i).padStart(3, '0'); // 001, 002, 003...
      const code = `${prefix}-${paddedNumber}`;
      
      const newCode = {
        code,
        role: finalRole,
        max_uses: finalMaxUses,
        used_count: 0,
        is_active: true,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        created_by: decoded!.email,
        description: description ? `${description} (${i}/${quantity})` : `Bulk generated ${i}/${quantity}`,
      };

      try {
        const { resource } = await container.items.create(newCode);
        generatedCodes.push(resource);
      } catch (err: any) {
        console.error(`Failed to create code ${code}:`, err);
        // Continue generating other codes even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${generatedCodes.length} invitation codes`,
      codes: generatedCodes,
      quantity: generatedCodes.length,
    });
  } catch (error: any) {
    console.error('Error generating bulk codes:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
