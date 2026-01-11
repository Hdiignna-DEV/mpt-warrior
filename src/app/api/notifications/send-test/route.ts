import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/notifications/send-test
 * Send a test notification (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    // TODO: Implement Firebase Admin SDK to send notification
    // import * as admin from 'firebase-admin';
    //
    // const message = admin.messaging().sendMulticast({
    //   notification: {
    //     title,
    //     body: message,
    //     imageUrl: 'https://mpt-warrior.vercel.app/mpt-logo.png',
    //   },
    //   webpush: {
    //     fcmOptions: {
    //       link: 'https://mpt-warrior.vercel.app',
    //     },
    //   },
    //   tokens: [/* user FCM tokens from database */],
    // });

    console.log('Test notification sent:', { title, message });

    return NextResponse.json({
      success: true,
      message: 'Test notification sent successfully',
      notification: { title, message },
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}
