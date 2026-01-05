/**
 * User Management Service
 * CRUD operations for users in Cosmos DB
 */

import { getUsersContainer, getAuditLogsContainer } from "./cosmos-client";
import { User, UserRole, UserStatus, AuditLog } from "@/types";

/**
 * Create a new user (called during registration)
 */
export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'join_date' | 'login_count'>): Promise<User> {
  const container = getUsersContainer();
  
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    join_date: new Date(),
    login_count: 0,
  };

  const { resource } = await container.items.create(newUser);
  
  // Log audit
  await createAuditLog({
    action: 'user_registered',
    performed_by: newUser.email,
    target_user: newUser.id,
    timestamp: new Date(),
    metadata: { invitation_code: userData.invitation_code },
  });

  return resource as User;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const container = getUsersContainer();
    const { resource } = await container.item(userId, userId).read<User>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) return null;
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const container = getUsersContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.email = @email",
    parameters: [{ name: "@email", value: email }],
  };

  const { resources } = await container.items.query<User>(query).fetchAll();
  return resources[0] || null;
}

/**
 * Get all pending users (for Admin HQ)
 */
export async function getPendingUsers(): Promise<User[]> {
  const container = getUsersContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.status = @status ORDER BY c.createdAt DESC",
    parameters: [{ name: "@status", value: "pending" }],
  };

  console.log('Querying pending users with status: pending');
  const { resources } = await container.items.query<User>(query).fetchAll();
  console.log('Pending users found:', resources.length);
  console.log('Users:', resources.map(u => ({ email: u.email, status: u.status, role: u.role })));
  return resources;
}

/**
 * Approve user (change status to active)
 */
export async function approveUser(userId: string, approvedBy: string): Promise<User> {
  const container = getUsersContainer();
  
  const { resource: user } = await container.item(userId, userId).read<User>();
  
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser: User = {
    ...user,
    status: 'active',
    role: 'WARRIOR',
    approved_date: new Date(),
    approved_by: approvedBy,
    updatedAt: new Date(),
  };

  const { resource } = await container.item(userId, userId).replace(updatedUser);
  
  // Log audit
  await createAuditLog({
    action: 'user_approved',
    performed_by: approvedBy,
    target_user: userId,
    timestamp: new Date(),
  });

  return resource as User;
}

/**
 * Reject user (change status to rejected)
 */
export async function rejectUser(userId: string, rejectedBy: string): Promise<void> {
  const container = getUsersContainer();
  
  const { resource: user } = await container.item(userId, userId).read<User>();
  
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser: User = {
    ...user,
    status: 'rejected',
    updatedAt: new Date(),
  };

  await container.item(userId, userId).replace(updatedUser);
  
  // Log audit
  await createAuditLog({
    action: 'user_rejected',
    performed_by: rejectedBy,
    target_user: userId,
    timestamp: new Date(),
  });
}

/**
 * Suspend user
 */
export async function suspendUser(userId: string, suspendedBy: string): Promise<User> {
  const container = getUsersContainer();
  
  const { resource: user } = await container.item(userId, userId).read<User>();
  
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser: User = {
    ...user,
    status: 'suspended',
    updatedAt: new Date(),
  };

  const { resource } = await container.item(userId, userId).replace(updatedUser);
  
  // Log audit
  await createAuditLog({
    action: 'user_suspended',
    performed_by: suspendedBy,
    target_user: userId,
    timestamp: new Date(),
  });

  return resource as User;
}

/**
 * Update user login timestamp
 */
export async function updateUserLogin(userId: string): Promise<void> {
  const container = getUsersContainer();
  
  const { resource: user } = await container.item(userId, userId).read<User>();
  
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser: User = {
    ...user,
    last_login: new Date(),
    login_count: (user.login_count || 0) + 1,
    updatedAt: new Date(),
  };

  await container.item(userId, userId).replace(updatedUser);
}

/**
 * Get all active users (WARRIOR role)
 */
export async function getActiveUsers(): Promise<User[]> {
  const container = getUsersContainer();
  
  const query = {
    query: "SELECT * FROM c WHERE c.status = @status AND c.role = @role ORDER BY c.join_date DESC",
    parameters: [
      { name: "@status", value: "active" },
      { name: "@role", value: "WARRIOR" },
    ],
  };

  const { resources } = await container.items.query<User>(query).fetchAll();
  return resources;
}

/**
 * Create audit log entry
 */
async function createAuditLog(logData: Omit<AuditLog, 'id'>): Promise<void> {
  const container = getAuditLogsContainer();
  
  const log: AuditLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  };

  await container.items.create(log);
}

/**
 * Get audit logs (for admin)
 */
export async function getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
  const container = getAuditLogsContainer();
  
  const query = {
    query: `SELECT TOP ${limit} * FROM c ORDER BY c.timestamp DESC`,
  };

  const { resources } = await container.items.query<AuditLog>(query).fetchAll();
  return resources;
}
