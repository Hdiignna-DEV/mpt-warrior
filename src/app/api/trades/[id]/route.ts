/**
 * Single Trade API - GET/PUT/DELETE by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getTradeById, updateTrade, deleteTrade } from '@/lib/db/trade-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (decoded.status !== 'active') {
      return NextResponse.json({ error: 'Account not active' }, { status: 403 });
    }

    const { id } = await params;
    const trade = await getTradeById(decoded.userId, id);
    
    if (!trade) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, trade });
  } catch (error: any) {
    console.error('Error fetching trade:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (decoded.status !== 'active') {
      return NextResponse.json({ error: 'Account not active' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const updatedTrade = await updateTrade(decoded.userId, id, body);

    return NextResponse.json({
      success: true,
      message: 'Trade updated successfully',
      trade: updatedTrade,
    });
  } catch (error: any) {
    console.error('Error updating trade:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (decoded.status !== 'active') {
      return NextResponse.json({ error: 'Account not active' }, { status: 403 });
    }

    const { id } = await params;
    await deleteTrade(decoded.userId, id);

    return NextResponse.json({
      success: true,
      message: 'Trade deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting trade:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
