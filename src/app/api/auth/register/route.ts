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

    // Create user with PENDING status
    const newUser = await createUser({
      email,
      name,
      password: hashedPassword, // Store hashed password
      whatsapp,
      telegram_id,
      invitation_code,
      role: 'PENDING',
      status: 'pending',
      settings: defaultSettings,
      stats: defaultStats,
    });

    // Mark invitation code as used
    await useInvitationCode(invitation_code, email);

    // Return success (don't include password hash in response)
    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Tunggu approval dari Commander.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        status: newUser.status,
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
