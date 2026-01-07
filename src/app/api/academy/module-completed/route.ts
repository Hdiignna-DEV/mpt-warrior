/**
 * API Route: /api/academy/module-completed
 * POST - Trigger module completion email
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { sendModuleCompletionEmail } from '@/lib/email/resend-client';
import { getCosmosClient } from '@/lib/db/cosmosClient';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { moduleId, quizScore } = await request.json();

    if (!moduleId || quizScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user and module details
    const { database } = await getCosmosClient();
    const usersContainer = database.container('users');
    const modulesContainer = database.container('educational-modules');

    const { resource: user } = await usersContainer.item(decoded.userId, decoded.userId).read();
    const { resource: module } = await modulesContainer.item(moduleId, moduleId).read();

    if (!user || !module) {
      return NextResponse.json(
        { error: 'User or module not found' },
        { status: 404 }
      );
    }

    // Get next module if exists
    const nextModuleNumber = module.moduleNumber + 1;
    const { resources: modules } = await modulesContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.moduleNumber = @num',
        parameters: [{ name: '@num', value: nextModuleNumber }]
      })
      .fetchAll();
    
    const nextModule = modules.length > 0 ? modules[0] : null;

    // Send email
    if (user.email) {
      await sendModuleCompletionEmail(
        user.email,
        user.name,
        module.title,
        module.moduleNumber,
        quizScore,
        nextModule?.title
      );
      console.log('📧 Module completion email sent to:', user.email);
    }

    return NextResponse.json({
      success: true,
      message: 'Module completion email sent',
    });

  } catch (error: any) {
    console.error('Error sending module completion email:', error);
    // Don't fail the request if email fails
    return NextResponse.json(
      { success: true, message: 'Module completed but email failed', error: error.message },
      { status: 200 }
    );
  }
}
