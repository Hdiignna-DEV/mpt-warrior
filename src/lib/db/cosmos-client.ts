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
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
    const key = process.env.AZURE_COSMOS_KEY;
    const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING;

    // Method 1: Use endpoint + key (PREFERRED - more stable)
    if (endpoint && key && typeof endpoint === 'string' && typeof key === 'string') {
      console.log('Initializing Cosmos DB with endpoint + key');
      
      // Validate endpoint and key are not empty
      if (endpoint.length === 0 || key.length === 0) {
        console.error('Endpoint or key is empty');
        throw new Error("Empty Cosmos DB endpoint or key");
      }
      
      cosmosClient = new CosmosClient({
        endpoint,
        key,
        connectionPolicy: {
          requestTimeout: 10000,
          enableEndpointDiscovery: false,
        },
      });
    }
    // Method 2: Use connection string if endpoint+key not available
    else if (connectionString && typeof connectionString === 'string') {
      console.log('Initializing Cosmos DB with connection string');
      
      // Validate connection string is actually a string
      if (connectionString.length === 0) {
        console.error('Connection string is empty');
        throw new Error("Empty Cosmos DB connection string");
      }
      
      // Parse connection string to extract endpoint and key
      const endpointMatch = connectionString.match(/AccountEndpoint=([^;]+)/);
      const keyMatch = connectionString.match(/AccountKey=([^;]+)/);
      
      if (!endpointMatch || !keyMatch) {
        console.error('Invalid connection string format. Expected: AccountEndpoint=...;AccountKey=...');
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
    // Method 3: No credentials found
    else {
      console.error('Missing Cosmos DB credentials:', {
        hasConnectionString: !!connectionString,
        connectionStringType: typeof connectionString,
        hasEndpoint: !!endpoint,
        endpointType: typeof endpoint,
        hasKey: !!key,
        keyType: typeof key
      });
      throw new Error("Azure Cosmos DB credentials not found or invalid in environment variables");
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
    const databaseId = process.env.AZURE_COSMOS_DATABASE || "mpt-warrior";
    console.log('Connecting to database:', databaseId);
    console.log('Available env vars:', {
      AZURE_COSMOS_DATABASE: process.env.AZURE_COSMOS_DATABASE || 'NOT SET',
      usingDefault: !process.env.AZURE_COSMOS_DATABASE
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

    console.log('Initializing Cosmos DB containers...');

    // Create containers if they don't exist
    await db.containers.createIfNotExists({
      id: "users",
      partitionKey: { paths: ["/id"] },
    });
    console.log('✓ users container ready');

    await db.containers.createIfNotExists({
      id: "trades",
      partitionKey: { paths: ["/userId"] },
    });
    console.log('✓ trades container ready');

    await db.containers.createIfNotExists({
      id: "invitation-codes",
      partitionKey: { paths: ["/code"] },
    });
    console.log('✓ invitation-codes container ready');

    await db.containers.createIfNotExists({
      id: "audit-logs",
      partitionKey: { paths: ["/performed_by"] },
    });
    console.log('✓ audit-logs container ready');

    console.log("✅ Cosmos DB containers initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Error initializing Cosmos DB containers:", error);
    throw error;
  }
}

/**
 * Check if Cosmos DB is properly configured and accessible
 * Returns object with status and error details
 */
export async function checkCosmosDBHealth(): Promise<{
  isHealthy: boolean;
  database: boolean;
  containers: {
    users: boolean;
    trades: boolean;
    invitationCodes: boolean;
    auditLogs: boolean;
  };
  error?: string;
}> {
  const result = {
    isHealthy: false,
    database: false,
    containers: {
      users: false,
      trades: false,
      invitationCodes: false,
      auditLogs: false,
    },
    error: undefined as string | undefined,
  };

  try {
    // Check if client can be created
    const client = getCosmosClient();
    
    // Check if database exists
    const db = getDatabase();
    await db.read();
    result.database = true;

    // Check each container
    try {
      const usersContainer = getUsersContainer();
      await usersContainer.read();
      result.containers.users = true;
    } catch (e) {
      console.error('users container not found:', e);
    }

    try {
      const tradesContainer = getTradesContainer();
      await tradesContainer.read();
      result.containers.trades = true;
    } catch (e) {
      console.error('trades container not found:', e);
    }

    try {
      const codesContainer = getCodesContainer();
      await codesContainer.read();
      result.containers.invitationCodes = true;
    } catch (e) {
      console.error('invitation-codes container not found:', e);
    }

    try {
      const auditContainer = getAuditLogsContainer();
      await auditContainer.read();
      result.containers.auditLogs = true;
    } catch (e) {
      console.error('audit-logs container not found:', e);
    }

    // Check if all containers are healthy
    result.isHealthy = 
      result.database && 
      result.containers.users && 
      result.containers.trades && 
      result.containers.invitationCodes && 
      result.containers.auditLogs;

    if (!result.isHealthy) {
      const missingContainers = [];
      if (!result.containers.users) missingContainers.push('users');
      if (!result.containers.trades) missingContainers.push('trades');
      if (!result.containers.invitationCodes) missingContainers.push('invitation-codes');
      if (!result.containers.auditLogs) missingContainers.push('audit-logs');
      
      result.error = `Missing containers: ${missingContainers.join(', ')}. Run 'npm run db:init' to create them.`;
    }

    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
    return result;
  }
}
