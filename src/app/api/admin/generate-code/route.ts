import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCodesContainer } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { code, description } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Validate code format
    if (!code.match(/^MPT-\d{4}-[A-Z]+$/)) {
      return NextResponse.json({ 
        error: 'Format kode tidak valid. Gunakan format: MPT-2026-ALPHA' 
      }, { status: 400 });
    }

    const container = getCodesContainer();

    // Check if code already exists
    try {
      const { resource } = await container.item(code, code).read();
      if (resource) {
        return NextResponse.json({ error: 'Kode sudah ada' }, { status: 400 });
      }
    } catch (error: any) {
      // Code doesn't exist, this is good
      if (error.code !== 404) {
        throw error;
      }
    }

    // Create new invitation code
    const newCode = {
      id: code,
      code: code,
      max_uses: 1,
      used_count: 0,
      is_active: true,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      created_at: new Date().toISOString(),
      description: description || '',
    };

    await container.items.create(newCode);

    return NextResponse.json({ 
      success: true,
      code: newCode 
    });

  } catch (error) {
    console.error('Generate code error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
