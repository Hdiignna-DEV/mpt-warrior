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

    // Build query based on role
    // SUPER_ADMIN sees all logs, ADMIN only sees their own actions
    let query = 'SELECT * FROM c';
    const parameters: any[] = [];

    if (decoded!.role === 'ADMIN') {
      // ADMIN only sees logs performed by themselves
      query += ' WHERE c.performed_by = @email';
      parameters.push({ name: '@email', value: decoded!.email });
      
      if (action) {
        query += ' AND c.action = @action';
        parameters.push({ name: '@action', value: action });
      }
    } else {
      // SUPER_ADMIN sees all logs
      if (action) {
        query += ' WHERE c.action = @action';
        parameters.push({ name: '@action', value: action });
      }
    }

    query += ' ORDER BY c.timestamp DESC';

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
