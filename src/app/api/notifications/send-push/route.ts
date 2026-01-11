// API Route untuk mengirim notifikasi Push (FCM)
// POST /api/notifications/send-push

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { title, body, type, userIds, data } = await req.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }

    console.log('[FCM] Push notification request:', {
      title,
      type: type || 'broadcast',
      recipients: userIds?.length || 'broadcast',
    });

    // TODO: Implement Firebase Admin SDK
    // const admin = require('firebase-admin');
    // const messaging = admin.messaging();
    //
    // const message = {
    //   notification: { title, body },
    //   data: { type: type || 'broadcast', ...data },
    //   android: { priority: 'high', ttl: 86400 },
    //   apns: {
    //     payload: {
    //       aps: {
    //         sound: 'default',
    //         badge: 1,
    //       },
    //     },
    //   },
    // };
    //
    // if (userIds && Array.isArray(userIds)) {
    //   // Send to specific users
    //   const responses = await messaging.sendMulticast({
    //     ...message,
    //     tokens: userIds,
    //   });
    // } else {
    //   // Send to all subscribers
    //   const topic = 'mpt-warrior-broadcast';
    //   await messaging.send({
    //     ...message,
    //     topic,
    //   });
    // }

    return NextResponse.json(
      { success: true, message: 'Push notification sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[FCM] Error sending push notification:', error);
    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    );
  }
}
