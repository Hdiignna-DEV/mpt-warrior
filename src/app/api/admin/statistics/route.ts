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

    // Get all users (simpler query, calculate in code)
    const { resources: allUsers } = await usersContainer.items
      .query('SELECT * FROM c')
      .fetchAll();

    // Calculate statistics in code
    const totalUsers = allUsers.length;
    const pendingUsers = allUsers.filter(u => u.status === 'pending').length;
    const activeUsers = allUsers.filter(u => u.status === 'active').length;
    const suspendedUsers = allUsers.filter(u => u.status === 'suspended').length;
    
    const activeWarriors = allUsers.filter(u => u.status === 'active' && u.role === 'WARRIOR').length;
    const activeAdmins = allUsers.filter(u => u.status === 'active' && u.role === 'ADMIN').length;
    const activeSuperAdmins = allUsers.filter(u => u.status === 'active' && u.role === 'SUPER_ADMIN').length;

    // Get all codes (calculate in code)
    const { resources: allCodes } = await codesContainer.items
      .query('SELECT * FROM c')
      .fetchAll();

    const totalCodes = allCodes.length;
    const activeCodes = allCodes.filter(c => c.is_active === true).length;
    const totalUsage = allCodes.reduce((sum, c) => sum + (c.used_count || 0), 0);
    const totalCapacity = allCodes.reduce((sum, c) => sum + (c.max_uses || 0), 0);

    // Calculate recent growth (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLast7Days = allUsers.filter(u => {
      const createdAt = new Date(u.createdAt);
      return createdAt >= sevenDaysAgo;
    }).length;

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
          total: totalCodes,
          active: activeCodes,
          inactive: totalCodes - activeCodes,
          usage: {
            used: totalUsage,
            capacity: totalCapacity,
            usageRate: totalCapacity > 0 
              ? Math.round((totalUsage / totalCapacity) * 100) 
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
