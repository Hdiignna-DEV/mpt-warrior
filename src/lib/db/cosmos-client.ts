/**
 * Azure Cosmos DB Client Configuration
 * Free Tier optimized for Azure for Student
 */

import { CosmosClient, Database, Container } from "@azure/cosmos";

// Singleton Cosmos Client
let cosmosClient: CosmosClient | null = null;
let database: Database | null = null;

// Containers
let usersContainer: Container | null = null;
let tradesContainer: Container | null = null;
let codesContainer: Container | null = null;
let auditLogsContainer: Container | null = null;

/**
 * Initialize Cosmos DB client (singleton pattern)
 */
export function getCosmosClient(): CosmosClient {
  if (!cosmosClient) {
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
    const key = process.env.AZURE_COSMOS_KEY;

    if (!endpoint || !key) {
      console.error('Missing Cosmos DB credentials:', {
        hasEndpoint: !!endpoint,
        hasKey: !!key,
        endpoint: endpoint ? 'SET' : 'NOT SET',
        key: key ? 'SET' : 'NOT SET'
      });
      throw new Error("Azure Cosmos DB credentials not found in environment variables");
    }

    console.log('Initializing Cosmos DB client with endpoint:', endpoint);

    cosmosClient = new CosmosClient({
      endpoint,
      key,
      connectionPolicy: {
        requestTimeout: 10000, // 10 seconds
        enableEndpointDiscovery: false,
      },
    });
  }

  return cosmosClient;
}

/**
 * Get database instance
 */
export function getDatabase(): Database {
  if (!database) {
    const client = getCosmosClient();
    const databaseId = process.env.AZURE_COSMOS_DATABASE || "mpt-warrior";
    database = client.database(databaseId);
  }

  return database;
}

/**
 * Get Users container
 * Partition key: id (same as document id for efficient single-item reads)
 */
export function getUsersContainer(): Container {
  if (!usersContainer) {
    const db = getDatabase();
    usersContainer = db.container("users");
  }

  return usersContainer;
}

/**
 * Get Trades container
 * Partition key: userId (group all trades by user)
 */
export function getTradesContainer(): Container {
  if (!tradesContainer) {
    const db = getDatabase();
    tradesContainer = db.container("trades");
  }

  return tradesContainer;
}

/**
 * Get Invitation Codes container
 * Partition key: code (for fast lookups)
 */
export function getCodesContainer(): Container {
  if (!codesContainer) {
    const db = getDatabase();
    codesContainer = db.container("invitation-codes");
  }

  return codesContainer;
}

/**
 * Get Audit Logs container
 * Partition key: performed_by (group by admin/user)
 */
export function getAuditLogsContainer(): Container {
  if (!auditLogsContainer) {
    const db = getDatabase();
    auditLogsContainer = db.container("audit-logs");
  }

  return auditLogsContainer;
}

/**
 * Initialize all containers (call this on app startup)
 * This ensures containers exist
 */
export async function initializeContainers() {
  try {
    const db = getDatabase();

    // Create containers if they don't exist
    await db.containers.createIfNotExists({
      id: "users",
      partitionKey: { paths: ["/id"] },
    });

    await db.containers.createIfNotExists({
      id: "trades",
      partitionKey: { paths: ["/userId"] },
    });

    await db.containers.createIfNotExists({
      id: "invitation-codes",
      partitionKey: { paths: ["/code"] },
    });

    await db.containers.createIfNotExists({
      id: "audit-logs",
      partitionKey: { paths: ["/performed_by"] },
    });

    console.log("✅ Cosmos DB containers initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Cosmos DB containers:", error);
    throw error;
  }
}
