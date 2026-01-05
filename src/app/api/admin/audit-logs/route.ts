/**
 * Admin API: Get Audit Logs
 * View all system activity and user actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '@/lib/middleware/auth';
import { getAuditLogsContainer } from '@/lib/db/cosmos-client';

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action'); // Filter by action type

    const container = getAuditLogsContainer();

    // Build query
    let query = 'SELECT * FROM c ORDER BY c.timestamp DESC';
    const parameters: any[] = [];

    if (action) {
      query = 'SELECT * FROM c WHERE c.action = @action ORDER BY c.timestamp DESC';
      parameters.push({ name: '@action', value: action });
    }

    // Add limit
    query += ` OFFSET 0 LIMIT ${Math.min(limit, 100)}`;

    const { resources } = await container.items
      .query({ query, parameters })
      .fetchAll();

    return NextResponse.json({
      success: true,
      logs: resources,
      count: resources.length,
    });
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
