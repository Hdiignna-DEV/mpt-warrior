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

    // Delete the invitation code directly
    // Note: Admin has full control to delete any code
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
