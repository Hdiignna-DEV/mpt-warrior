/**
 * Admin API - Get All Users
 * List all users with filtering (ADMIN/SUPER_ADMIN only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/role-check';
import { getDatabase } from '@/utils/cosmosdb';

export async function GET(request: NextRequest) {
  return requireAdmin(request, async (req: AuthenticatedRequest) => {
    try {
      const database = await getDatabase();
      const usersContainer = database.container('users');

      // Get all users
      const { resources: users } = await usersContainer.items
        .query('SELECT * FROM c ORDER BY c.createdAt DESC')
        .fetchAll();

      // Sanitize user data (remove passwords)
      const sanitizedUsers = users.map(user => {
        const { password, ...userData } = user;
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          displayName: userData.displayName,
          warriorId: userData.warriorId || 'N/A',
          role: userData.role,
          status: userData.status,
          currentBadgeLevel: userData.currentBadgeLevel || 'RECRUIT',
          stats: userData.stats || {
            totalTrades: 0,
            wins: 0,
            losses: 0,
            winRate: 0
          },
          disciplineScore: userData.disciplineScore || 0,
          createdAt: userData.createdAt,
          lastLogin: userData.last_login,
          avatar: userData.avatar
        };
      });

      return NextResponse.json({
        success: true,
        users: sanitizedUsers,
        total: sanitizedUsers.length
      });

    } catch (error) {
      console.error('Error loading users:', error);
      return NextResponse.json(
        { error: 'Failed to load users' },
        { status: 500 }
      );
    }
  });
}
