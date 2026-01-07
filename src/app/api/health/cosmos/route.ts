import { NextRequest, NextResponse } from "next/server";
import { checkCosmosDBHealth } from "@/lib/db/cosmos-client";

/**
 * GET /api/health/cosmos
 * 
 * Check Cosmos DB health status
 * Returns status of database and all containers
 */
export async function GET(request: NextRequest) {
  try {
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
      },
      error: error instanceof Error ? error.message : 'Health check failed',
      timestamp: new Date().toISOString(),
    }, {
      status: 503
    });
  }
}
