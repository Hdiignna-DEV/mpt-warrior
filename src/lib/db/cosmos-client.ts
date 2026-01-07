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
    // Support both connection string and endpoint+key methods
    const connectionString = process.env.NEXT_PUBLIC_COSMOS_CONNECTION_STRING || process.env.AZURE_COSMOS_CONNECTION_STRING;
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
    const key = process.env.AZURE_COSMOS_KEY;

    // Method 1: Use connection string if available
    if (connectionString) {
      console.log('Initializing Cosmos DB with connection string');
      
      // Parse connection string to extract endpoint and key
      const endpointMatch = connectionString.match(/AccountEndpoint=([^;]+)/);
      const keyMatch = connectionString.match(/AccountKey=([^;]+)/);
      
      if (!endpointMatch || !keyMatch) {
        console.error('Invalid connection string format');
        throw new Error("Invalid Cosmos DB connection string format");
      }

      cosmosClient = new CosmosClient({
        endpoint: endpointMatch[1],
        key: keyMatch[1],
        connectionPolicy: {
          requestTimeout: 10000,
          enableEndpointDiscovery: false,
        },
      });
    }
    // Method 2: Use endpoint + key separately
    else if (endpoint && key) {
      console.log('Initializing Cosmos DB with endpoint + key');
      
      cosmosClient = new CosmosClient({
        endpoint,
        key,
        connectionPolicy: {
          requestTimeout: 10000,
          enableEndpointDiscovery: false,
        },
      });
    }
    // Method 3: No credentials found
    else {
      console.error('Missing Cosmos DB credentials:', {
        hasConnectionString: !!connectionString,
        hasEndpoint: !!endpoint,
        hasKey: !!key
      });
      throw new Error("Azure Cosmos DB credentials not found in environment variables");
    }
  }

  return cosmosClient;
}

/**
 * Get database instance
 */
export function getDatabase(): Database {
  if (!database) {
    const client = getCosmosClient();
    const databaseId = process.env.AZURE_COSMOS_DATABASE || process.env.NEXT_PUBLIC_COSMOS_DATABASE || "MPT";
    console.log('Connecting to database:', databaseId);
    console.log('Available env vars:', {
      AZURE_COSMOS_DATABASE: process.env.AZURE_COSMOS_DATABASE || 'NOT SET',
      NEXT_PUBLIC_COSMOS_DATABASE: process.env.NEXT_PUBLIC_COSMOS_DATABASE || 'NOT SET',
      usingDefault: !process.env.AZURE_COSMOS_DATABASE && !process.env.NEXT_PUBLIC_COSMOS_DATABASE
    });
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
