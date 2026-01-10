/**
 * Admin API: Mark User as Founder
 * Mark a user as founder with FOUNDER role and isFounder flag
 * Only SUPER_ADMIN can access this endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSuperAdmin } from '@/lib/middleware/auth';
import { getUsersContainer } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Validate SUPER_ADMIN access
    const { decoded, error } = validateSuperAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    const container = getUsersContainer();

    // Find user by email
    const query = {
      query: 'SELECT * FROM c WHERE c.email = @email',
      parameters: [{ name: '@email', value: email }],
    };

    const { resources } = await container.items.query(query).fetchAll();

    if (resources.length === 0) {
      return NextResponse.json(
        { error: `User with email ${email} not found` },
        { status: 404 }
      );
    }

    const user = resources[0];

    // Mark user as founder
    const updatedUser = {
      ...user,
      role: 'FOUNDER',
      isFounder: true,
      status: 'active',
      approved_by: decoded!.email,
      approved_date: new Date(),
      updatedAt: new Date(),
    };

    await container.item(user.id, user.id).replace(updatedUser);

    return NextResponse.json({
      success: true,
      message: `User ${email} marked as founder successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isFounder: updatedUser.isFounder,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    console.error('Error marking user as founder:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
