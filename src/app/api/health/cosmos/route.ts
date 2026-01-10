import { NextRequest, NextResponse } from "next/server";
import { checkCosmosDBHealth, initializeContainers } from "@/lib/db/cosmos-client";

/**
 * GET /api/health/cosmos
 * 
 * Check Cosmos DB health status
 * Also auto-initializes containers on first call
 * Returns status of database and all containers
 */
export async function GET(request: NextRequest) {
  try {
    // Auto-initialize containers if not already done
    try {
      console.log('[COSMOS] Initializing containers...');
      await initializeContainers();
      console.log('[COSMOS] Containers initialized successfully');
    } catch (initError) {
      console.warn('[COSMOS] Container initialization error (may already exist):', initError);
      // Don't fail - containers might already exist
    }

    // Check health status
    const health = await checkCosmosDBHealth();

    return NextResponse.json({
      success: health.isHealthy,
      ...health,
      timestamp: new Date().toISOString(),
    }, {
      status: health.isHealthy ? 200 : 503
    });
  } catch (error) {
    console.error('Cosmos DB health check failed:', error);
    
    return NextResponse.json({
      success: false,
      isHealthy: false,
      database: false,
      containers: {
        users: false,
        trades: false,
        invitationCodes: false,
        auditLogs: false,
        chatThreads: false,
        chatMessages: false,
      },
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString(),
    }, {
      status: 503
    });
  }
}
