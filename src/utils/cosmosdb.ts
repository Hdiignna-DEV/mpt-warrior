import { CosmosClient, Container, Database } from "@azure/cosmos";

// Initialize Cosmos DB client
let cosmosClient: CosmosClient | null = null;
let database: Database | null = null;

export const getCosmosClient = () => {
  if (!cosmosClient) {
    const connectionString =
      process.env.NEXT_PUBLIC_COSMOS_CONNECTION_STRING ||
      "AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QkCqFY=;";

    cosmosClient = new CosmosClient({
      endpoint: connectionString.split(";")[0].split("=")[1],
      key: connectionString
        .split(";")
        .find((s) => s.includes("AccountKey"))
        ?.split("=")[1] || "",
    });
  }

  return cosmosClient;
};

export const getDatabase = async (): Promise<Database> => {
  if (!database) {
    const client = getCosmosClient();
    const { database: db } = await client.databases.createIfNotExists({
      id: "mpt-warrior",
    });
    database = db;
  }

  return database;
};

export const getContainer = async (
  containerName: string
): Promise<Container> => {
  const db = await getDatabase();
  const { container } = await db.containers.createIfNotExists({
    id: containerName,
    partitionKey: "/userId",
  });

  return container;
};

// Trade operations
export interface Trade {
  id: string;
  userId: string;
  pair: string;
  posisi: "BUY" | "SELL";
  hasil: "WIN" | "LOSS";
  pip: number;
  tanggal: string;
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

export const saveTrade = async (userId: string, trade: Omit<Trade, "userId" | "createdAt" | "updatedAt">) => {
  try {
    const container = await getContainer("trades");
    const tradeWithMetadata: Trade = {
      ...trade,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await container.items.create(tradeWithMetadata);
    return tradeWithMetadata;
  } catch (error) {
    console.error("Error saving trade:", error);
    throw error;
  }
};

export const getTrades = async (userId: string): Promise<Trade[]> => {
  try {
    const container = await getContainer("trades");
    const { resources } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.tanggal DESC",
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();

    return resources as Trade[];
  } catch (error) {
    console.error("Error fetching trades:", error);
    return [];
  }
};

export const updateTrade = async (userId: string, tradeId: string, updates: Partial<Trade>) => {
  try {
    const container = await getContainer("trades");
    const trade = await container.item(tradeId, userId).read();

    const updated = {
      ...trade.resource,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await container.item(tradeId, userId).replace(updated);
    return updated;
  } catch (error) {
    console.error("Error updating trade:", error);
    throw error;
  }
};

export const deleteTrade = async (userId: string, tradeId: string) => {
  try {
    const container = await getContainer("trades");
    await container.item(tradeId, userId).delete();
  } catch (error) {
    console.error("Error deleting trade:", error);
    throw error;
  }
};

// User settings
export interface UserSettings {
  id: string;
  userId: string;
  initialBalance: number;
  theme: "light" | "dark" | "system";
  currency: string;
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const saveUserSettings = async (userId: string, settings: Partial<Omit<UserSettings, "id" | "userId" | "createdAt" | "updatedAt">>) => {
  try {
    const container = await getContainer("userSettings");

    const userSettings: UserSettings = {
      id: userId,
      userId,
      initialBalance: settings.initialBalance || 10000,
      theme: settings.theme || "dark",
      currency: settings.currency || "USD",
      notificationsEnabled: settings.notificationsEnabled !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await container.item(userId, userId).read();
      await container.item(userId, userId).replace(userSettings);
    } catch {
      await container.items.create(userSettings);
    }

    return userSettings;
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const container = await getContainer("userSettings");
    const { resource } = await container.item(userId, userId).read();
    return resource as UserSettings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
};

// Chat history
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export const saveChatHistory = async (userId: string, chatHistory: Omit<ChatHistory, "userId" | "createdAt" | "updatedAt">) => {
  try {
    const container = await getContainer("chatHistory");

    const history: ChatHistory = {
      ...chatHistory,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await container.items.create(history);
    return history;
  } catch (error) {
    console.error("Error saving chat history:", error);
    throw error;
  }
};

export const getChatHistories = async (userId: string): Promise<ChatHistory[]> => {
  try {
    const container = await getContainer("chatHistory");
    const { resources } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.updatedAt DESC",
        parameters: [{ name: "@userId", value: userId }],
      })
      .fetchAll();

    return resources as ChatHistory[];
  } catch (error) {
    console.error("Error fetching chat histories:", error);
    return [];
  }
};

export const updateChatHistory = async (userId: string, chatId: string, updates: Partial<ChatHistory>) => {
  try {
    const container = await getContainer("chatHistory");
    const chat = await container.item(chatId, userId).read();

    const updated = {
      ...chat.resource,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await container.item(chatId, userId).replace(updated);
    return updated;
  } catch (error) {
    console.error("Error updating chat history:", error);
    throw error;
  }
};

export const deleteChatHistory = async (userId: string, chatId: string) => {
  try {
    const container = await getContainer("chatHistory");
    await container.item(chatId, userId).delete();
  } catch (error) {
    console.error("Error deleting chat history:", error);
    throw error;
  }
};
