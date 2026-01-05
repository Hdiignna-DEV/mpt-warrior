/**
 * Admin API: Get Statistics
 * Provides overview metrics for Admin HQ dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin } from '@/lib/middleware/auth';
import { getUsersContainer, getCodesContainer } from '@/lib/db/cosmos-client';

export async function GET(request: NextRequest) {
  try {
    // Validate admin access
    const { decoded, error } = validateAdmin(request);
    if (error) return error;

    const usersContainer = getUsersContainer();
    const codesContainer = getCodesContainer();

    // Get user statistics
    const usersQuery = {
      query: `
        SELECT 
          c.status,
          c.role,
          COUNT(1) as count
        FROM c
        GROUP BY c.status, c.role
      `,
    };

    const { resources: userStats } = await usersContainer.items.query(usersQuery).fetchAll();

    // Calculate totals
    const totalUsers = userStats.reduce((sum, stat) => sum + stat.count, 0);
    const pendingUsers = userStats.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.count, 0);
    const activeUsers = userStats.filter(s => s.status === 'active').reduce((sum, s) => sum + s.count, 0);
    const suspendedUsers = userStats.filter(s => s.status === 'suspended').reduce((sum, s) => sum + s.count, 0);
    
    const activeWarriors = userStats.find(s => s.status === 'active' && s.role === 'WARRIOR')?.count || 0;
    const activeAdmins = userStats.find(s => s.status === 'active' && s.role === 'ADMIN')?.count || 0;
    const activeSuperAdmins = userStats.find(s => s.status === 'active' && s.role === 'SUPER_ADMIN')?.count || 0;

    // Get code statistics
    const codesQuery = {
      query: `
        SELECT 
          COUNT(1) as totalCodes,
          SUM(CASE WHEN c.is_active = true THEN 1 ELSE 0 END) as activeCodes,
          SUM(c.used_count) as totalUsage,
          SUM(c.max_uses) as totalCapacity
        FROM c
      `,
    };

    const { resources: codeStats } = await codesContainer.items.query(codesQuery).fetchAll();
    const codes = codeStats[0] || { totalCodes: 0, activeCodes: 0, totalUsage: 0, totalCapacity: 0 };

    // Get recent growth (last 7 days) - simple version
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsersQuery = {
      query: 'SELECT COUNT(1) as count FROM c WHERE c.createdAt >= @date',
      parameters: [{ name: '@date', value: sevenDaysAgo.toISOString() }],
    };

    const { resources: recentUsers } = await usersContainer.items.query(recentUsersQuery).fetchAll();
    const newUsersLast7Days = recentUsers[0]?.count || 0;

    return NextResponse.json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
          pending: pendingUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          breakdown: {
            warriors: activeWarriors,
            admins: activeAdmins,
            superAdmins: activeSuperAdmins,
          },
          growth: {
            last7Days: newUsersLast7Days,
          },
        },
        codes: {
          total: codes.totalCodes,
          active: codes.activeCodes,
          inactive: codes.totalCodes - codes.activeCodes,
          usage: {
            used: codes.totalUsage,
            capacity: codes.totalCapacity,
            usageRate: codes.totalCapacity > 0 
              ? Math.round((codes.totalUsage / codes.totalCapacity) * 100) 
              : 0,
          },
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
