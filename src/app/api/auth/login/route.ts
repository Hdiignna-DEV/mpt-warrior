/**
 * Login API Route
 * Handle user authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, updateUserLogin } from '@/lib/db/user-service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi!' },
        { status: 400 }
      );
    }

    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah!' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah!' },
        { status: 401 }
      );
    }

    // Check if user is rejected
    if (user.status === 'rejected') {
      return NextResponse.json(
        { error: 'Akun Anda telah ditolak. Hubungi admin untuk informasi lebih lanjut.' },
        { status: 403 }
      );
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      return NextResponse.json(
        { error: 'Akun Anda telah di-suspend. Hubungi admin untuk informasi lebih lanjut.' },
        { status: 403 }
      );
    }

    // Update login timestamp
    await updateUserLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        whatsapp: user.whatsapp,
        telegram_id: user.telegram_id,
      },
      token,
    });

    // Set HTTP-only cookie with token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
