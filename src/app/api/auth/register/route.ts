/**
 * Registration API Route
 * Handle user registration with invitation code validation
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail } from '@/lib/db/user-service';
import { validateInvitationCode, useInvitationCode } from '@/lib/db/code-service';
import { User, UserSettings, UserStats } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, whatsapp, telegram_id, invitation_code } = body;

    // Validation
    if (!name || !email || !password || !invitation_code) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi!' },
        { status: 400 }
      );
    }

    if (!whatsapp && !telegram_id) {
      return NextResponse.json(
        { error: 'Isi minimal WhatsApp atau Telegram ID!' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter!' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar!' },
        { status: 400 }
      );
    }

    // Validate invitation code
    const codeValidation = await validateInvitationCode(invitation_code);
    if (!codeValidation.valid) {
      return NextResponse.json(
        { error: `Invitation code invalid: ${codeValidation.reason}` },
        { status: 400 }
      );
    }

    // Get role from invitation code (default to WARRIOR if not specified)
    const assignedRole = codeValidation.code?.role || 'WARRIOR';
    const codeBenefits = codeValidation.code?.benefits || {};

    // IMPORTANT: Mark invitation code as used FIRST (this also awards war points if referral)
    // If this fails, we don't create the user (prevents orphaned users)
    const codeUseResult = await useInvitationCode(invitation_code, email);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create default settings
    const defaultSettings: UserSettings = {
      theme: 'dark',
      currency: 'USD',
      timezone: 'Asia/Jakarta',
      notifications: true,
      language: 'id',
      riskPercent: 1,
    };

    // Create default stats
    const defaultStats: UserStats = {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalProfit: 0,
      bestWin: 0,
      worstLoss: 0,
      streakWins: 0,
      streakLosses: 0,
      largestWin: 0,
      largestLoss: 0,
    };

    // Generate Warrior ID: MPT-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const warriorId = `MPT-${year}-${randomNum}`;

    // Apply code benefits
    let initialBadgeLevel = codeBenefits.startBadgeLevel || 'RECRUIT';
    let initialBadges: any[] = [];
    
    // If code has badges, add them
    if (codeBenefits.badgesToAdd && codeBenefits.badgesToAdd.length > 0) {
      initialBadges = codeBenefits.badgesToAdd.map(badgeType => ({
        type: badgeType,
        level: initialBadgeLevel,
        name: `${badgeType} Badge`,
        description: `Earned via ${codeValidation.code?.codeType || 'LEGACY'} code`,
        icon: 'badge-icon',
        color: '#FFD700',
        gradient: 'from-yellow-500 to-amber-600',
        earnedAt: new Date(),
      }));
    }

    // Store referral discount info (will be used during checkout)
    const membershipData = {
      discountPercent: codeBenefits.discountPercent || 0,
      referrerId: codeValidation.code?.referrerId,
      invitationCodeUsed: codeValidation.code?.code,
    };

    // Create user with role from invitation code
    // ALL users (ADMIN & WARRIOR) require approval for security
    const newUser = await createUser({
      email,
      name,
      password: hashedPassword, // Store hashed password
      whatsapp,
      telegram_id,
      invitation_code,
      role: assignedRole === 'ADMIN' ? 'ADMIN' : 'WARRIOR',
      status: 'pending', // All users need approval, even admins
      settings: defaultSettings,
      stats: defaultStats,
      // Warrior Profile System fields
      warriorId,
      currentBadgeLevel: initialBadgeLevel,
      badges: initialBadges,
      disciplineScore: 500, // Start at mid-point
      profileSettings: {
        personalGoal: '',
        tradingStrategy: 'DAY_TRADING',
        preferredTimeframe: '',
        bio: ''
      }
    });

    // Return success (don't include password hash in response)
    const roleMessage = assignedRole === 'ADMIN' 
      ? 'Pendaftaran sebagai ADMIN berhasil! Tunggu approval dari Super Commander.' 
      : 'Pendaftaran berhasil! Tunggu approval dari Commander.';
    
    return NextResponse.json({
      success: true,
      message: roleMessage,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        status: newUser.status,
        role: newUser.role,
        warriorId: newUser.warriorId,
        badges: newUser.badges,
        currentBadgeLevel: newUser.currentBadgeLevel,
      },
      benefits: {
        discountPercent: membershipData.discountPercent,
        badgesEarned: initialBadges.length,
        startingLevel: initialBadgeLevel,
        referrerEarnings: codeUseResult.warPointsAwarded ? `${codeUseResult.warPointsAwarded} War Points awarded to referrer` : undefined,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
