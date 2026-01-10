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
let chatThreadsContainer: Container | null = null;
let chatMessagesContainer: Container | null = null;
let auditLogsContainer: Container | null = null;

// Track if containers have been initialized
let containersInitialized = false;

/**
 * Initialize Cosmos DB client (singleton pattern)
 */
export function getCosmosClient(): CosmosClient {
  if (!cosmosClient) {
    // Support both connection string and endpoint+key methods
    // CRITICAL: Trim all values to remove whitespace/newlines
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT?.trim();
    const key = process.env.AZURE_COSMOS_KEY?.trim();
    const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING?.trim();

    console.log('[COSMOS CLIENT] Environment check:', {
      hasEndpoint: !!endpoint,
      hasKey: !!key,
      hasConnectionString: !!connectionString,
      endpointType: typeof endpoint,
      keyType: typeof key,
      connectionStringType: typeof connectionString,
      endpointLength: endpoint?.length || 0,
      keyLength: key?.length || 0,
      connectionStringLength: connectionString?.length || 0,
      endpointPreview: endpoint?.substring(0, 50),
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('COSMOS'))
    });

    // Method 1: Use endpoint + key (PREFERRED - more stable)
    if (endpoint && key && endpoint.length > 0 && key.length > 0) {
      console.log('[COSMOS CLIENT] Using method 1: endpoint + key');
      console.log('[COSMOS CLIENT] Endpoint:', endpoint);
      console.log('[COSMOS CLIENT] Key length:', key.length);
      
      try {
        cosmosClient = new CosmosClient({
          endpoint: endpoint,
          key: key,
          connectionPolicy: {
            requestTimeout: 30000, // Increased from 10000ms to 30000ms
            enableEndpointDiscovery: false,
          },
        });
        console.log('[COSMOS CLIENT] Successfully initialized with endpoint + key');
      } catch (clientError: any) {
        console.error('[COSMOS CLIENT] Failed to create client with endpoint+key:', clientError.message);
        throw clientError;
      }
    }
    // Method 2: Use connection string if endpoint+key not available
    else if (connectionString && connectionString.length > 0) {
      console.log('[COSMOS CLIENT] Using method 2: connection string');
      
      // Parse connection string to extract endpoint and key
      const endpointMatch = connectionString.match(/AccountEndpoint=([^;]+)/);
      const keyMatch = connectionString.match(/AccountKey=([^;]+)/);
      
      if (!endpointMatch || !keyMatch) {
        console.error('[COSMOS CLIENT] Invalid connection string format');
        throw new Error("Invalid Cosmos DB connection string format");
      }

      const parsedEndpoint = endpointMatch[1];
      const parsedKey = keyMatch[1];

      console.log('[COSMOS CLIENT] Parsed endpoint length:', parsedEndpoint?.length);
      console.log('[COSMOS CLIENT] Parsed key length:', parsedKey?.length);

      cosmosClient = new CosmosClient({
        endpoint: parsedEndpoint,
        key: parsedKey,
        connectionPolicy: {
          requestTimeout: 30000, // Increased from 10000ms to 30000ms
          enableEndpointDiscovery: false,
        },
      });
    }
    // Method 3: No credentials found
    else {
      console.error('[COSMOS CLIENT] Missing Cosmos DB credentials!');
      console.error('[COSMOS CLIENT] All environment variables:', Object.keys(process.env).filter(k => k.includes('COSMOS')));
      console.error('[COSMOS CLIENT] Credential check:', {
        hasConnectionString: !!connectionString,
        connectionStringType: typeof connectionString,
        connectionStringValue: connectionString ? `${connectionString.substring(0, 30)}...` : 'undefined',
        hasEndpoint: !!endpoint,
        endpointType: typeof endpoint,
        endpointValue: endpoint || 'undefined',
        hasKey: !!key,
        keyType: typeof key,
        keyValue: key ? `${key.substring(0, 10)}...` : 'undefined'
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
    console.log('[getDatabase] Getting Cosmos client...');
    const client = getCosmosClient();
    const databaseId = (process.env.AZURE_COSMOS_DATABASE || "mpt-warrior").trim();
    console.log('[getDatabase] Connecting to database:', databaseId);
    database = client.database(databaseId);
    console.log('[getDatabase] Database instance ready');
  }

  return database;
}

/**
 * Get Users container
 * Partition key: id (same as document id for efficient single-item reads)
 */
export function getUsersContainer(): Container {
  if (!usersContainer) {
    console.log('[getUsersContainer] Getting database...');
    const db = getDatabase();
    console.log('[getUsersContainer] Getting container...');
    usersContainer = db.container("users");
    console.log('[getUsersContainer] Container ready');
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
 * Get Chat Threads container
 * Partition key: userId (group all chat threads by user)
 * Stores conversation thread metadata
 */
export function getChatThreadsContainer(): Container {
  if (!chatThreadsContainer) {
    const db = getDatabase();
    chatThreadsContainer = db.container("chat-threads");
  }

  return chatThreadsContainer;
}

/**
 * Get Chat Messages container
 * Partition key: threadId (group all messages by thread)
 * Stores individual chat messages with history
 */
export function getChatMessagesContainer(): Container {
  if (!chatMessagesContainer) {
    const db = getDatabase();
    chatMessagesContainer = db.container("chat-messages");
  }

  return chatMessagesContainer;
}

/**
 * Initialize all containers (call this on app startup)
 * This ensures containers exist - idempotent (safe to call multiple times)
 * After first call, subsequent calls return immediately
 */
export async function initializeContainers() {
  // Skip if already initialized
  if (containersInitialized) {
    return true;
  }

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

    await db.containers.createIfNotExists({
      id: "chat-threads",
      partitionKey: { paths: ["/userId"] },
    });
    console.log('✓ chat-threads container ready');

    await db.containers.createIfNotExists({
      id: "chat-messages",
      partitionKey: { paths: ["/userId"] },
    });
    console.log('✓ chat-messages container ready');

    console.log("✅ Cosmos DB containers initialized successfully");
    containersInitialized = true;
    return true;
  } catch (error) {
    console.error("❌ Error initializing Cosmos DB containers:", error);
    // Don't throw - allow requests to continue even if initialization fails
    // The containers might already exist
    containersInitialized = true; // Mark as "attempted" to avoid repeated failures
    return false;
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
    chatThreads: boolean;
    chatMessages: boolean;
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
      chatThreads: false,
      chatMessages: false,
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
