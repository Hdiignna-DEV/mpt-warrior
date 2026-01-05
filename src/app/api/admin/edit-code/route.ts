import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getCodesContainer } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminCheck = await requireAdmin(request);
    if (adminCheck instanceof Response) {
      return adminCheck;
    }

    const { code, max_uses, description, is_active } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (max_uses !== undefined && (isNaN(max_uses) || max_uses < 1)) {
      return NextResponse.json({ error: 'max_uses must be a positive number' }, { status: 400 });
    }

    const container = getCodesContainer();

    // Get existing code
    const { resource: existingCode } = await container.item(code, code).read();

    if (!existingCode) {
      return NextResponse.json({ error: 'Code not found' }, { status: 404 });
    }

    // Validate: used_count can't exceed new max_uses
    if (max_uses !== undefined && existingCode.used_count > max_uses) {
      return NextResponse.json({ 
        error: `Code sudah dipakai ${existingCode.used_count}x. max_uses harus >= ${existingCode.used_count}` 
      }, { status: 400 });
    }

    // Update code
    const updatedCode = {
      ...existingCode,
      max_uses: max_uses !== undefined ? max_uses : existingCode.max_uses,
      description: description !== undefined ? description : existingCode.description,
      is_active: is_active !== undefined ? is_active : existingCode.is_active,
    };

    await container.item(code, code).replace(updatedCode);

    return NextResponse.json({ 
      success: true,
      code: updatedCode 
    });

  } catch (error: any) {
    console.error('Edit code error:', error);
    return NextResponse.json(
      { error: 'Failed to edit code' },
      { status: 500 }
    );
  }
}
