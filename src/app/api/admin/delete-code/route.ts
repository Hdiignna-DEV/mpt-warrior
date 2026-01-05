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

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const container = getCodesContainer();

    // Delete the invitation code
    await container.item(code, code).delete();

    return NextResponse.json({ 
      success: true,
      message: 'Code deleted successfully' 
    });

  } catch (error: any) {
    console.error('Delete code error:', error);
    
    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete code' },
      { status: 500 }
    );
  }
}
