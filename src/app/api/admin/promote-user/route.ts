/**
 * Admin API: Promote User to Admin
 * Find user by email and promote to ADMIN with active status
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '@/lib/middleware/auth';
import { getUsersContainer } from '@/lib/db/cosmos-client';

export async function POST(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
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

    // Promote to SUPER_ADMIN if email matches, otherwise ADMIN
    const targetRole = email === 'info.mptcommunity@gmail.com' ? 'SUPER_ADMIN' : 'ADMIN';
    
    // Update user to ADMIN/SUPER_ADMIN + active
    const updatedUser = {
      ...user,
      role: targetRole,
      status: 'active',
      approved_by: decoded!.email,
      approved_date: new Date(),
      updatedAt: new Date(),
    };

    await container.item(user.id, user.id).replace(updatedUser);

    return NextResponse.json({
      success: true,
      message: `User ${email} promoted to ${targetRole} successfully`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error: any) {
    console.error('Error promoting user:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
