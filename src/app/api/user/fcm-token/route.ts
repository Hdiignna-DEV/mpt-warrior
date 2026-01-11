/**
 * API Endpoint: Save FCM Token
 * POST /api/user/fcm-token
 */

import { NextRequest, NextResponse } from 'next/server';
import { CosmosClient } from '@azure/cosmos';

interface FCMTokenRequest {
  fcmToken: string;
  userId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    // TODO: Verify JWT token

    const body: FCMTokenRequest = await request.json();
    const { fcmToken, userId, deviceInfo } = body;

    if (!fcmToken || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Cosmos DB
    const client = new CosmosClient({
      endpoint: process.env.AZURE_COSMOS_ENDPOINT || '',
      key: process.env.AZURE_COSMOS_KEY || '',
    });

    const database = client.database(process.env.AZURE_COSMOS_DATABASE || '');
    const container = database.container('fcm-tokens');

    // Save FCM token
    const fcmTokenDoc = {
      id: `${userId}-${Date.now()}`,
      userId,
      fcmToken,
      deviceInfo,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      isActive: true,
    };

    await container.items.create(fcmTokenDoc);

    return NextResponse.json({
      success: true,
      message: 'FCM token saved',
    });
  } catch (error) {
    console.error('[API] Error saving FCM token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint: Get user's FCM tokens
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Initialize Cosmos DB
    const client = new CosmosClient({
      endpoint: process.env.AZURE_COSMOS_ENDPOINT || '',
      key: process.env.AZURE_COSMOS_KEY || '',
    });

    const database = client.database(process.env.AZURE_COSMOS_DATABASE || '');
    const container = database.container('fcm-tokens');

    // Query active FCM tokens for user
    const { resources: tokens } = await container.items
      .query({
        query: `SELECT * FROM c WHERE c.userId = @userId AND c.isActive = true`,
        parameters: [{ name: '@userId', value: userId }],
      })
      .fetchAll();

    return NextResponse.json({
      success: true,
      tokens,
      count: tokens.length,
    });
  } catch (error) {
    console.error('[API] Error getting FCM tokens:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
