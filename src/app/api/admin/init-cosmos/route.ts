import { NextRequest, NextResponse } from "next/server";
import { initializeContainers, checkCosmosDBHealth } from "@/lib/db/cosmos-client";
import { verifyToken } from "@/lib/auth";

/**
 * POST /api/admin/init-cosmos
 * 
 * Initialize Cosmos DB containers (chat-threads, chat-messages, etc)
 * 
 * Admin-only endpoint - creates missing containers in Azure Cosmos DB
 * 
 * Usage:
 * curl -X POST http://localhost:3000/api/admin/init-cosmos \
 *   -H "Authorization: Bearer YOUR_TOKEN" \
 *   -H "Content-Type: application/json"
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - valid token required" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - admin privileges required" },
        { status: 403 }
      );
    }

    console.log(`[COSMOS-INIT] User ${user.userId} (${user.role}) initiating Cosmos DB setup...`);

    // Initialize containers
    const initResult = await initializeContainers();

    // Verify containers were created
    const health = await checkCosmosDBHealth();

    return NextResponse.json({
      success: true,
      message: "Cosmos DB containers initialized successfully",
      initialized: initResult,
      health: {
        database: health.database,
        containers: health.containers,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("[COSMOS-INIT] Error initializing Cosmos DB:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize Cosmos DB containers",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/init-cosmos
 * 
 * Check initialization status and run if needed
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify token for security
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (token) {
      const user = await verifyToken(request);
      if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
        return NextResponse.json(
          { error: "Forbidden - admin privileges required" },
          { status: 403 }
        );
      }
    }

    console.log("[COSMOS-INIT] Checking Cosmos DB health and initializing if needed...");

    // Try to initialize containers (safe - uses createIfNotExists)
    try {
      await initializeContainers();
    } catch (e) {
      console.warn("[COSMOS-INIT] Initialization warning:", e);
      // Don't fail - containers might already exist
    }

    // Check current health
    const health = await checkCosmosDBHealth();

    return NextResponse.json({
      success: health.isHealthy,
      health: {
        isHealthy: health.isHealthy,
        database: health.database,
        containers: health.containers,
      },
      message: health.isHealthy 
        ? "✅ All Cosmos DB containers are ready" 
        : "⚠️ Some containers may need setup",
      timestamp: new Date().toISOString(),
    }, {
      status: health.isHealthy ? 200 : 206
    });

  } catch (error: any) {
    console.error("[COSMOS-INIT] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 500 }
    );
  }
}
