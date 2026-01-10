/**
 * Notification API Route
 * POST /api/notifications/send
 * Sends notifications to users
 */

import { emailNotificationService, NotificationPayload } from '@/services/emailNotificationService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notification } = body as { notification: NotificationPayload };

    if (!notification) {
      return NextResponse.json(
        { error: 'Missing notification payload' },
        { status: 400 }
      );
    }

    // Validate notification payload
    if (!notification.type || !notification.recipient) {
      return NextResponse.json(
        { error: 'Invalid notification structure' },
        { status: 400 }
      );
    }

    // Send notification
    const success = await emailNotificationService.send(notification);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Notification sent',
        type: notification.type,
        recipient: notification.recipient.email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
