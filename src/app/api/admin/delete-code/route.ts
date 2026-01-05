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

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const container = getCodesContainer();

    // Check if code exists and is not used
    try {
      const { resource } = await container.item(code, code).read();
      if (resource && resource.used_count > 0) {
        return NextResponse.json({ 
          error: 'Cannot delete used code. Consider deactivating instead.' 
        }, { status: 400 });
      }
    } catch (error: any) {
      if (error.code === 404) {
        return NextResponse.json({ error: 'Code not found' }, { status: 404 });
      }
      throw error;
    }

    // Delete the invitation code
    await container.item(code, code).delete();

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
