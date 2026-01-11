// API Route untuk meregister FCM token
// POST /api/notifications/register-token

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: 'FCM token is required' },
        { status: 400 }
      );
    }

    // Validate session
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Save token to database (Cosmos DB)
    // This would normally interact with your database
    console.log(`[FCM] Registering token for user: ${session.user.email}`);
    
    // TODO: Save to Cosmos DB
    // const container = cosmosClient.database(databaseId).container('user_fcm_tokens');
    // await container.items.create({
    //   userId: session.user.id,
    //   email: session.user.email,
    //   token: token,
    //   registeredAt: new Date(),
    //   updatedAt: new Date(),
    // });

    return NextResponse.json(
      { success: true, message: 'FCM token registered successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[FCM] Error registering token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
